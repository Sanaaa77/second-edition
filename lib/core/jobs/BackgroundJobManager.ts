import { Logger } from "@/lib/core/logging/Logger";
import { BackgroundJobRepository } from "@/lib/repositories/sync.repository";

export class BackgroundJobManager {
  private static isProcessing = false;

  constructor(private readonly jobRepo: BackgroundJobRepository) {}

  async processQueue() {
    if (BackgroundJobManager.isProcessing) return;
    BackgroundJobManager.isProcessing = true;

    try {
      const { data: jobs } = await this.jobRepo.getPendingJobs();
      if (!jobs || jobs.length === 0) return;

      Logger.info(`[JobManager] Processing ${jobs.length} pending jobs`);

      for (const job of jobs) {
        await this.jobRepo.updateJobStatus(job.id, 'Processing');
        
        try {
          // Dispatch to actual worker based on job_type
          await this.executeJob(job);
          await this.jobRepo.updateJobStatus(job.id, 'Completed');
        } catch (error: any) {
          Logger.error(`[JobManager] Job ${job.id} failed`, error);
          const updates = {
            attempts: job.attempts + 1,
            last_error: error.message,
            run_at: new Date(Date.now() + Math.pow(2, job.attempts) * 60000).toISOString() // Exponential backoff
          };
          await this.jobRepo.updateJobStatus(job.id, job.attempts + 1 >= job.max_attempts ? 'Failed' : 'Pending', updates);
        }
      }
    } finally {
      BackgroundJobManager.isProcessing = false;
    }
  }

  private async executeJob(job: any) {
    switch (job.job_type) {
      case 'SYNC_KNOWLEDGE':
        // Call KnowledgeSyncService
        break;
      case 'VALIDATE_DATA':
        // Call DataValidatorService
        break;
      default:
        throw new Error(`Unknown job type: ${job.job_type}`);
    }
  }
}
