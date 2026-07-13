import { Profile, University, Program } from "@/types/database";
import { AdmissionAnalysis, DimensionScore, PriorityAction } from "./types";
import { ScoringEngine } from "./ScoringEngine";
import { ReadinessDimensionId } from "@/types/decision-engine";

export class AdmissionEngine {
  static analyze(
    profile: Profile,
    university?: University,
    program?: Program
  ): AdmissionAnalysis {
    const scores = this.calculateDimensionScores(profile, university, program);
    const overallReadiness = this.calculateOverallReadiness(scores);
    
    let probability = overallReadiness;
    if (university) {
      const acceptanceRate = 0.25; 
      probability = (probability * 0.75) + (acceptanceRate * 100 * 0.25);
    }

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const riskFactors: string[] = [];

    Object.values(scores).forEach(score => {
      if (score.currentScore >= 85) strengths.push(`${score.title}: عالی`);
      else if (score.currentScore < 60) weaknesses.push(`${score.title}: نیاز به بهبود`);
      if (score.currentScore < 40) riskFactors.push(`${score.title}: ریسک بالا`);
    });

    return {
      probability: Math.round(Math.min(Math.max(probability, 0), 100)),
      confidence: 90,
      strengths,
      weaknesses,
      riskFactors,
      nextBestActions: this.generateActions(scores),
      scores,
      backupUniversities: [],
      estimatedCostTotal: (profile.budget || 0) * 1.1 
    };
  }

  public static calculateDimensionScores(
    profile: Profile,
    university?: University,
    program?: Program
  ): Record<ReadinessDimensionId, DimensionScore> {
    const scores: Partial<Record<ReadinessDimensionId, DimensionScore>> = {};
    
    const activeIds: ReadinessDimensionId[] = [
      'academic', 'language', 'financial', 'documents', 'visa', 'research'
    ];

    activeIds.forEach(id => {
      scores[id] = ScoringEngine.calculateDimensionScore(id, profile, university, program);
    });

    return scores as Record<ReadinessDimensionId, DimensionScore>;
  }

  private static calculateOverallReadiness(scores: Record<ReadinessDimensionId, DimensionScore>): number {
    const totalWeight = Object.values(scores).reduce((acc, s) => acc + s.weight, 0);
    if (totalWeight === 0) return 0;
    return Object.values(scores).reduce((acc, s) => acc + (s.currentScore * s.weight), 0) / totalWeight;
  }

  private static generateActions(scores: Record<ReadinessDimensionId, DimensionScore>): PriorityAction[] {
    return Object.values(scores)
      .filter(s => s.gap > 0)
      .sort((a, b) => (b.gap * b.weight) - (a.gap * a.weight))
      .slice(0, 3)
      .map(s => ({
        id: `action-${s.id}`,
        label: `بهبود ${s.title}`,
        impact: Math.round(s.gap * s.weight),
        effort: 'Medium',
        type: this.mapType(s.id)
      }));
  }

  private static mapType(id: ReadinessDimensionId): any {
    if (id === 'academic') return 'academic';
    if (id === 'language') return 'language';
    if (id === 'documents') return 'document';
    if (id === 'financial') return 'financial';
    return 'other';
  }
}
