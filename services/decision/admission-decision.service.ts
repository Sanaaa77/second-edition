import { Profile, University, Program, Scholarship } from "@/types/database";
import { 
  DecisionReport, 
  AdmissionAnalysis, 
  UniversityMatch, 
  ScholarshipEligibility,
  RoadmapItem,
  MultiDimReadiness
} from "@/lib/decision-engine/types";
import { AdmissionEngine } from "@/lib/decision-engine/AdmissionEngine";
import { UniversityMatchEngine } from "@/lib/decision-engine/UniversityMatchEngine";
import { ScholarshipEngine } from "@/lib/decision-engine/ScholarshipEngine";
import { RoadmapGenerator } from "@/lib/decision-engine/RoadmapGenerator";
import { 
  ProfileRepository, 
  UniversityRepository, 
  PredictionRepository, 
  DecisionReportRepository,
  DreamUniversityRepository,
  WeightRepository
} from "@/lib/repositories";
import { CacheManager } from "@/lib/core/cache/CacheManager";
import { EventBus } from "@/lib/core/events/EventBus";
import { ReadinessDimensionId } from "@/types/decision-engine";

export class AdmissionDecisionService {
  constructor(
    private readonly profileRepo: ProfileRepository,
    private readonly universityRepo: UniversityRepository,
    private readonly predictionRepo: PredictionRepository,
    private readonly reportRepo: DecisionReportRepository,
    private readonly dreamRepo: DreamUniversityRepository,
    private readonly cache: CacheManager,
    private readonly eventBus: EventBus
  ) {}

  async generateCompleteReport(profileId: string): Promise<DecisionReport> {
    const cacheKey = `decision_report_${profileId}`;
    const cached = await this.cache.get<DecisionReport>(cacheKey);
    if (cached) return cached;

    const { data: profile } = await this.profileRepo.getById(profileId);
    if (!profile) throw new Error("Profile not found");

    const { data: universities } = await this.universityRepo.findAll();
    
    // 1. Core Analysis
    const analysis = AdmissionEngine.analyze(profile);
    
    // 2. University Matching
    const topMatches: UniversityMatch[] = (universities || [])?.map(uni => 
      UniversityMatchEngine.calculateMatch(profile, uni, [])
    ).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5) || [];

    // 3. Roadmap
    const detailedScores = AdmissionEngine.calculateDimensionScores(profile);
    const roadmap = RoadmapGenerator.generate(profile, detailedScores);

    // 4. Scholarship Evaluation (Mocked for all scholarships of top matches)
    const scholarships: ScholarshipEligibility[] = [];

    const report: DecisionReport = {
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      profileId,
      overallReadiness: analysis.probability, // Mapping readiness to probability for now
      admissionProbability: analysis.probability,
      scholarshipProbability: 65, // Mock
      confidenceScore: analysis.confidence,
      riskScore: 100 - analysis.probability,
      dimensions: detailedScores,
      gapAnalysis: { criticalGaps: analysis.riskFactors, easyWins: [] },
      topMatches,
      scholarships,
      roadmap,
      nextBestAction: analysis.nextBestActions[0]
    };

    // Persistence
    await this.reportRepo.insert({
      profile_id: profileId,
      overall_readiness: report.overallReadiness,
      dimensions: report.dimensions,
      next_best_actions: report.nextBestAction,
      roadmap: report.roadmap,
      top_matches: report.topMatches
    });

    await this.cache.set(cacheKey, report, { ttl: 3600 }); // 1 hour cache
    return report;
  }

  async simulateWhatIf(profileId: string, changes: Partial<Profile>): Promise<DecisionReport> {
    const { data: profile } = await this.profileRepo.getById(profileId);
    if (!profile) throw new Error("Profile not found");

    const simulatedProfile = { ...profile, ...changes };
    const universities = await this.universityRepo.findAll();
    
    // Run engines on simulated profile (no persistence)
    const analysis = AdmissionEngine.analyze(simulatedProfile);
    const detailedScores = AdmissionEngine.calculateDimensionScores(simulatedProfile);
    const topMatches = (universities.data || [])?.map(uni => 
      UniversityMatchEngine.calculateMatch(simulatedProfile, uni, [])
    ).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5) || [];

    return {
      id: 'simulated',
      generatedAt: new Date().toISOString(),
      profileId,
      overallReadiness: analysis.probability,
      admissionProbability: analysis.probability,
      scholarshipProbability: 70,
      riskScore: 100 - analysis.probability,
      confidenceScore: 90,
      dimensions: detailedScores,
      gapAnalysis: { criticalGaps: [], easyWins: [] },
      topMatches,
      scholarships: [],
      roadmap: RoadmapGenerator.generate(simulatedProfile, detailedScores),
      nextBestAction: analysis.nextBestActions[0]
    };
  }

  async getDreamUniversities(profileId: string) {
    const { data } = await this.dreamRepo.findByProfileId(profileId);
    return data;
  }

  async addDreamUniversity(profileId: string, universityId: string, programId?: string) {
    const { error } = await this.dreamRepo.add({
      profile_id: profileId,
      university_id: universityId,
      program_id: programId
    });
    if (error) throw error;
    await this.cache.invalidatePattern(`decision_report_${profileId}`);
  }

  async getDreamAnalysis(profileId: string, universityId: string) {
    const { data: profile } = await this.profileRepo.getById(profileId);
    const { data: university } = await this.universityRepo.findBySlug(universityId); // Assuming slug or ID lookup
    
    if (!profile || !university) return null;

    // Logic to calculate specific gaps
    const match = UniversityMatchEngine.calculateMatch(profile, university, []);
    const languageGap = Math.max(0, 90 - match.dimensions.language);
    
    return {
      requiredIELTS: university.admission_requirements?.ielts || 6.5,
      currentIELTS: profile.language_profiles?.ielts?.overall || 0,
      gap: languageGap,
      estimatedStudyWeeks: Math.ceil(languageGap / 5), // Mock: 5 points per week
      recommendedLessons: [], // Logic to fetch lessons for the specific gap
      prioritySkills: ['Speaking', 'Writing']
    };
  }
}
