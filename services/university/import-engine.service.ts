import { BaseService } from "../BaseService";
import { getSupabaseClient } from "@/lib/supabase/utils";
import { Logger } from "@/lib/core/logging/Logger";
import { ImportResult } from "@/types/knowledge";

export type ImportEntityType = 'university' | 'program' | 'city' | 'scholarship' | 'article';

export class ImportEngineService extends BaseService {
  async importData(type: ImportEntityType, data: Record<string, any>[], adminId: string): Promise<ImportResult> {
    return this.execute(async () => {
      const supabase = getSupabaseClient();
      const tableName = this.getTableName(type);
      
      let success = 0;
      let failed = 0;
      const errors: Array<{ batch: number; message: string }> = [];

      Logger.info(`Starting import of ${data.length} records for ${type}`);

      const batchSize = 50;
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        const { error } = await supabase.from(tableName).upsert(batch, {
          onConflict: type === 'university' || type === 'city' ? 'slug' : 'id'
        });

        if (error) {
          failed += batch.length;
          errors.push({ batch: i / batchSize, message: error.message });
          Logger.error(`Import failed for batch ${i / batchSize}`, error);
        } else {
          success += batch.length;
        }
      }

      await supabase.from('import_logs').insert({
        admin_id: adminId,
        entity_type: type,
        total_records: data.length,
        success_count: success,
        failed_count: failed,
        errors: errors,
        status: failed === 0 ? 'Success' : failed < data.length ? 'Partial' : 'Failed'
      });

      return { 
        total: data.length, 
        success, 
        failed, 
        errors,
        imported_at: new Date().toISOString(),
        version: '2.0'
      };
    }, { name: 'ImportEngineService.importData' });
  }

  private getTableName(type: ImportEntityType): string {
    switch (type) {
      case 'university': return 'universities';
      case 'program': return 'programs';
      case 'city': return 'cities';
      case 'scholarship': return 'scholarships';
      case 'article': return 'articles';
      default: throw new Error(`Unsupported entity type: ${type}`);
    }
  }
}
