import { BaseService } from "../BaseService";
import { AcademyRepository } from "@/lib/repositories";
import { LanguageLevel } from "@/types/academy";

export class PlacementTestService extends BaseService {
  constructor(private readonly academyRepo: AcademyRepository) {
    super();
  }

  async evaluateResult(profileId: string, score: number, language: 'English' | 'Turkish'): Promise<{
    assignedLevel: LanguageLevel;
    suggestedCourses: string[];
  }> {
    return this.execute(async () => {
      let level: LanguageLevel = 'A1';

      if (score > 90) level = 'C1';
      else if (score > 75) level = 'B2';
      else if (score > 60) level = 'B1';
      else if (score > 40) level = 'A2';

      // Update student stats
      const updates = language === 'English' 
        ? { english_level: level } 
        : { turkish_level: level };
      
      await this.academyRepo.updateStats(profileId, updates);

      return {
        assignedLevel: level,
        suggestedCourses: [] // Logic to find courses for this level
      };
    }, { name: 'PlacementTestService.evaluateResult' });
  }
}
