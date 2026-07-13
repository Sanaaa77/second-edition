-- EXTENDING UNIVERSITIES TABLE
ALTER TABLE public.universities 
ADD COLUMN IF NOT EXISTS history TEXT,
ADD COLUMN IF NOT EXISTS city_info TEXT,
ADD COLUMN IF NOT EXISTS campus_life TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_urls TEXT[], -- Array of image links
ADD COLUMN IF NOT EXISTS student_photos TEXT[],
ADD COLUMN IF NOT EXISTS facts JSONB, -- Array of {label, value, icon}
ADD COLUMN IF NOT EXISTS career_outcomes JSONB, -- {employment_rate, avg_salary, top_employers}
ADD COLUMN IF NOT EXISTS admission_requirements JSONB, -- {ielts, toefl, gpa, documents}
ADD COLUMN IF NOT EXISTS exchange_programs TEXT[],
ADD COLUMN IF NOT EXISTS research_centers TEXT[],
ADD COLUMN IF NOT EXISTS faq JSONB,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- INDEXES FOR EXTENDED SEARCH
CREATE INDEX IF NOT EXISTS idx_uni_featured ON public.universities(featured);
CREATE INDEX IF NOT EXISTS idx_uni_published ON public.universities(published);
