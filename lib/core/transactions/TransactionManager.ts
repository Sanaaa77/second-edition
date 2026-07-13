import { Logger } from "@/lib/core/logging/Logger";

export const TransactionManager = {
  /**
   * Logical transaction runner for services.
   */
  async run<T>(
    operation: () => Promise<T>,
    onError?: (error: unknown) => Promise<void> | void
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (onError) {
        await onError(error);
      }
      throw error;
    }
  }
};
