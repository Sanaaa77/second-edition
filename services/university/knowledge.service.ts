import { 
  UniversityRepository, 
  ProgramRepository, 
  ArticleRepository, 
  CityRepository, 
  ScholarshipRepository 
} from "@/lib/repositories";
import { BaseService } from "../BaseService";
import { CacheManager } from "@/lib/core/cache/CacheManager";
import { getSupabaseClient } from "@/lib/supabase/utils";
import { SearchResult, SearchOptions } from "@/types/knowledge";
import { University, City, Program, Scholarship, Article } from "@/types/database";

export class KnowledgeService extends BaseService {
  constructor(
    private readonly universityRepo: UniversityRepository,
    private readonly programRepo: ProgramRepository,
    private readonly articleRepo: ArticleRepository,
    private readonly cityRepo: CityRepository,
    private readonly scholarshipRepo: ScholarshipRepository,
    private readonly cache: CacheManager
  ) {
    super();
  }

  async globalSearch(options: SearchOptions): Promise<SearchResult> {
    return this.execute(async () => {
      const supabase = getSupabaseClient();
      const { query } = options;
      
      // Advanced Postgres Full-Text Search
      const [unis, progs, articles] = await Promise.all([
        supabase.from('universities')
          .select('id, name, slug, logo_url')
          .textSearch('search_vector', query, {
            type: 'websearch',
            config: 'english'
          }),
        supabase.from('programs')
          .select('id, name, university_id')
          .textSearch('search_vector', query),
        supabase.from('article_translations')
          .select('article_id, title, excerpt')
          .textSearch('title', query)
      ]);

      return {
        universities: (unis.data || []) as Partial<University>[],
        programs: (progs.data || []) as Partial<Program>[],
        articles: articles.data || [],
        cities: [],
        scholarships: [],
        faqs: []
      };
    }, { name: 'KnowledgeService.globalSearch' });
  }

  async getUniversityDetail(slug: string): Promise<University | null> {
    return this.execute(async () => {
      const { data, error } = await this.universityRepo.findBySlug(slug);
      if (error) return null;
      return data as University;
    }, { name: 'KnowledgeService.getUniversityDetail', cacheKey: `uni_${slug}` });
  }

  async getCityDetail(slug: string): Promise<City | null> {
    return this.execute(async () => {
      const { data, error } = await this.cityRepo.findBySlug(slug);
      if (error) return null;
      return data as City;
    }, { name: 'KnowledgeService.getCityDetail', cacheKey: `city_${slug}` });
  }

  async getProgramDetail(id: string): Promise<Program | null> {
    return this.execute(async () => {
      const { data, error } = await this.programRepo.findById(id);
      if (error) return null;
      return data as Program;
    }, { name: 'KnowledgeService.getProgramDetail', cacheKey: `prog_${id}` });
  }

  async getArticles(category?: string): Promise<Article[]> {
    return this.execute(async () => {
      const { data, error } = await this.articleRepo.findPublished(category);
      if (error) return [];
      return data as Article[];
    }, { name: 'KnowledgeService.getArticles', cacheKey: `articles_${category || 'all'}` });
  }

  async getRelatedUniversities(id: string): Promise<University[]> {
    return this.execute(async () => {
      const { data } = await this.universityRepo.findAll();
      // Simple logic: filter out current and pick random 3
      return (data || []).filter(u => u.id !== id).slice(0, 3) as University[];
    }, { name: 'KnowledgeService.getRelatedUniversities', cacheKey: `related_unis_${id}` });
  }

  async getRelatedPrograms(id: string): Promise<Program[]> {
    return this.execute(async () => {
      const { data } = await this.programRepo.findAll();
      return (data || []).filter(p => p.id !== id).slice(0, 3) as Program[];
    }, { name: 'KnowledgeService.getRelatedPrograms', cacheKey: `related_progs_${id}` });
  }
}
