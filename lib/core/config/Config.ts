import { z } from 'zod';
import { ConfigurationError } from '../errors/AppErrors';

const ConfigSchema = z.object({
  env: z.enum(['development', 'production', 'test']),
  supabase: z.object({
    url: z.string().url(),
    anonKey: z.string().min(1),
  }),
  app: z.object({
    name: z.string().default('TurkeyHub'),
    version: z.string().default('1.0.0'),
  }),
  features: z.object({
    academy: z.boolean().default(true),
    aiCoach: z.boolean().default(true),
    crm: z.boolean().default(true),
    payments: z.boolean().default(false),
    scholarships: z.boolean().default(true),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

class ConfigLoader {
  private config: Config | null = null;

  public load(): Config {
    if (this.config) return this.config;

    try {
      const rawConfig = {
        env: process.env.NODE_ENV || 'development',
        supabase: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        app: {
          name: 'TurkeyHub',
          version: '1.0.0',
        },
        features: {
          academy: process.env.FEATURE_ACADEMY !== 'false',
          aiCoach: process.env.FEATURE_AI_COACH !== 'false',
          crm: process.env.FEATURE_CRM !== 'false',
          payments: process.env.FEATURE_PAYMENTS === 'true',
          scholarships: process.env.FEATURE_SCHOLARSHIPS !== 'false',
        },
      };

      const parsed = ConfigSchema.safeParse(rawConfig);

      if (!parsed.success) {
        console.error('[Config] Invalid configuration:', parsed.error.format());
        throw new ConfigurationError('Invalid environment variables', { 
          metadata: parsed.error.format() as any 
        });
      }

      this.config = parsed.data;
      return this.config;
    } catch (error) {
      if (error instanceof ConfigurationError) throw error;
      throw new ConfigurationError(`Failed to load config: ${(error as Error).message}`);
    }
  }
}

export const configLoader = new ConfigLoader();
export const config = configLoader.load();
