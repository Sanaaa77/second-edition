import { getSupabaseClient } from "@/lib/supabase/utils";
import { ApplicationAuditLog, ApplicationChecklistItem } from "@/types/workflow";

export class ApplicationHistoryRepository {
  static async logAction(log: Partial<ApplicationAuditLog>) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('application_audit_logs').insert(log);
    if (error) throw error;
  }

  static async getHistory(applicationId: string) {
    const supabase = getSupabaseClient();
    return await supabase
      .from('application_audit_logs')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false });
  }
}

export class ChecklistRepository {
  static async findByApplicationId(applicationId: string) {
    const supabase = getSupabaseClient();
    return await supabase
      .from('application_checklists')
      .select('*')
      .eq('application_id', applicationId)
      .order('is_completed', { ascending: true });
  }

  static async markComplete(id: string) {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('application_checklists')
      .update({ is_completed: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }
}
