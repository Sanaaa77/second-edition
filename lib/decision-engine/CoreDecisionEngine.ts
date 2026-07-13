import { 
  Profile, 
  University, 
} from "@/types/database";
import { DecisionReport } from "@/lib/decision-engine/types";
import { RecommendationPipeline } from "@/services/pipeline/RecommendationPipeline";

export const DecisionReportService = {
  async generate(student: Profile, universities: University[]): Promise<DecisionReport> {
    return await RecommendationPipeline.process(student, universities);
  }
};
