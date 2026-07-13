import { ReadinessDimensionId } from "@/types/decision-engine";

export const DEFAULT_WEIGHTS: Record<ReadinessDimensionId, number> = {
  academic: 0.25,
  language: 0.15,
  financial: 0.15,
  documents: 0.10,
  visa: 0.05,
  research: 0.05,
  work: 0.05,
  scholarship: 0.05,
  timeline: 0.05,
  interview: 0.03,
  statement: 0.03,
  recommendations: 0.02,
  portfolio: 0.02,
};

export const STATUS_THRESHOLDS = {
  EXCELLENT: 90,
  ON_TRACK: 70,
  AT_RISK: 40,
};
