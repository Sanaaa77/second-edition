import { AcademyRepository, ProfileRepository } from "@/lib/repositories";
import { CacheManager } from "@/lib/core/cache/CacheManager";
import { EventBus, EventPriority } from "@/lib/core/events/EventBus";
import { BaseService } from "../BaseService";
import { AcademyStats, AcademyProgress, AcademyCourse } from "@/types/academy";

export class AcademyService extends BaseService {
  constructor(
    private readonly academyRepo: AcademyRepository,
    private readonly profileRepo: ProfileRepository,
    private readonly cache: CacheManager,
    private readonly eventBus: EventBus
  ) {
    super();
  }

  async getAllCourses(): Promise<AcademyCourse[]> {
    return this.execute(async () => {
      const { data } = await this.academyRepo.findAllCourses();
      return data || [];
    }, { name: 'AcademyService.getAllCourses', cacheKey: 'academy_courses' });
  }

  async completeLesson(profileId: string, courseId: string, lessonId: string, xpEarned: number): Promise<void> {
    await this.execute(async () => {
      // 1. Update Progress
      const { data: currentProgress } = await this.academyRepo.getProgress(profileId);
      const courseProgress = currentProgress?.find(p => p.course_id === courseId);
      
      const completedLessons = new Set<string>((courseProgress?.completed_lessons as string[]) || []);
      if (!completedLessons.has(lessonId)) {
        completedLessons.add(lessonId);
        await this.academyRepo.updateProgress(profileId, courseId, Array.from(completedLessons));

        // 2. Update Stats (XP, Streak)
        const { data: stats } = await this.academyRepo.getStats(profileId);
        if (stats) {
          const now = new Date();
          const lastLessonAt = stats.last_lesson_at ? new Date(stats.last_lesson_at) : null;
          let newStreak = stats.daily_streak;

          if (lastLessonAt) {
            const diffDays = Math.floor((now.getTime() - lastLessonAt.getTime()) / (1000 * 3600 * 24));
            if (diffDays === 1) newStreak += 1;
            else if (diffDays > 1) newStreak = 1;
          } else {
            newStreak = 1;
          }

          await this.academyRepo.updateStats(profileId, {
            total_xp: stats.total_xp + xpEarned,
            daily_streak: newStreak,
            last_lesson_at: now.toISOString()
          });
        }

        // 3. Log XP
        await this.academyRepo.addXP(profileId, xpEarned, 'LessonCompletion');

        // 4. Invalidate Caches
        this.cache.invalidatePattern(`academy_progress_${profileId}`);
        this.cache.invalidatePattern(`academy_stats_${profileId}`);

        // 5. Publish Event
        await this.eventBus.publish({
          type: 'LessonCompleted',
          payload: { profileId, courseId, lessonId, xpEarned },
          priority: EventPriority.NORMAL,
          metadata: {
            timestamp: new Date().toISOString(),
            correlationId: crypto.randomUUID(),
            actorId: profileId
          }
        });
      }
    }, { name: 'AcademyService.completeLesson' });
  }

  async getAcademyDashboard(profileId: string) {
    return this.execute(async () => {
      const stats = await this.academyRepo.getStats(profileId);
      const progress = await this.academyRepo.getProgress(profileId);
      return { stats: stats.data, progress: progress.data };
    }, { 
      name: 'AcademyService.getAcademyDashboard', 
      cacheKey: `academy_dashboard_${profileId}` 
    });
  }
}
