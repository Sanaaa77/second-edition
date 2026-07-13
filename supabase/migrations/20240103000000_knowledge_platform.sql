-- 1. CAMPUSES
CREATE TABLE IF NOT EXISTS public.campuses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  facilities TEXT[],
  image_url TEXT,
  coords JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LIVING COST DETAILS (Granular)
CREATE TABLE IF NOT EXISTS public.living_cost_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'Food', 'Rent', 'Transport', 'Utilities'
  item_name TEXT NOT NULL,
  min_price NUMERIC,
  max_price NUMERIC,
  currency TEXT DEFAULT 'TRY',
  last_updated DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CAREER OUTCOMES & EMPLOYMENT STATS
CREATE TABLE IF NOT EXISTS public.career_outcomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  employment_rate_6m NUMERIC, -- percentage
  avg_starting_salary NUMERIC,
  top_employers TEXT[],
  popular_roles TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VISA & IMMIGRATION RULES
CREATE TABLE IF NOT EXISTS public.visa_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_name TEXT DEFAULT 'Turkey',
  visa_type TEXT NOT NULL, -- 'Student', 'Graduate', 'Work'
  requirements TEXT[],
  processing_time_days INTEGER,
  fee_amount NUMERIC,
  fee_currency TEXT DEFAULT 'USD',
  last_verified DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. IMPORT LOGS (Tracking data ingestion)
CREATE TABLE IF NOT EXISTS public.import_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  file_name TEXT,
  entity_type TEXT, -- 'University', 'Program', etc.
  total_records INTEGER,
  success_count INTEGER,
  failed_count INTEGER,
  errors JSONB,
  status TEXT DEFAULT 'Completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INDEXES FOR NEW TABLES
CREATE INDEX idx_campus_uni_id ON public.campuses(university_id);
CREATE INDEX idx_cost_city_id ON public.living_cost_details(city_id);
CREATE INDEX idx_career_uni_id ON public.career_outcomes(university_id);
CREATE INDEX idx_career_prog_id ON public.career_outcomes(program_id);

-- 7. TRIGGERS
CREATE TRIGGER set_campuses_updated_at BEFORE UPDATE ON public.campuses FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
