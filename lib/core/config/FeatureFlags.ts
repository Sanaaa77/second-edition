import { config } from './Config';

export type FeatureName = keyof typeof config.features;

export const FeatureFlags = {
  isEnabled(feature: FeatureName): boolean {
    return !!config.features[feature];
  },

  getAll(): Record<FeatureName, boolean> {
    return { ...config.features };
  }
};
