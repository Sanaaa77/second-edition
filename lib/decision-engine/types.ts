import { University, Program, Profile, Scholarship, AdmissionRequirements } from "@/types/database";
import { 
  ReadinessDimensionId, 
  DimensionStatus, 
  DimensionScore,
  DecisionReport as CoreDecisionReport 
} from "@/types/decision-engine";

export type { DimensionScore, ReadinessDimensionId, DimensionStatus };

export interface MultiDimReadiness {
  overallReadiness: number;
  dimensions: Partial<Record<ReadinessDimensionId, DimensionScore>>;
  priorityActions: PriorityAction[];
  timeline: RoadmapItem[];
}

export interface PriorityAction {
  id: string;
  label: string;
  impact: number;
  effort: 'Low' | 'Medium' | 'High';
  type: 'academic' | 'language' | 'document' | 'financial' | 'other';
  deadline?: string;
}

export interface RoadmapItem {
  id: string;
  milestone: string;
  description: string;
  date: string;
  completed: boolean;
  category: string;
}

export interface AdmissionAnalysis {
  probability: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  riskFactors: string[];
  nextBestActions: PriorityAction[];
  scores: Record<ReadinessDimensionId, DimensionScore>;
  backupUniversities?: University[];
  estimatedCostTotal?: number;
}

export interface ScholarshipEligibility {
  id: string;
  scholarship: Scholarship;
  probability: number;
  expectedAmount: number;
  currency: string;
  requirements: string[];
  missingRequirements: string[];
  status: 'eligible' | 'potential' | 'ineligible';
}

export interface DecisionReport extends CoreDecisionReport {
  topMatches: UniversityMatch[];
  scholarships: ScholarshipEligibility[];
  nextBestAction: PriorityAction;
}

export interface UniversityMatch {
  university: University;
  matchScore: number;
  admission: {
    score: number;
    reasons: string[];
    strengths: string[];
    weaknesses: string[];
  };
  dimensions: {
    academic: number;
    language: number;
    budget: number;
    career: number;
    scholarship: number;
    city: number;
    visa: number;
  };
}

export interface SimulationResult {
  original: DecisionReport;
  simulated: DecisionReport;
  diff: {
    readiness: number;
    probability: number;
    scholarship: number;
  };
}
