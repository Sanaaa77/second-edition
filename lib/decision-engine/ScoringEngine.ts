import { Profile, University, Program, AdmissionRequirements } from "@/types/database";
import { ReadinessDimensionId, DimensionScore, DimensionStatus } from "./types";
import { DEFAULT_WEIGHTS, STATUS_THRESHOLDS } from "./config";

export class ScoringEngine {
  private static readonly MAX_SCORE = 100;
  private static readonly MIN_SCORE = 0;
  private static readonly TARGET_SCORE = 90;

  static calculateDimensionScore(
    id: ReadinessDimensionId,
    profile: Profile,
    university?: University,
    program?: Program
  ): DimensionScore {
    const weight = DEFAULT_WEIGHTS[id] || 0.05;
    const requirements = university?.admission_requirements || this.getDefaultRequirements();
    
    let currentScore = 50; // Default baseline
    let title = this.getDimensionTitle(id);
    let recommendations: string[] = [];
    let missingItems: string[] = [];

    switch (id) {
      case 'academic':
        currentScore = this.scoreAcademic(profile, requirements);
        break;
      case 'language':
        currentScore = this.scoreLanguage(profile, requirements);
        break;
      case 'financial':
        currentScore = this.scoreFinancial(profile);
        break;
      case 'documents':
        currentScore = this.scoreDocuments(profile, requirements);
        break;
      // Add more cases as needed
      default:
        currentScore = 60;
    }

    currentScore = this.clamp(currentScore);

    return {
      id,
      title,
      weight,
      currentScore,
      targetScore: this.TARGET_SCORE,
      maxScore: this.MAX_SCORE,
      gap: Math.max(0, this.TARGET_SCORE - currentScore),
      status: this.getStatus(currentScore),
      recommendation: recommendations[0] || `بهبود بخش ${title}`,
      recommendations,
      missingItems,
      estImprovementTime: '4 هفته',
      estReadinessGain: 10,
      estimatedImprovementGain: 10,
      estimatedDaysToImprove: 28
    };
  }

  private static scoreAcademic(profile: Profile, reqs: AdmissionRequirements): number {
    if (!profile.gpa) return 0;
    const normalizedGpa = (profile.gpa / (reqs.gpa || 14)) * 80;
    let bonus = 0;
    if (profile.academic_details?.top_tier_uni) bonus += 10;
    return normalizedGpa + bonus;
  }

  private static scoreLanguage(profile: Profile, reqs: AdmissionRequirements): number {
    const ielts = profile.language_profiles?.ielts?.overall || 0;
    const target = reqs.ielts || 6.0;
    if (ielts === 0) return 20;
    return (ielts / target) * 90;
  }

  private static scoreFinancial(profile: Profile): number {
    const budget = profile.budget || 0;
    if (budget >= 20000) return 100;
    if (budget >= 10000) return 75;
    if (budget >= 5000) return 40;
    return 20;
  }

  private static scoreDocuments(profile: Profile, reqs: AdmissionRequirements): number {
    // Simplified logic for now
    return 70;
  }

  private static clamp(score: number): number {
    return Math.min(Math.max(score, this.MIN_SCORE), this.MAX_SCORE);
  }

  private static getStatus(score: number): DimensionStatus {
    if (score >= STATUS_THRESHOLDS.EXCELLENT) return 'excellent';
    if (score >= STATUS_THRESHOLDS.ON_TRACK) return 'on-track';
    return 'at-risk';
  }

  private static getDimensionTitle(id: ReadinessDimensionId): string {
    const titles: Record<ReadinessDimensionId, string> = {
      academic: 'آمادگی تحصیلی',
      language: 'مهارت زبان',
      financial: 'توانمندی مالی',
      documents: 'تکمیل مدارک',
      visa: 'ریسک ویزا',
      research: 'سابقه پژوهشی',
      work: 'سابقه کاری',
      scholarship: 'شانس بورسیه',
      timeline: 'زمان‌بندی',
      interview: 'آمادگی مصاحبه',
      statement: 'انگیزه نامه',
      recommendations: 'توصیه‌نامه‌ها',
      portfolio: 'پورتفولیو'
    };
    return titles[id] || id;
  }

  private static getDefaultRequirements(): AdmissionRequirements {
    return {
      gpa: 14,
      ielts: 6.0,
      documents: ['Passport', 'Diploma']
    };
  }
}
