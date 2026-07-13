import { getSupabaseClient } from "@/lib/supabase/utils";

export class SyncRepository {
  async getSources() {
    const supabase = getSupabaseClient();
    return await supabase.from('data_sources').select('*');
  }

  async createJob(job: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('sync_jobs').insert(job).select().single();
  }

  async updateJob(id: string, updates: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('sync_jobs').update(updates).eq('id', id);
  }

  async logAudit(log: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('data_audit_logs').insert(log);
  }

  async getValidationReports() {
    const supabase = getSupabaseClient();
    return await supabase.from('data_validation_reports').select('*').eq('is_resolved', false);
  }

  async saveValidationReport(report: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('data_validation_reports').insert(report);
  }
}

export class BackgroundJobRepository {
  async getPendingJobs() {
    const supabase = getSupabaseClient();
    return await supabase
      .from('background_jobs')
      .select('*')
      .eq('status', 'Pending')
      .lte('run_at', new Date().toISOString())
      .order('run_at', { ascending: true });
  }

  async updateJobStatus(id: string, status: string, updates?: any) {
    const supabase = getSupabaseClient();
    return await supabase.from('background_jobs').update({ status, ...updates }).eq('id', id);
  }
}
