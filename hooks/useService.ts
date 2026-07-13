import { container } from "@/lib/core/di/Container";
import { TOKENS } from "@/lib/core/di/registry";

export function useService<T>(token: keyof typeof TOKENS): T {
  return container.resolve<T>(TOKENS[token]);
}
