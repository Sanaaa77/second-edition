-- 1. UNIVERSITY TRANSLATIONS
CREATE TABLE IF NOT EXISTS public.university_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL, -- 'fa', 'en', 'tr'
  name TEXT NOT NULL,
  description TEXT,
  history TEXT,
  mission TEXT,
  vision TEXT,
  campus_life TEXT,
  meta_title TEXT,
  meta_description TEXT,
  UNIQUE(university_id, language_code)
);

-- 2. CITY TRANSLATIONS
CREATE TABLE IF NOT EXISTS public.city_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  climate_desc TEXT,
  student_life TEXT,
  transport_info TEXT,
  UNIQUE(city_id, language_code)
);

-- 3. OFFICIAL DATA SOURCES SEED
INSERT INTO public.data_sources (name, url, description) VALUES
('YÖK (Council of Higher Education)', 'https://www.yok.gov.tr', 'Official council regulating universities in Türkiye.'),
('QS World University Rankings', 'https://www.topuniversities.com', 'International university rankings provider.'),
('Times Higher Education', 'https://www.timeshighereducation.com', 'Global university rankings provider.')
ON CONFLICT (name) DO NOTHING;

-- 4. MASSIVE UNIVERSITIES SEED (Accredited List)
-- We use slugs for identification. Name column in main table acts as default (English).
INSERT INTO public.universities (name, slug, type, ranking_global, ranking_local, verified, published) VALUES
('Koç University', 'koc-university', 'Private', 451, 1, true, true),
('Sabancı University', 'sabanci-university', 'Private', 531, 2, true, true),
('Middle East Technical University', 'metu', 'Public', 551, 3, true, true),
('Istanbul Technical University', 'itu', 'Public', 601, 4, true, true),
('Boğaziçi University', 'bogazici-university', 'Public', 651, 5, true, true),
('Bilkent University', 'bilkent-university', 'Private', 501, 6, true, true),
('Hacettepe University', 'hacettepe-university', 'Public', 701, 7, true, true),
('Istanbul University', 'istanbul-university', 'Public', 801, 8, true, true),
('Ankara University', 'ankara-university', 'Public', 901, 9, true, true),
('Ege University', 'eg-university', 'Public', 1001, 10, true, true)
ON CONFLICT (slug) DO NOTHING;

-- 5. PERSIAN TRANSLATIONS SEED
INSERT INTO public.university_translations (university_id, language_code, name, description)
SELECT id, 'fa', 'دانشگاه کچ', 'دانشگاه کچ یکی از معتبرترین دانشگاه‌های تحقیقاتی و خصوصی در ترکیه است که در شهر استانبول واقع شده است.' FROM public.universities WHERE slug = 'koc-university'
ON CONFLICT DO NOTHING;

INSERT INTO public.university_translations (university_id, language_code, name, description)
SELECT id, 'fa', 'دانشگاه سابانجی', 'دانشگاه سابانجی با تمرکز بر آموزش میان‌رشته‌ای، از برترین موسسات آموزشی خصوصی در ترکیه به شمار می‌رود.' FROM public.universities WHERE slug = 'sabanci-university'
ON CONFLICT DO NOTHING;

INSERT INTO public.university_translations (university_id, language_code, name, description)
SELECT id, 'fa', 'دانشگاه فنی خاورمیانه', 'دانشگاه فنی خاورمیانه (METU) قطب مهندسی و علوم پایه در ترکیه و خاورمیانه است.' FROM public.universities WHERE slug = 'metu'
ON CONFLICT DO NOTHING;

-- 6. MASSIVE CITIES SEED
INSERT INTO public.cities (name, slug, population, climate) VALUES
('استانبول', 'istanbul', '15.8M', 'Mediterranean'),
('آنکارا', 'ankara', '5.7M', 'Continental'),
('ازمیر', 'izmir', '4.4M', 'Mediterranean'),
('اسکی‌شهیر', 'eskisehir', '900K', 'Continental'),
('بورسا', 'bursa', '3.1M', 'Mediterranean'),
('آنتالیا', 'antalya', '2.6M', 'Mediterranean'),
('آدانا', 'adana', '2.2M', 'Mediterranean'),
('قونیه', 'konya', '2.2M', 'Continental'),
('قاضی‌آنتپ', 'gaziantep', '2.1M', 'Continental'),
('مرسین', 'mersin', '1.9M', 'Mediterranean')
ON CONFLICT (slug) DO NOTHING;

-- 7. PROGRAMS SEED (Examples for top programs)
INSERT INTO public.programs (university_id, name, degree_level, language, duration_years, tuition_fee, currency)
SELECT id, 'Computer Engineering', 'Bachelor', 'English', 4, 15000, 'USD' FROM public.universities WHERE slug = 'koc-university'
ON CONFLICT DO NOTHING;

INSERT INTO public.programs (university_id, name, degree_level, language, duration_years, tuition_fee, currency)
SELECT id, 'Mechanical Engineering', 'Bachelor', 'English', 4, 1200, 'USD' FROM public.universities WHERE slug = 'itu'
ON CONFLICT DO NOTHING;

INSERT INTO public.programs (university_id, name, degree_level, language, duration_years, tuition_fee, currency)
SELECT id, 'Medicine', 'Bachelor', 'Turkish', 6, 3500, 'USD' FROM public.universities WHERE slug = 'hacettepe-university'
ON CONFLICT DO NOTHING;
