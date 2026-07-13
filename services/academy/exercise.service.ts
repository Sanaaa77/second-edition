import { BaseService } from "../BaseService";
import { AcademyExercise } from "@/types/academy";

export class ExerciseService extends BaseService {
  async validateAnswer(exercise: AcademyExercise, answer: any): Promise<{
    isCorrect: boolean;
    feedback: string;
    explanation?: string;
  }> {
    return this.execute(async () => {
      let isCorrect = false;

      switch (exercise.type) {
        case 'multiple_choice':
          isCorrect = exercise.content.correct_answer === answer;
          break;
        case 'fill_in_the_blank':
          isCorrect = String(exercise.content.correct_answer).toLowerCase() === String(answer).toLowerCase();
          break;
        // Other types would have specific validation logic
        default:
          isCorrect = false;
      }

      return {
        isCorrect,
        feedback: isCorrect ? "آفرین! پاسخ شما صحیح است." : "متاسفانه پاسخ اشتباه است. دوباره تلاش کنید.",
        explanation: exercise.content.explanation
      };
    }, { name: 'ExerciseService.validateAnswer' });
  }
}
