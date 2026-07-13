import { getSupabaseClient } from "@/lib/supabase/utils";
import { RepositoryError } from "@/lib/core/errors/AppErrors";

export interface AuditLogEntry {
  actor_id: string;
  actor_role: string;
  entity_type: string;
  entity_id: string;
  action: string;
  previous_value?: any;
  new_value?: any;
  reason?: string;
  user_agent?: string;
  ip_address?: string;
  correlation_id?: string;
}

export const AuditService = {
  async log(entry: AuditLogEntry): Promise<void> {
    const supabase = getSupabaseClient();
    
    // We should have a public.audit_logs table in Supabase
    const { error } = await supabase.from('audit_logs').insert([
      {
        ...entry,
        created_at: new Date().toISOString(),
      }
    ]);

    if (error) {
      console.error('[AuditService] Failed to record audit log:', error);
      // We don't necessarily want to throw here and break the main transaction
      // but in strict enterprise apps we might.
    }
  }
};
