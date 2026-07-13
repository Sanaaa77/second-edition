-- 1. LANGUAGE LEVELS & COURSES
CREATE TABLE IF NOT EXISTS public.academy_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  language TEXT CHECK (language IN ('English', 'Turkish')),
  level TEXT CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Academic', 'IELTS', 'TOEFL', 'TOMER')),
  thumbnail_url TEXT,
  total_lessons INTEGER DEFAULT 0,
  estimated_hours INTEGER,
  xp_reward INTEGER DEFAULT 100,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MODULES & LESSONS
CREATE TABLE IF NOT EXISTS public.academy_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.academy_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.academy_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_json JSONB, -- Video URL, text, etc.
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. QUIZZES & FLASHCARDS
CREATE TABLE IF NOT EXISTS public.academy_quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
  questions JSONB NOT NULL, -- Array of { question, options, answer }
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STUDENT PROGRESS & GAMIFICATION
CREATE TABLE IF NOT EXISTS public.academy_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  completed_lessons UUID[] DEFAULT '{}',
  current_level TEXT,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.academy_stats (
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_xp INTEGER DEFAULT 0,
  daily_streak INTEGER DEFAULT 0,
  last_lesson_at TIMESTAMPTZ,
  total_study_minutes INTEGER DEFAULT 0,
  english_level TEXT DEFAULT 'A1',
  turkish_level TEXT DEFAULT 'A1'
);

-- 5. PLACEMENT TESTS
CREATE TABLE IF NOT EXISTS public.academy_placement_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  language TEXT CHECK (language IN ('English', 'Turkish')),
  questions JSONB NOT NULL
);

-- 6. INDEXES
CREATE INDEX idx_academy_lessons_module ON public.academy_lessons(module_id);
CREATE INDEX idx_academy_progress_profile ON public.academy_progress(profile_id);
