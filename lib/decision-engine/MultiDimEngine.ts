import { MultiDimReadiness, DimensionScore } from "./types";
import { ReadinessDimensionId } from "@/types/decision-engine";

export const MultiDimEngine = {
  calculate(student: any, university: any, program: any): MultiDimReadiness {
    const calcDim = (id: ReadinessDimensionId, s: number, w: number, rec: string): DimensionScore => ({
      id, 
      title: id, 
      status: 'on-track', 
      weight: w, 
      currentScore: s, 
      targetScore: 90, 
      maxScore: 100, 
      gap: 90 - s,
      recommendation: rec, 
      missingItems: [], 
      recommendations: [],
      estimatedImprovementGain: 5, 
      estimatedDaysToImprove: 14
    });

    const dimensions: Partial<Record<ReadinessDimensionId, DimensionScore>> = {
      academic: calcDim('academic', 85, 0.25, "Keep up the GPA."),
      language: calcDim('language', 70, 0.20, "Target IELTS 7.0."),
      documents: calcDim('documents', 90, 0.15, "SOP ready."),
      financial: calcDim('financial', 80, 0.15, "Check dorm costs."),
      visa: calcDim('visa', 40, 0.10, "Apply early."),
      scholarship: calcDim('scholarship', 20, 0.05, "Search provincial."),
      timeline: calcDim('timeline', 100, 0.05, "On track."),
      research: calcDim('research', 75, 0.05, "Add certificates.")
    };

    const overallReadiness = Object.values(dimensions).reduce((acc, d) => acc + (d!.currentScore * d!.weight), 0);

    return {
      overallReadiness: Math.round(overallReadiness),
      dimensions,
      priorityActions: [],
      timeline: []
    };
  }
};
