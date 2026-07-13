export type ErrorSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ErrorMetadata extends Record<string, unknown> {
  module?: string;
  severity?: ErrorSeverity;
  correlationId?: string;
  developerMessage?: string;
  timestamp?: string;
}

export class BaseError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly severity: ErrorSeverity;
  public readonly module?: string;
  public readonly correlationId?: string;
  public readonly developerMessage?: string;
  public readonly timestamp: string;
  public readonly metadata?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    status: number = 500,
    metadata: ErrorMetadata = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.severity = metadata.severity || 'Medium';
    this.module = metadata.module;
    this.correlationId = metadata.correlationId;
    this.developerMessage = metadata.developerMessage;
    this.timestamp = metadata.timestamp || new Date().toISOString();
    this.metadata = metadata;
    
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      severity: this.severity,
      module: this.module,
      correlationId: this.correlationId,
      timestamp: this.timestamp,
      metadata: this.metadata,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
    };
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, 'VALIDATION_ERROR', 400, { severity: 'Low', ...metadata });
  }
}

export class AuthorizationError extends BaseError {
  constructor(message: string = 'Unauthorized access', metadata?: ErrorMetadata) {
    super(message, 'AUTHORIZATION_ERROR', 403, { severity: 'High', ...metadata });
  }
}

export class WorkflowError extends BaseError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, 'WORKFLOW_ERROR', 400, { severity: 'Medium', ...metadata });
  }
}

export class StorageError extends BaseError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, 'STORAGE_ERROR', 500, { severity: 'High', ...metadata });
  }
}

export class RepositoryError extends BaseError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, 'REPOSITORY_ERROR', 500, { severity: 'High', ...metadata });
  }
}

export class ConfigurationError extends BaseError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, 'CONFIGURATION_ERROR', 500, { severity: 'Critical', ...metadata });
  }
}
