import { Logger } from '../logging/Logger';

export interface Metric {
  name: string;
  value: number;
  timestamp: string;
  tags?: Record<string, string>;
}

class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: Metric[] = [];

  private constructor() {}

  public static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  public record(name: string, value: number, tags?: Record<string, string>): void {
    const metric: Metric = {
      name,
      value,
      timestamp: new Date().toISOString(),
      tags,
    };
    this.metrics.push(metric);
    
    // In production, we would stream this to a time-series DB like Prometheus or InfluxDB
    Logger.info(`[Metric] ${name}: ${value}`, { tags });
  }

  public async trackExecution<T>(name: string, operation: () => Promise<T>, tags?: Record<string, string>): Promise<T> {
    const start = performance.now();
    try {
      return await operation();
    } finally {
      const end = performance.now();
      this.record(`${name}_duration_ms`, end - start, tags);
    }
  }

  public getMetrics(): Metric[] {
    return [...this.metrics];
  }

  public clear(): void {
    this.metrics = [];
  }
}

export const metrics = MetricsCollector.getInstance();
