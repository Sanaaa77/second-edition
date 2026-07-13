import { createClient } from "@/lib/supabase/client";
import { HardenedDocument, DocumentType } from "@/types/workflow";
import { domainEventBus } from "@/lib/core/events/EventBus";
import { BaseService } from "../BaseService";
import { cacheManager } from "@/lib/core/cache/CacheManager";
import { ValidationError, RepositoryError } from "@/lib/core/errors/AppErrors";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export class DocumentService extends BaseService {
  async getMyDocuments(): Promise<HardenedDocument[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    return this.execute(
      async () => {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('profile_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw new RepositoryError(error.message);
        return (data || []) as HardenedDocument[];
      },
      {
        name: 'DocumentService.getMyDocuments',
        cacheKey: `documents_${user.id}`
      }
    );
  }

  async upload(file: File, type: DocumentType): Promise<HardenedDocument> {
    if (file.size > MAX_FILE_SIZE) throw new ValidationError("حجم فایل بیش از ۱۰ مگابایت است.");
    if (!ALLOWED_TYPES.includes(file.type)) throw new ValidationError("فرمت فایل نامعتبر است (فقط PDF, JPG, PNG).");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filePath = `${user.id}/general/${type.toLowerCase()}/${timestamp}_${sanitizedName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw new RepositoryError(uploadError.message);

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    const { data, error: dbError } = await supabase
      .from('documents')
      .insert({
        profile_id: user.id,
        name: file.name,
        type,
        file_url: publicUrl,
        storage_path: filePath,
        status: 'Pending',
        version: 1,
        metadata: {
          size: file.size,
          mime: file.type
        }
      })
      .select()
      .single();

    if (dbError) throw new RepositoryError(dbError.message);

    cacheManager.invalidatePattern(`documents_${user.id}`);

    await domainEventBus.publish({
      type: 'DocumentUploaded',
      payload: {
        profileId: user.id,
        documentId: data.id,
        documentType: type
      },
      metadata: {
        timestamp: new Date().toISOString(),
        actorId: user.id,
        correlationId: crypto.randomUUID()
      }
    });

    return data as HardenedDocument;
  }

  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    await this.execute(
      async () => {
        const { data: doc } = await supabase.from('documents').select('storage_path').eq('id', id).single();
        
        if (doc?.storage_path) {
          await supabase.storage.from('documents').remove([doc.storage_path]);
        }

        const { error } = await supabase.from('documents').delete().eq('id', id);
        if (error) throw new RepositoryError(error.message);

        if (user) {
          cacheManager.invalidatePattern(`documents_${user.id}`);
        }
      },
      { name: `DocumentService.delete(${id})` }
    );
  }
}
