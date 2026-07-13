import { Logger } from "../logging/Logger";

export type DomainEventType =
  | 'ApplicationCreated'
  | 'ApplicationStatusChanged'
  | 'DocumentUploaded'
  | 'DocumentVerified'
  | 'DocumentRejected'
  | 'TaskCompleted'
  | 'MissionCompleted'
  | 'LessonCompleted'
  | 'ReadinessUpdated'
  | 'DecisionGenerated'
  | 'NotificationCreated'
  | 'OfferReceived'
  | 'VisaApproved'
  | 'EnrollmentCompleted'
  | 'ProfileUpdated';

export enum EventPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

export interface DomainEvent<T = unknown> {
  type: DomainEventType;
  payload: T;
  priority?: EventPriority;
  metadata: {
    timestamp: string;
    actorId?: string;
    correlationId: string;
    role?: string;
  };
}

type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void> | void;

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<DomainEventType, { handler: EventHandler; priority: EventPriority }[]> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<T>(
    type: DomainEventType, 
    handler: EventHandler<T>, 
    priority: EventPriority = EventPriority.NORMAL
  ): void {
    const currentHandlers = this.handlers.get(type) || [];
    this.handlers.set(type, [...currentHandlers, { handler, priority }].sort((a, b) => b.priority - a.priority));
  }

  public async publish<T>(event: DomainEvent<T>): Promise<void> {
    const handlerConfigs = this.handlers.get(event.type) || [];
    
    // In a critical production system, we'd use a real queue like Kafka or RabbitMQ here.
    // We execute them sequentially within their priority groups to respect priorities.
    for (const { handler } of handlerConfigs) {
      try {
        await handler(event);
      } catch (error) {
        Logger.error(`[EventBus] Error in handler for ${event.type}`, error, { 
          correlationId: event.metadata.correlationId 
        });
        // Logic for dead letter queue or retries would go here.
      }
    }
  }
}

export const domainEventBus = EventBus.getInstance();
