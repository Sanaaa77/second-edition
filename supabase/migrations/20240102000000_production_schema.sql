-- 1. UTILS: UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. CITIES
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  living_cost_index TEXT CHECK (living_cost_index IN ('Low', 'Medium', 'High')),
  population TEXT,
  climate TEXT,
  description TEXT,
  image_url TEXT,
  coords JSONB,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. UNIVERSITIES
CREATE TABLE IF NOT EXISTS public.universities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('Public', 'Private')),
  ranking_global INTEGER,
  ranking_local INTEGER,
  logo_url TEXT,
  hero_image_url TEXT,
  description TEXT,
  dormitory_available BOOLEAN DEFAULT TRUE,
  verified BOOLEAN DEFAULT FALSE,
  website_url TEXT,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FACULTIES
CREATE TABLE IF NOT EXISTS public.faculties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROGRAMS
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES public.faculties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  degree_level TEXT, -- Bachelor, Master, etc
  language TEXT CHECK (language IN ('Turkish', 'English', 'Mixed')),
  duration_years INTEGER,
  tuition_fee NUMERIC,
  currency TEXT DEFAULT 'USD',
  requirements TEXT[],
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROFILES (Extending Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  birth_date DATE,
  nationality TEXT DEFAULT 'Iranian',
  current_city TEXT,
  gpa NUMERIC(4,2),
  budget NUMERIC,
  preferred_language TEXT CHECK (preferred_language IN ('English', 'Turkish', 'Mixed')),
  preferred_major TEXT,
  target_degree TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'advisor', 'admin')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  current_step INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. APPLICATIONS
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Reviewing', 'Accepted', 'Rejected', 'Visa_Processing', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_uni_slug ON public.universities(slug);
CREATE INDEX IF NOT EXISTS idx_city_slug ON public.cities(slug);
CREATE INDEX IF NOT EXISTS idx_prog_uni_id ON public.programs(university_id);
CREATE INDEX IF NOT EXISTS idx_app_profile_id ON public.applications(profile_id);
CREATE INDEX IF NOT EXISTS idx_uni_city_id ON public.universities(city_id);

-- 9. SEARCH VECTORS (Triggers for Full-Text Search)
CREATE INDEX idx_uni_search ON public.universities USING GIN(search_vector);
CREATE OR REPLACE FUNCTION universities_search_trigger() RETURNS trigger AS $$
begin
  new.search_vector := to_tsvector('english', coalesce(new.name, '') || ' ' || coalesce(new.description, ''));
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_uni_search BEFORE INSERT OR UPDATE ON public.universities
FOR EACH ROW EXECUTE FUNCTION universities_search_trigger();

-- 10. RLS POLICIES
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Universities" ON public.universities FOR SELECT USING (true);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users Own Profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admins All Profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users Own Applications" ON public.applications FOR ALL USING (auth.uid() = profile_id);
