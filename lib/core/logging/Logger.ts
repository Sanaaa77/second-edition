import { getSupabaseClient } from "@/lib/supabase/utils";

export interface AuditLogEntry {
  actor_id: string;
  actor_role: string;
  entity_type: string;
  entity_id: string;
  action: string;
  previous_value?: unknown;
  new_value?: unknown;
  reason?: string;
  user_agent?: string;
  ip_address?: string;
  correlation_id?: string;
}

export const AuditService = {
  async log(entry: AuditLogEntry): Promise<void> {
    const supabase = getSupabaseClient();
    
    // In production, this would be a secured table
    const { error } = await supabase.from('audit_logs').insert([
      {
        ...entry,
        created_at: new Date().toISOString(),
      }
    ]);

    if (error) {
      console.error('[AuditService] Failed to record audit log:', error.message);
    }
  }
};

export const Logger = {
  info(message: string, context?: Record<string, unknown>) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, context || '');
  },
  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error, context || '');
  },
  warn(message: string, context?: Record<string, unknown>) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, context || '');
  }
};
