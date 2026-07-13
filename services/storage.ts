import { createClient } from "@/lib/supabase/client";

export const storageService = {
  async uploadFile(bucket: string, file: File, path: string) {
    const supabase = createClient();
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
  },

  async listFiles(bucket: string, path?: string) {
    const supabase = createClient();
    const { data, error } = await supabase.storage.from(bucket).list(path);
    if (error) throw error;
    return data;
  }
};
