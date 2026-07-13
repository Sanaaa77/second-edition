import { BaseService } from "../BaseService";
import { UniversityRepository, ProgramRepository, ArticleRepository, ScholarshipRepository } from "@/lib/repositories";
import { metrics } from "@/lib/core/metrics/MetricsCollector";

export class AdminDashboardService extends BaseService {
  constructor(
    private readonly universityRepo: UniversityRepository,
    private readonly programRepo: ProgramRepository,
    private readonly articleRepo: ArticleRepository,
    private readonly scholarshipRepo: ScholarshipRepository
  ) {
    super();
  }

  async getContentAudit() {
    return this.execute(async () => {
      const [unis, progs, articles, scholarships] = await Promise.all([
        this.universityRepo.findAll(),
        this.programRepo.findAll(),
        this.articleRepo.findPublished(),
        this.scholarshipRepo.findAll()
      ]);

      const reports = {
        universities: {
          total: unis.data?.length || 0,
          missingLogo: unis.data?.filter(u => !u.logo_url).length || 0,
          missingDescription: unis.data?.filter(u => !u.description).length || 0,
          completion: 0
        },
        programs: {
          total: progs.data?.length || 0,
          missingTuition: progs.data?.filter(p => !p.tuition_fee).length || 0,
          completion: 0
        }
      };

      // Calculate completion percentages
      reports.universities.completion = Math.round(((reports.universities.total - reports.universities.missingLogo) / reports.universities.total) * 100) || 0;

      const missingContentReport = {
        universitiesMissingReqs: unis.data?.filter(u => !u.admission_requirements).map(u => u.name),
        programsMissingTuition: progs.data?.filter(p => !p.tuition_fee).map(p => p.name)
      };

      return {
        ...reports,
        scholarships: { total: scholarships.data?.length || 0 },
        articles: { total: articles.data?.length || 0 },
        missingContentReport
      };
    }, { name: 'AdminDashboardService.getContentAudit', cacheKey: 'admin_content_audit' });
  }

  async getSystemHealth() {
    // Collect metrics for dashboard
    return metrics.getMetrics().slice(-20);
  }
}
