import { Scholarship } from "@/types/database";
import { BaseService } from "../BaseService";
import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/core/errors/AppErrors";

export class ScholarshipService extends BaseService {
  async getAll(): Promise<Scholarship[]> {
    return this.execute(
      async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('scholarships')
          .select('*, university:universities(*)');
        if (error) throw new RepositoryError(error.message);
        return (data || []) as Scholarship[];
      },
      {
        name: 'ScholarshipService.getAll',
        cacheKey: 'scholarships_all'
      }
    );
  }

  async getByUniversity(universityId: string): Promise<Scholarship[]> {
    return this.execute(
      async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('scholarships')
          .select('*')
          .eq('university_id', universityId);
        if (error) throw new RepositoryError(error.message);
        return (data || []) as Scholarship[];
      },
      {
        name: `ScholarshipService.getByUniversity(${universityId})`,
        cacheKey: `scholarships_uni_${universityId}`
      }
    );
  }
}
