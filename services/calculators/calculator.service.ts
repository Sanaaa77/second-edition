import { BaseService } from "../BaseService";
import { City, University, Profile } from "@/types/database";

export class CalculatorService extends BaseService {
  async calculateLivingCost(city: City, lifestyle: 'budget' | 'standard' | 'premium' = 'standard') {
    return this.execute(async () => {
      // Mock logic based on city data
      const rent = parseInt(city.rent?.split('-')[0] || "10000");
      const food = parseInt(city.food?.split(' ')[0] || "5000");
      
      const multiplier = lifestyle === 'budget' ? 0.8 : lifestyle === 'premium' ? 1.5 : 1;
      
      return {
        estimatedMonthlyTotal: Math.round((rent + food + 2000) * multiplier),
        breakdown: {
          housing: Math.round(rent * multiplier),
          food: Math.round(food * multiplier),
          transport: 1500,
          leisure: Math.round(1000 * multiplier)
        },
        currency: 'TRY'
      };
    }, { name: 'CalculatorService.calculateLivingCost' });
  }

  async estimateStudyBudget(university: University, years: number = 4) {
    return this.execute(async () => {
      const annualTuition = university.tuition_fee || 5000;
      const annualLiving = 12 * 10000; // Mock 10k TRY/mo
      
      return {
        totalTuition: annualTuition * years,
        totalLiving: (annualLiving / 30) * years, // Conv to USD approx
        totalInvestment: (annualTuition * years) + (annualLiving / 30 * years),
        currency: 'USD'
      };
    }, { name: 'CalculatorService.estimateStudyBudget' });
  }

  async planIELTSGoal(currentScore: number, targetScore: number, weeksAvailable: number) {
    return this.execute(async () => {
      const gap = targetScore - currentScore;
      const requiredHoursPerWeek = (gap * 100) / weeksAvailable;
      
      return {
        isFeasible: requiredHoursPerWeek <= 25,
        hoursPerWeek: Math.round(requiredHoursPerWeek),
        recommendedFocus: gap > 1 ? ['Academic Writing', 'Listening'] : ['Mock Tests'],
        difficulty: gap > 1.5 ? 'High' : 'Moderate'
      };
    }, { name: 'CalculatorService.planIELTSGoal' });
  }
}
