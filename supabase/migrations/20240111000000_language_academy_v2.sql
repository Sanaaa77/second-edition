-- 1. ENHANCED COURSE & LESSON STRUCTURE
ALTER TABLE public.academy_lessons 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Video' CHECK (type IN ('Video', 'Audio', 'Interactive', 'Quiz', 'Exercise')),
ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]', -- PDF links, etc.
ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 10;

-- 2. EXERCISE ENGINE
CREATE TABLE IF NOT EXISTS public.academy_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'multiple_choice', 'fill_in_the_blank', 'drag_drop', 'matching', 'sentence_order', 'speaking', 'writing'
  title TEXT,
  instruction TEXT,
  content JSONB NOT NULL, -- { question, options, correct_answer, hint, explanation }
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VOCABULARY BANK
CREATE TABLE IF NOT EXISTS public.academy_vocabulary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  translation TEXT,
  example_sentence TEXT,
  language TEXT CHECK (language IN ('English', 'Turkish')),
  proficiency_level INTEGER DEFAULT 0, -- 0-100 (spaced repetition weight)
  last_reviewed_at TIMESTAMPTZ,
  mastered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, word)
);

-- 4. GAMIFICATION: ACHIEVEMENTS & BADGES
CREATE TABLE IF NOT EXISTS public.academy_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  category TEXT, -- 'Streak', 'XP', 'CourseCompletion', 'SkillMastery'
  requirement_type TEXT,
  requirement_value INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profile_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.academy_achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, achievement_id)
);

-- 5. XP HISTORY (For Analytics Charts)
CREATE TABLE IF NOT EXISTS public.academy_xp_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT, -- 'LessonCompletion', 'DailyMission', 'QuizPerfectScore'
  created_at DATE DEFAULT CURRENT_DATE
);

-- 6. ATTEMPTS & EXAM HISTORY
CREATE TABLE IF NOT EXISTS public.academy_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.academy_quizzes(id) ON DELETE CASCADE,
  score INTEGER,
  passed BOOLEAN,
  answers JSONB,
  time_spent_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PLACEMENT TEST RESULTS
CREATE TABLE IF NOT EXISTS public.academy_placement_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_id UUID REFERENCES public.academy_placement_tests(id) ON DELETE CASCADE,
  score INTEGER,
  assigned_level TEXT,
  suggested_path JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AI COACH INTERACTIONS
CREATE TABLE IF NOT EXISTS public.academy_coach_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT, -- 'WritingFeedback', 'PronunciationTip', 'StudyAdvice'
  input_text TEXT,
  feedback_text TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DAILY MISSIONS
CREATE TABLE IF NOT EXISTS public.academy_daily_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 50,
  goal_type TEXT, -- 'LessonsCount', 'StudyTime', 'WordsLearned'
  goal_value INTEGER,
  created_at DATE DEFAULT CURRENT_DATE
);

-- 10. INDEXES
CREATE INDEX idx_vocab_profile ON public.academy_vocabulary(profile_id);
CREATE INDEX idx_xp_history_profile ON public.academy_xp_history(profile_id);
CREATE INDEX idx_attempts_profile ON public.academy_attempts(profile_id);
