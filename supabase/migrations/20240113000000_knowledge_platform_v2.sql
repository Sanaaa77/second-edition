-- 1. KNOWLEDGE ARTICLES & GUIDES (Multilingual Support)
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'Study in Turkey', 'Visa', 'Student Life', etc.
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  featured_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Translations for Articles
CREATE TABLE IF NOT EXISTS public.article_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL, -- 'fa', 'en', 'tr'
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Rich text/Markdown
  excerpt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  UNIQUE(article_id, language_code)
);

-- 2. STUDENT REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  language TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FAQs (Multilingual)
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  category TEXT, -- 'Admission', 'Dorm', 'Scholarship'
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faq_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  faq_id UUID REFERENCES public.faqs(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  UNIQUE(faq_id, language_code)
);

-- 4. RANKINGS (Detailed)
CREATE TABLE IF NOT EXISTS public.rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'QS', 'THE', 'National'
  rank INTEGER,
  year INTEGER,
  score NUMERIC,
  category TEXT, -- 'Overall', 'Engineering', etc.
  UNIQUE(university_id, provider, year, category)
);

-- 5. UNIVERSITY GALLERIES
CREATE TABLE IF NOT EXISTS public.university_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('Image', 'Video')),
  url TEXT NOT NULL,
  caption TEXT,
  is_hero BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SCHOLARSHIP EXTENSIONS
ALTER TABLE public.scholarships 
ADD COLUMN IF NOT EXISTS type TEXT, -- 'Merit', 'Need', 'Government'
ADD COLUMN IF NOT EXISTS eligibility_criteria JSONB,
ADD COLUMN IF NOT EXISTS application_guide TEXT,
ADD COLUMN IF NOT EXISTS funding_amount NUMERIC,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- 7. PROGRAM EXTENSIONS
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS curriculum JSONB, -- Array of semesters/courses
ADD COLUMN IF NOT EXISTS internship_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS demand_score INTEGER, -- 1-100
ADD COLUMN IF NOT EXISTS international_accreditation TEXT[];

-- 8. SEARCH VECTOR UPDATES
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;
CREATE TRIGGER tr_prog_search BEFORE INSERT OR UPDATE ON public.programs
FOR EACH ROW EXECUTE FUNCTION universities_search_trigger();

-- 9. RLS POLICIES
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public View Published Articles" ON public.articles FOR SELECT USING (published = TRUE);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public View FAQs" ON public.faqs FOR SELECT USING (true);

-- 10. INDEXES
CREATE INDEX idx_article_slug ON public.articles(slug);
CREATE INDEX idx_review_uni_id ON public.reviews(university_id);
CREATE INDEX idx_ranking_uni_id ON public.rankings(university_id);
