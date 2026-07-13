import { BaseService } from "../BaseService";
import { UniversityRepository, ProgramRepository } from "@/lib/repositories";
import { SyncRepository } from "@/lib/repositories/sync.repository";

export class DataValidatorService extends BaseService {
  constructor(
    private readonly universityRepo: UniversityRepository,
    private readonly programRepo: ProgramRepository,
    private readonly syncRepo: SyncRepository
  ) {
    super();
  }

  async validateAll() {
    return this.execute(async () => {
      const { data: universities } = await this.universityRepo.findAll();
      const { data: programs } = await this.programRepo.findAll();
      const reports: any[] = [];

      // 1. University Validation
      for (const uni of (universities || [])) {
        if (!uni.logo_url) {
          reports.push({
            entity_type: 'university', entity_id: uni.id, rule_name: 'MissingLogo',
            severity: 'Warning', message: 'University is missing a logo.'
          });
        }
        if (!uni.hero_image_url) {
          reports.push({
            entity_type: 'university', entity_id: uni.id, rule_name: 'MissingHero',
            severity: 'Warning', message: 'University is missing a hero image.'
          });
        }
      }

      // 2. Program Validation
      for (const prog of (programs || [])) {
        if (!prog.tuition_fee || prog.tuition_fee <= 0) {
          reports.push({
            entity_type: 'program', entity_id: prog.id, rule_name: 'InvalidTuition',
            severity: 'Error', message: 'Program tuition fee is missing or zero.'
          });
        }
        if (!prog.requirements || prog.requirements.length === 0) {
           reports.push({
            entity_type: 'program', entity_id: prog.id, rule_name: 'MissingRequirements',
            severity: 'Warning', message: 'Program has no admission requirements listed.'
          });
        }
      }

      // Save reports
      for (const report of reports) {
        await this.syncRepo.saveValidationReport(report);
      }

      return reports;
    }, { name: 'DataValidatorService.validateAll' });
  }
}
