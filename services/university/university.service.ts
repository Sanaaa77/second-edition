import { University } from "@/types/database";
import { BaseService } from "../BaseService";
import { RepositoryError } from "@/lib/core/errors/AppErrors";
import { UniversityRepository } from "@/lib/repositories";

export class UniversityService extends BaseService {
  constructor(private readonly universityRepo: UniversityRepository) {
    super();
  }

  async getAll(): Promise<University[]> {
    return this.execute(
      async () => {
        const { data, error } = await this.universityRepo.findAll();
        if (error) throw new RepositoryError(error.message);
        return (data || []) as University[];
      },
      {
        name: 'UniversityService.getAll',
        cacheKey: 'universities_all',
        cacheTTL: 1000 * 60 * 30
      }
    );
  }

  async getBySlug(slug: string): Promise<University> {
    return this.execute(
      async () => {
        const { data, error } = await this.universityRepo.findBySlug(slug);
        if (error) throw new RepositoryError(error.message);
        if (!data) throw new RepositoryError("University not found");
        return data as University;
      },
      {
        name: `UniversityService.getBySlug(${slug})`,
        cacheKey: `university_${slug}`
      }
    );
  }
}
