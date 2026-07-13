-- 1. ADDING MISSING UNIVERSITY & PROGRAM COLUMNS FOR STATISTICS
ALTER TABLE public.universities 
ADD COLUMN IF NOT EXISTS international_office_contact JSONB,
ADD COLUMN IF NOT EXISTS exchange_partners TEXT[],
ADD COLUMN IF NOT EXISTS research_output_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS student_satisfaction_rate NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT;

ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS learning_outcomes TEXT[],
ADD COLUMN IF NOT EXISTS average_graduate_salary NUMERIC,
ADD COLUMN IF NOT EXISTS quota_total INTEGER,
ADD COLUMN IF NOT EXISTS quota_international INTEGER;

-- 2. ACADEMY ENHANCEMENT: CERTIFICATES
CREATE TABLE IF NOT EXISTS public.academy_certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.academy_courses(id) ON DELETE CASCADE NOT NULL,
  certificate_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, course_id)
);

-- 3. INTERACTIVE TOOLS: SAVED SIMULATIONS
CREATE TABLE IF NOT EXISTS public.tool_simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tool_type TEXT NOT NULL, -- 'LivingCost', 'AdmissionProbability', 'Budget'
  input_data JSONB NOT NULL,
  result_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MASSIVE DATA POPULATION - PHASE 2 (Top Tier Completion)
UPDATE public.universities SET 
  international_office_contact = '{"email": "international@koc.edu.tr", "phone": "+90 212 338 1000"}',
  exchange_partners = ARRAY['Erasmus+', 'Global Exchange', 'Summer Programs'],
  research_output_score = 92,
  student_satisfaction_rate = 4.8
WHERE slug = 'koc-university';

UPDATE public.universities SET 
  international_office_contact = '{"email": "ico@metu.edu.tr", "phone": "+90 312 210 2298"}',
  exchange_partners = ARRAY['Erasmus+', 'AIESEC', 'IAESTE'],
  research_output_score = 95,
  student_satisfaction_rate = 4.7
WHERE slug = 'metu';

-- 5. POPULATE MORE PROGRAMS WITH REAL TUITION & REQS
INSERT INTO public.programs (university_id, name, degree_level, language, duration_years, tuition_fee, currency, requirements)
SELECT id, 'Medicine (English)', 'Bachelor', 'English', 6, 25000, 'USD', ARRAY['IELTS 6.5', 'GPA 18/20', 'SAT 1450'] FROM public.universities WHERE slug = 'koc-university'
ON CONFLICT DO NOTHING;

INSERT INTO public.programs (university_id, name, degree_level, language, duration_years, tuition_fee, currency, requirements)
SELECT id, 'Electrical Engineering', 'Bachelor', 'English', 4, 3000, 'USD', ARRAY['IELTS 6.0', 'GPA 16/20', 'TR-YOS 450'] FROM public.universities WHERE slug = 'itu'
ON CONFLICT DO NOTHING;

-- 6. SECURITY: RLS FOR NEW TABLES
ALTER TABLE public.academy_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own certificates" ON public.academy_certificates FOR SELECT USING (auth.uid() = profile_id);

ALTER TABLE public.tool_simulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own simulations" ON public.tool_simulations FOR ALL USING (auth.uid() = profile_id);
