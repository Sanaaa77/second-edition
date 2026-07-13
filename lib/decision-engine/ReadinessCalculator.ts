import { 
  Profile, 
  University, 
  Program 
} from "@/types/database";
import { 
  DecisionReport, 
  ReadinessDimensionId, 
  DimensionScore, 
  DimensionStatus 
} from "@/types/decision-engine";
import { DEFAULT_WEIGHTS, STATUS_THRESHOLDS } from "./config";

export const ReadinessCalculator = {
  calculate(
    student: Partial<Profile> | null, 
    university: Partial<University> | null, 
    program: Partial<Program> | null
  ): DecisionReport {
    if (!student) return this.getEmptyReport();

    const weights = DEFAULT_WEIGHTS;
    
    const dimensions: Record<ReadinessDimensionId, DimensionScore> = {
      academic: this.calcAcademic(student, program, weights.academic),
      language: this.calcLanguage(student, program, weights.language),
      financial: this.calcFinancial(student, program, weights.financial),
      documents: this.calcDocuments(student, weights.documents),
      visa: this.getGenericDim('visa', 'وضعیت ویزا', 20, weights.visa),
      research: this.getGenericDim('research', 'سابقه پژوهشی', 0, weights.research),
      work: this.getGenericDim('work', 'سابقه کاری', 0, weights.work),
      scholarship: this.getGenericDim('scholarship', 'شانس بورسیه', 40, weights.scholarship),
      timeline: this.getGenericDim('timeline', 'زمان‌بندی', 100, weights.timeline),
      interview: this.getGenericDim('interview', 'آمادگی مصاحبه', 50, weights.interview),
      statement: this.getGenericDim('statement', 'انگیزه نامه', 70, weights.statement),
      recommendations: this.getGenericDim('recommendations', 'توصیه‌نامه‌ها', 60, weights.recommendations),
      portfolio: this.getGenericDim('portfolio', 'پورتفولیو', 30, weights.portfolio),
    };

    const overallReadiness = Object.values(dimensions).reduce(
      (acc, dim) => acc + (dim.currentScore * dim.weight), 0
    );

    return {
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      profileId: student.id || 'guest',
      overallReadiness: Math.round(overallReadiness),
      admissionProbability: Math.round(overallReadiness * 0.95),
      scholarshipProbability: 25,
      riskScore: 100 - overallReadiness,
      confidenceScore: 90,
      dimensions,
      gapAnalysis: { criticalGaps: [], easyWins: [] },
      nextBestAction: { label: 'تکمیل مدارک', impact: 15, effort: 'Low' },
      roadmap: []
    };
  },

  calcAcademic(student: any, program: any, weight: number): DimensionScore {
    return { id: 'academic', title: 'آمادگی تحصیلی', currentScore: 85, targetScore: 90, weight, status: 'on-track', missingItems: [], recommendations: [], gap: 5, estimatedImprovementGain: 10, estimatedDaysToImprove: 90 };
  },

  calcLanguage(student: any, program: any, weight: number): DimensionScore {
    return { id: 'language', title: 'مهارت زبان', currentScore: 70, targetScore: 100, weight, status: 'on-track', missingItems: [], recommendations: [], gap: 30, estimatedImprovementGain: 15, estimatedDaysToImprove: 60 };
  },

  calcFinancial(student: any, program: any, weight: number): DimensionScore {
    return { id: 'financial', title: 'توانمندی مالی', currentScore: 80, targetScore: 100, weight, status: 'on-track', missingItems: [], recommendations: [], gap: 20, estimatedImprovementGain: 5, estimatedDaysToImprove: 30 };
  },

  calcDocuments(student: any, weight: number): DimensionScore {
     return { id: 'documents', title: 'تکمیل مدارک', currentScore: 90, targetScore: 100, weight, status: 'excellent', missingItems: [], recommendations: [], gap: 10, estimatedImprovementGain: 20, estimatedDaysToImprove: 7 };
  },

  getStatus(score: number): DimensionStatus {
    if (score >= STATUS_THRESHOLDS.EXCELLENT) return 'excellent';
    if (score >= STATUS_THRESHOLDS.ON_TRACK) return 'on-track';
    return 'at-risk';
  },

  getGenericDim(id: ReadinessDimensionId, title: string, score: number, weight: number): DimensionScore {
    return { id, title, currentScore: score, targetScore: 100, weight, status: this.getStatus(score), missingItems: [], recommendations: [], gap: 100 - score, estimatedImprovementGain: 5, estimatedDaysToImprove: 14 };
  },

  getEmptyReport(): DecisionReport {
    return { 
      id: 'empty',
      generatedAt: new Date().toISOString(),
      profileId: 'guest',
      overallReadiness: 0, 
      admissionProbability: 0, 
      scholarshipProbability: 0, 
      riskScore: 0, 
      confidenceScore: 0, 
      dimensions: {} as any, 
      gapAnalysis: { criticalGaps: [], easyWins: [] }, 
      nextBestAction: { label: 'تکمیل پروفایل', impact: 0, effort: 'Low' }, 
      roadmap: [] 
    };
  }
};
