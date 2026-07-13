import { container } from "./Container";
export { container };
import { config } from "../config/Config";
import { cacheManager } from "../cache/CacheManager";
import { domainEventBus } from "../events/EventBus";
import { healthCheck } from "../health/HealthCheck";
import { metrics } from "../metrics/MetricsCollector";
import { Logger } from "../logging/Logger";
import { scheduler } from "../scheduler/Scheduler";
import { 
  UniversityRepository, 
  ProfileRepository, 
  ApplicationRepository, 
  OfferRepository, 
  VisaRepository,
  PredictionRepository,
  DecisionReportRepository,
  DreamUniversityRepository,
  WeightRepository,
  AcademyRepository,
  CRMRepository,
  ProgramRepository,
  ArticleRepository,
  CityRepository,
  ScholarshipRepository
} from "../../repositories/index";
import { UniversityService } from "@/services/university/university.service";
import { ProfileService } from "@/services/profile/profile.service";
import { ApplicationService } from "@/services/application/application.service";
import { TaskService } from "@/services/task/task.service";
import { ScholarshipService } from "@/services/scholarship/scholarship.service";
import { NotificationService } from "@/services/notification/notification.service";
import { DecisionReportService } from "@/services/decision/decision-report.service";
import { AdmissionDecisionService } from "@/services/decision/admission-decision.service";
import { AcademyService } from "@/services/academy/academy.service";
import { AcademyAdminService } from "@/services/academy/academy-admin.service";
import { AICoachService } from "@/services/ai/ai-coach.service";
import { PlacementTestService } from "@/services/academy/placement-test.service";
import { ExerciseService } from "@/services/academy/exercise.service";
import { CRMService } from "@/services/crm/crm.service";
import { KnowledgeService } from "@/services/university/knowledge.service";
import { ImportEngineService } from "@/services/university/import-engine.service";
import { KnowledgeSyncService } from "@/services/university/knowledge-sync.service";
import { DataValidatorService } from "@/services/university/data-validator.service";
import { AdminDashboardService } from "@/services/university/admin-dashboard.service";
import { BackgroundJobManager } from "../jobs/BackgroundJobManager";
import { SyncRepository, BackgroundJobRepository } from "../../repositories/sync.repository";
import { CalculatorService } from "@/services/calculators/calculator.service";
import { DocumentService } from "@/services/document/document.service";
import { CityService } from "@/services/city/city.service";

// Re-exports for convenience
export const TOKENS = {
  CONFIG: Symbol('CONFIG'),
  CACHE: Symbol('CACHE'),
  EVENT_BUS: Symbol('EVENT_BUS'),
  HEALTH: Symbol('HEALTH'),
  METRICS: Symbol('METRICS'),
  LOGGER: Symbol('LOGGER'),
  SCHEDULER: Symbol('SCHEDULER'),
  
  // Repositories
  UNIVERSITY_REPO: Symbol('UNIVERSITY_REPO'),
  PROFILE_REPO: Symbol('PROFILE_REPO'),
  APPLICATION_REPO: Symbol('APPLICATION_REPO'),
  OFFER_REPO: Symbol('OFFER_REPO'),
  VISA_REPO: Symbol('VISA_REPO'),
  PREDICTION_REPO: Symbol('PREDICTION_REPO'),
  DECISION_REPORT_REPO: Symbol('DECISION_REPORT_REPO'),
  DREAM_UNIVERSITY_REPO: Symbol('DREAM_UNIVERSITY_REPO'),
  WEIGHT_REPO: Symbol('WEIGHT_REPO'),
  ACADEMY_REPO: Symbol('ACADEMY_REPO'),
  
  // Services
  UNIVERSITY_SERVICE: Symbol('UNIVERSITY_SERVICE'),
  PROFILE_SERVICE: Symbol('PROFILE_SERVICE'),
  APPLICATION_SERVICE: Symbol('APPLICATION_SERVICE'),
  NOTIFICATION_SERVICE: Symbol('NOTIFICATION_SERVICE'),
  TASK_SERVICE: Symbol('TASK_SERVICE'),
  SCHOLARSHIP_SERVICE: Symbol('SCHOLARSHIP_SERVICE'),
  CITY_SERVICE: Symbol('CITY_SERVICE'),
  DOCUMENT_SERVICE: Symbol('DOCUMENT_SERVICE'),
  DECISION_REPORT_SERVICE: Symbol('DECISION_REPORT_SERVICE'),
  ADMISSION_DECISION_SERVICE: Symbol('ADMISSION_DECISION_SERVICE'),
  ACADEMY_SERVICE: Symbol('ACADEMY_SERVICE'),
  ACADEMY_ADMIN_SERVICE: Symbol('ACADEMY_ADMIN_SERVICE'),
  AI_COACH_SERVICE: Symbol('AI_COACH_SERVICE'),
  PLACEMENT_TEST_SERVICE: Symbol('PLACEMENT_TEST_SERVICE'),
  EXERCISE_SERVICE: Symbol('EXERCISE_SERVICE'),
  CRM_SERVICE: Symbol('CRM_SERVICE'),
  CRM_REPO: Symbol('CRM_REPO'),
  
  KNOWLEDGE_SERVICE: Symbol('KNOWLEDGE_SERVICE'),
  IMPORT_ENGINE_SERVICE: Symbol('IMPORT_ENGINE_SERVICE'),
  PROGRAM_REPO: Symbol('PROGRAM_REPO'),
  ARTICLE_REPO: Symbol('ARTICLE_REPO'),
  CITY_REPO: Symbol('CITY_REPO'),
  SCHOLARSHIP_REPO: Symbol('SCHOLARSHIP_REPO'),
  
  SYNC_REPO: Symbol('SYNC_REPO'),
  JOB_REPO: Symbol('JOB_REPO'),
  SYNC_SERVICE: Symbol('SYNC_SERVICE'),
  VALIDATOR_SERVICE: Symbol('VALIDATOR_SERVICE'),
  JOB_MANAGER: Symbol('JOB_MANAGER'),
  ADMIN_DASHBOARD_SERVICE: Symbol('ADMIN_DASHBOARD_SERVICE'),
  CALCULATOR_SERVICE: Symbol('CALCULATOR_SERVICE'),
} as const;

export function initializeContainer() {
  container.register(TOKENS.CONFIG, config);
  container.register(TOKENS.CACHE, cacheManager);
  container.register(TOKENS.EVENT_BUS, domainEventBus);
  container.register(TOKENS.HEALTH, healthCheck);
  container.register(TOKENS.METRICS, metrics);
  container.register(TOKENS.LOGGER, Logger);
  container.register(TOKENS.SCHEDULER, scheduler);

  // Repositories
  container.registerSingleton(TOKENS.UNIVERSITY_REPO, () => new UniversityRepository());
  container.registerSingleton(TOKENS.PROFILE_REPO, () => new ProfileRepository());
  container.registerSingleton(TOKENS.APPLICATION_REPO, () => new ApplicationRepository());
  container.registerSingleton(TOKENS.OFFER_REPO, () => new OfferRepository());
  container.registerSingleton(TOKENS.VISA_REPO, () => new VisaRepository());
  container.registerSingleton(TOKENS.PREDICTION_REPO, () => new PredictionRepository());
  container.registerSingleton(TOKENS.DECISION_REPORT_REPO, () => new DecisionReportRepository());
  container.registerSingleton(TOKENS.DREAM_UNIVERSITY_REPO, () => new DreamUniversityRepository());
  container.registerSingleton(TOKENS.WEIGHT_REPO, () => new WeightRepository());
  container.registerSingleton(TOKENS.ACADEMY_REPO, () => new AcademyRepository());
  container.registerSingleton(TOKENS.CRM_REPO, () => new CRMRepository());
  
  container.registerSingleton(TOKENS.PROGRAM_REPO, () => new ProgramRepository());
  container.registerSingleton(TOKENS.ARTICLE_REPO, () => new ArticleRepository());
  container.registerSingleton(TOKENS.CITY_REPO, () => new CityRepository());
  container.registerSingleton(TOKENS.SCHOLARSHIP_REPO, () => new ScholarshipRepository());
  
  container.registerSingleton(TOKENS.SYNC_REPO, () => new SyncRepository());
  container.registerSingleton(TOKENS.JOB_REPO, () => new BackgroundJobRepository());

  // Services
  container.registerSingleton(TOKENS.UNIVERSITY_SERVICE, (c) => 
    new UniversityService(c.resolve(TOKENS.UNIVERSITY_REPO)));
  container.registerSingleton(TOKENS.PROFILE_SERVICE, (c) => 
    new ProfileService(
      c.resolve(TOKENS.PROFILE_REPO),
      c.resolve(TOKENS.EVENT_BUS)
    ));
  container.registerSingleton(TOKENS.APPLICATION_SERVICE, (c) => 
    new ApplicationService(
      c.resolve(TOKENS.APPLICATION_REPO),
      c.resolve(TOKENS.OFFER_REPO),
      c.resolve(TOKENS.VISA_REPO)
    ));
  container.registerSingleton(TOKENS.TASK_SERVICE, () => new TaskService());
  container.registerSingleton(TOKENS.SCHOLARSHIP_SERVICE, () => new ScholarshipService());
  container.registerSingleton(TOKENS.NOTIFICATION_SERVICE, () => new NotificationService());
  container.registerSingleton(TOKENS.CITY_SERVICE, () => new CityService());
  container.registerSingleton(TOKENS.DOCUMENT_SERVICE, () => new DocumentService());
  container.registerSingleton(TOKENS.DECISION_REPORT_SERVICE, (c) => 
    new DecisionReportService(
      c.resolve(TOKENS.UNIVERSITY_SERVICE),
      c.resolve(TOKENS.PROFILE_SERVICE)
    ));
  container.registerSingleton(TOKENS.ADMISSION_DECISION_SERVICE, (c) => 
    new AdmissionDecisionService(
      c.resolve(TOKENS.PROFILE_REPO),
      c.resolve(TOKENS.UNIVERSITY_REPO),
      c.resolve(TOKENS.PREDICTION_REPO),
      c.resolve(TOKENS.DECISION_REPORT_REPO),
      c.resolve(TOKENS.DREAM_UNIVERSITY_REPO),
      c.resolve(TOKENS.CACHE),
      c.resolve(TOKENS.EVENT_BUS)
    ));
  container.registerSingleton(TOKENS.ACADEMY_SERVICE, (c) => 
    new AcademyService(
      c.resolve(TOKENS.ACADEMY_REPO),
      c.resolve(TOKENS.PROFILE_REPO),
      c.resolve(TOKENS.CACHE),
      c.resolve(TOKENS.EVENT_BUS)
    ));
  container.registerSingleton(TOKENS.ACADEMY_ADMIN_SERVICE, (c) => 
    new AcademyAdminService(c.resolve(TOKENS.ACADEMY_REPO)));
  container.registerSingleton(TOKENS.AI_COACH_SERVICE, () => new AICoachService());
  container.registerSingleton(TOKENS.PLACEMENT_TEST_SERVICE, (c) => 
    new PlacementTestService(c.resolve(TOKENS.ACADEMY_REPO)));
  container.registerSingleton(TOKENS.EXERCISE_SERVICE, () => new ExerciseService());
  container.registerSingleton(TOKENS.CRM_SERVICE, (c) => 
    new CRMService(
      c.resolve(TOKENS.CRM_REPO),
      c.resolve(TOKENS.PROFILE_REPO),
      c.resolve(TOKENS.APPLICATION_REPO),
      c.resolve(TOKENS.CACHE),
      c.resolve(TOKENS.EVENT_BUS)
    ));
    
  container.registerSingleton(TOKENS.KNOWLEDGE_SERVICE, (c) => 
    new KnowledgeService(
      c.resolve(TOKENS.UNIVERSITY_REPO),
      c.resolve(TOKENS.PROGRAM_REPO),
      c.resolve(TOKENS.ARTICLE_REPO),
      c.resolve(TOKENS.CITY_REPO),
      c.resolve(TOKENS.SCHOLARSHIP_REPO),
      c.resolve(TOKENS.CACHE)
    ));
  container.registerSingleton(TOKENS.IMPORT_ENGINE_SERVICE, () => new ImportEngineService());

  container.registerSingleton(TOKENS.SYNC_SERVICE, (c) => 
    new KnowledgeSyncService(
      c.resolve(TOKENS.SYNC_REPO),
      c.resolve(TOKENS.UNIVERSITY_REPO),
      c.resolve(TOKENS.PROGRAM_REPO),
      c.resolve(TOKENS.EVENT_BUS)
    ));
  container.registerSingleton(TOKENS.VALIDATOR_SERVICE, (c) => 
    new DataValidatorService(
      c.resolve(TOKENS.UNIVERSITY_REPO),
      c.resolve(TOKENS.PROGRAM_REPO),
      c.resolve(TOKENS.SYNC_REPO)
    ));
  container.registerSingleton(TOKENS.JOB_MANAGER, (c) => 
    new BackgroundJobManager(c.resolve(TOKENS.JOB_REPO)));
    
  container.registerSingleton(TOKENS.ADMIN_DASHBOARD_SERVICE, (c) => 
    new AdminDashboardService(
      c.resolve(TOKENS.UNIVERSITY_REPO),
      c.resolve(TOKENS.PROGRAM_REPO),
      c.resolve(TOKENS.ARTICLE_REPO),
      c.resolve(TOKENS.SCHOLARSHIP_REPO)
    ));
  container.registerSingleton(TOKENS.CALCULATOR_SERVICE, () => new CalculatorService());
}
