import { Profile, Task } from "@/types/database";
import { RoadmapItem, DimensionScore } from "./types";
import { ReadinessDimensionId } from "@/types/decision-engine";

export class RoadmapGenerator {
  static generate(profile: Profile, scores: Record<ReadinessDimensionId, DimensionScore>): RoadmapItem[] {
    const roadmap: RoadmapItem[] = [];
    let weekOffset = 1;

    // Academic Task
    if (scores.academic.gap > 0) {
      roadmap.push({
        id: 'road-1',
        milestone: 'Boost Academic Profile',
        description: 'Complete relevant courses or certifications to increase GPA competitiveness.',
        date: this.getFutureDate(weekOffset++),
        completed: false,
        category: 'academic'
      });
    }

    // Language Task
    if (scores.language.gap > 0) {
      roadmap.push({
        id: 'road-2',
        milestone: 'IELTS/TOEFL Preparation',
        description: 'Take a mock test and focus on weak modules.',
        date: this.getFutureDate(weekOffset++),
        completed: false,
        category: 'language'
      });
    }

    // Document Task
    roadmap.push({
        id: 'road-3',
        milestone: 'Prepare Statement of Purpose',
        description: 'Draft your SOP highlighting your research and work experience.',
        date: this.getFutureDate(weekOffset++),
        completed: false,
        category: 'documents'
    });

    return roadmap;
  }

  private static getFutureDate(weeks: number): string {
    const d = new Date();
    d.setDate(d.getDate() + (weeks * 7));
    return d.toISOString();
  }
}
