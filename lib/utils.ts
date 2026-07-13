import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const transitionMd = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1]
};

export const transitionLg = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1]
};
