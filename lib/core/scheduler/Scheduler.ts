import { Logger } from '../logging/Logger';

export type JobHandler = () => Promise<void>;

export interface ScheduledJob {
  id: string;
  name: string;
  interval: number; // ms
  handler: JobHandler;
  lastRun?: Date;
  status: 'idle' | 'running' | 'failed';
}

class Scheduler {
  private jobs = new Map<string, ScheduledJob>();
  private timers = new Map<string, NodeJS.Timeout>();

  public schedule(job: Omit<ScheduledJob, 'status' | 'lastRun'>): void {
    if (this.jobs.has(job.id)) {
      this.cancel(job.id);
    }

    const jobWithStatus: ScheduledJob = { ...job, status: 'idle' };
    this.jobs.set(job.id, jobWithStatus);

    const runJob = async () => {
      const currentJob = this.jobs.get(job.id);
      if (!currentJob || currentJob.status === 'running') return;

      currentJob.status = 'running';
      Logger.info(`[Scheduler] Running job: ${currentJob.name}`);

      try {
        await currentJob.handler();
        currentJob.status = 'idle';
        currentJob.lastRun = new Date();
        Logger.info(`[Scheduler] Completed job: ${currentJob.name}`);
      } catch (error) {
        currentJob.status = 'failed';
        Logger.error(`[Scheduler] Job failed: ${currentJob.name}`, error);
      }
    };

    const timer = setInterval(runJob, job.interval);
    this.timers.set(job.id, timer);
    Logger.info(`[Scheduler] Scheduled job: ${job.name} (Interval: ${job.interval}ms)`);
  }

  public cancel(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(id);
      this.jobs.delete(id);
      Logger.info(`[Scheduler] Cancelled job: ${id}`);
    }
  }

  public clear(): void {
    for (const id of Array.from(this.timers.keys())) {
      this.cancel(id);
    }
  }
}

export const scheduler = new Scheduler();
