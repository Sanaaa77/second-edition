import { Profile, University, Program } from "@/types/database";
import { UniversityMatch } from "./types";

export class UniversityMatchEngine {
  static calculateMatch(profile: Profile, university: University, programs: Program[]): UniversityMatch {
    const academicMatch = this.scoreAcademic(profile, university);
    const languageMatch = this.scoreLanguage(profile, university);
    const budgetMatch = this.scoreBudget(profile, university);
    const cityMatch = this.scoreCity(profile, university);
    
    // Weighted sum
    const matchScore = Math.round(
      academicMatch * 0.35 +
      languageMatch * 0.20 +
      budgetMatch * 0.25 +
      cityMatch * 0.20
    );

    const reasons = [
      matchScore > 80 ? "Your profile strongly matches the entry requirements." : "Your profile is a competitive match.",
      budgetMatch > 80 ? "Tuition fees are within your stated budget." : "Budget adjustment might be needed."
    ];

    const strengths = [];
    if (academicMatch > 80) strengths.push("Strong GPA");
    if (languageMatch > 80) strengths.push("Excellent Language Score");

    const weaknesses = [];
    if (academicMatch < 60) weaknesses.push("Academic Gap");
    if (languageMatch < 60) weaknesses.push("Language Improvement Needed");

    return {
      university,
      matchScore,
      admission: {
        score: matchScore,
        reasons,
        strengths,
        weaknesses
      },
      dimensions: {
        academic: academicMatch,
        language: languageMatch,
        budget: budgetMatch,
        career: 75,
        scholarship: 60,
        city: cityMatch,
        visa: 85
      }
    };
  }

  private static scoreAcademic(profile: Profile, university: University): number {
    const gpa = profile.gpa || 0;
    const rankingFactor = university.ranking_global ? Math.max(0, 100 - (university.ranking_global / 50)) : 70;
    return Math.min(100, (gpa / 4.0) * rankingFactor + 20);
  }

  private static scoreLanguage(profile: Profile, university: University): number {
    const ielts = profile.language_profiles?.ielts?.overall || 0;
    if (ielts >= 7.0) return 100;
    if (ielts >= 6.5) return 90;
    if (ielts >= 6.0) return 75;
    return 50;
  }

  private static scoreBudget(profile: Profile, university: University): number {
    const budget = profile.budget || 0;
    return budget > 15000 ? 100 : budget > 8000 ? 80 : 40;
  }

  private static scoreCity(profile: Profile, university: University): number {
    return 80;
  }
}
