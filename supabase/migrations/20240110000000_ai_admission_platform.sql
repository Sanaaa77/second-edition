-- 1. EXTENDING PROFILES FOR AI ANALYSIS
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS academic_details JSONB DEFAULT '{
  "high_school_gpa": null,
  "bachelor_gpa": null,
  "master_gpa": null,
  "top_tier_uni": false,
  "backlogs": 0
}',
ADD COLUMN IF NOT EXISTS language_profiles JSONB DEFAULT '{
  "ielts": { "overall": null, "listening": null, "reading": null, "writing": null, "speaking": null },
  "toefl": { "overall": null },
  "tomer": { "level": null },
  "pte": { "overall": null }
}',
ADD COLUMN IF NOT EXISTS experience_details JSONB DEFAULT '{
  "work_years": 0,
  "research_projects": 0,
  "publications": 0,
  "certificates": [],
  "volunteering": 0
}',
ADD COLUMN IF NOT EXISTS financial_profile JSONB DEFAULT '{
  "annual_budget": 0,
  "source_of_funds": "Self",
  "bank_statement_ready": false,
  "scholarship_needed": true
}';

-- 2. ADMISSION RULES & WEIGHTS
CREATE TABLE IF NOT EXISTS public.admission_weights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dimension TEXT NOT NULL UNIQUE,
  weight NUMERIC(3,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admission_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL, -- 'GPA', 'Language', 'Age', 'Deadline'
  min_value NUMERIC,
  max_value NUMERIC,
  required_value TEXT,
  priority INTEGER DEFAULT 1,
  is_hard_requirement BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PREDICTIONS & DECISION REPORTS
CREATE TABLE IF NOT EXISTS public.student_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  admission_probability NUMERIC(5,2),
  scholarship_probability NUMERIC(5,2),
  confidence_score NUMERIC(5,2),
  strengths TEXT[],
  weaknesses TEXT[],
  risk_factors TEXT[],
  last_calculated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, university_id, program_id)
);

CREATE TABLE IF NOT EXISTS public.decision_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  overall_readiness NUMERIC(5,2),
  dimensions JSONB, -- Full breakdown
  next_best_actions JSONB, -- Array of {label, impact, type}
  roadmap JSONB, -- Personalized timeline
  top_matches JSONB, -- Array of {university_id, match_score}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DREAM UNIVERSITIES
CREATE TABLE IF NOT EXISTS public.dream_universities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, university_id, program_id)
);

-- 5. SIMULATION HISTORY
CREATE TABLE IF NOT EXISTS public.simulation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  input_changes JSONB, -- The "What-If" parameters
  result_changes JSONB, -- The outcome
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEED INITIAL WEIGHTS
INSERT INTO public.admission_weights (dimension, weight, description) VALUES
('academic', 0.35, 'GPA and Academic Background'),
('language', 0.20, 'English or Turkish Proficiency'),
('financial', 0.15, 'Proof of funds and tuition budget'),
('experience', 0.10, 'Work and Research Experience'),
('visa', 0.10, 'Historical visa success for profile'),
('documents', 0.10, 'Readiness of required paperwork')
ON CONFLICT (dimension) DO UPDATE SET weight = EXCLUDED.weight;

-- RLS
ALTER TABLE public.admission_weights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Weights" ON public.admission_weights FOR SELECT USING (true);

ALTER TABLE public.student_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users Own Predictions" ON public.student_predictions FOR SELECT USING (auth.uid() = profile_id);

ALTER TABLE public.decision_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users Own Reports" ON public.decision_reports FOR SELECT USING (auth.uid() = profile_id);

ALTER TABLE public.dream_universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users Own Dreams" ON public.dream_universities FOR ALL USING (auth.uid() = profile_id);

ALTER TABLE public.simulation_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users Own Simulations" ON public.simulation_history FOR ALL USING (auth.uid() = profile_id);
