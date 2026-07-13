import { AdmissionEngine } from "@/lib/decision-engine/AdmissionEngine";
import { DecisionReport, UniversityMatch } from "@/lib/decision-engine/types";
import { UniversityService } from "../university/university.service";
import { ProfileService } from "../profile/profile.service";
import { UniversityMatchEngine } from "@/lib/decision-engine/UniversityMatchEngine";
import { RoadmapGenerator } from "@/lib/decision-engine/RoadmapGenerator";

export class DecisionReportService {
  constructor(
    private readonly universityService: UniversityService,
    private readonly profileService: ProfileService
  ) {}

  async getPersonalizedReport(): Promise<DecisionReport | null> {
    const student = await this.profileService.getOwnProfile();
    if (!student) return null;

    const universities = await this.universityService.getAll();
    const analysis = AdmissionEngine.analyze(student);
    const detailedScores = AdmissionEngine.calculateDimensionScores(student);
    
    const topMatches: UniversityMatch[] = (universities || [])
      .map(uni => UniversityMatchEngine.calculateMatch(student, uni, []))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    return {
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      profileId: student.id,
      overallReadiness: analysis.probability,
      admissionProbability: analysis.probability,
      scholarshipProbability: 60,
      riskScore: 100 - analysis.probability,
      confidenceScore: 90,
      dimensions: detailedScores,
      gapAnalysis: { criticalGaps: analysis.riskFactors, easyWins: [] },
      topMatches,
      scholarships: [],
      roadmap: RoadmapGenerator.generate(student, detailedScores),
      nextBestAction: analysis.nextBestActions[0]
    };
  }
}
