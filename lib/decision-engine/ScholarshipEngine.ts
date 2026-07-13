import { Profile, Scholarship } from "@/types/database";
import { ScholarshipEligibility } from "./types";

export class ScholarshipEngine {
  static evaluate(profile: Profile, scholarship: Scholarship): ScholarshipEligibility {
    let probability = 50;
    const missingRequirements: string[] = [];
    
    // GPA check
    if (profile.gpa && profile.gpa > 3.5) {
      probability += 30;
    } else if (profile.gpa && profile.gpa < 3.0) {
      probability -= 20;
    }

    // Language check
    const ielts = profile.language_profiles?.ielts?.overall || 0;
    if (ielts >= 7.5) {
      probability += 15;
    }

    probability = Math.min(Math.max(probability, 0), 95);

    return {
      id: scholarship.id,
      scholarship,
      probability,
      expectedAmount: (scholarship.coverage_percentage || 0) * 100, // Just a mock mapping
      currency: 'USD',
      requirements: scholarship.requirements || [],
      missingRequirements,
      status: probability > 75 ? 'eligible' : probability > 40 ? 'potential' : 'ineligible'
    };
  }
}
