-- Seeding Cities
INSERT INTO public.cities (name, slug, living_cost_index, population, climate, description, coords, rent, dorm, transport, food) VALUES
('استانبول', 'istanbul', 'High', '15.8M', 'Moderate', 'بزرگترین شهر ترکیه و مرکز تجاری و فرهنگی.', '{"x": "20%", "y": "25%"}', '۱۲,۰۰۰ - ۲۵,۰۰۰', '۵,۰۰۰ - ۱۲,۰۰۰', '۵۰۰ - ۸۰۰', '۴,۰۰۰ - ۷,۰۰۰'),
('آنکارا', 'ankara', 'Medium', '5.7M', 'Continental', 'پایتخت اداری و قطب دانشگاه‌های دولتی.', '{"x": "45%", "y": "40%"}', '۸,۰۰۰ - ۱۵,۰۰۰', '۳,۵۰۰ - ۸,۰۰۰', '۴۰۰ - ۶۰۰', '۳,۵۰۰ - ۶,۰۰۰'),
('ازمیر', 'izmir', 'Medium', '4.4M', 'Mediterranean', 'شهر ساحلی و مدرن با لایف‌استایل آزاد.', '{"x": "10%", "y": "55%"}', '۹,۰۰۰ - ۱۸,۰۰۰', '۴,۰۰۰ - ۹,۰۰۰', '۴۵۰ - ۷۰۰', '۳,۸۰۰ - ۶,۵۰۰');

-- Seeding Universities (Sample of top ones)
DO $$
DECLARE
    istanbul_id uuid;
    ankara_id uuid;
BEGIN
    SELECT id INTO istanbul_id FROM public.cities WHERE slug = 'istanbul';
    SELECT id INTO ankara_id FROM public.cities WHERE slug = 'ankara';

    INSERT INTO public.universities (city_id, name, slug, type, ranking_global, ranking_local, verified) VALUES
    (istanbul_id, 'دانشگاه کوچ', 'koc-university', 'Private', 451, 1, true),
    (istanbul_id, 'دانشگاه سابانجی', 'sabanci-university', 'Private', 501, 2, true),
    (istanbul_id, 'دانشگاه فنی استانبول (ITU)', 'itu', 'Public', 601, 3, true),
    (istanbul_id, 'دانشگاه باهچه‌شهیر', 'bahcesehir-university', 'Private', 801, 5, true),
    (ankara_id, 'دانشگاه خاورمیانه (METU)', 'metu', 'Public', 501, 4, true),
    (ankara_id, 'دانشگاه بیلکنت', 'bilkent-university', 'Private', 601, 6, true);
END $$;

-- Seeding Programs (Sample)
DO $$
DECLARE
    koc_id uuid;
    bau_id uuid;
BEGIN
    SELECT id INTO koc_id FROM public.universities WHERE slug = 'koc-university';
    SELECT id INTO bau_id FROM public.universities WHERE slug = 'bahcesehir-university';

    INSERT INTO public.programs (university_id, name, faculty, degree_level, language, duration_years, tuition_fee) VALUES
    (koc_id, 'مهندسی کامپیوتر', 'دانشکده مهندسی', 'Bachelor', 'English', 4, 21500),
    (koc_id, 'مدیریت کسب و کار', 'دانشکده اقتصاد', 'Bachelor', 'English', 4, 21500),
    (bau_id, 'پزشکی', 'دانشکده پزشکی', 'Bachelor', 'English', 6, 25000),
    (bau_id, 'معماری', 'دانشکده معماری', 'Bachelor', 'English', 4, 8500),
    (bau_id, 'دندانپزشکی', 'دانشکده دندانپزشکی', 'Bachelor', 'Turkish', 5, 20000);
END $$;
