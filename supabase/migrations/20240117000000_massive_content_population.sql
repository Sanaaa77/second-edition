-- 1. CITIES POPULATION
INSERT INTO public.cities (name, slug, living_cost_index, population, climate, description, image_url, rent, dorm, transport, food) VALUES
('استانبول', 'istanbul', 'High', '15.8M', 'Mediterranean/Oceanic', 'بزرگترین شهر ترکیه و مرکز اقتصادی و فرهنگی.', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200', '15000-30000 TRY', '5000-12000 TRY', '1500 TRY', '8000 TRY'),
('آنکارا', 'ankara', 'Medium', '5.7M', 'Continental', 'پایتخت سیاسی و قطب دانشگاهی ترکیه.', 'https://images.unsplash.com/photo-1589113320674-a098583626e2', '10000-20000 TRY', '4000-9000 TRY', '1200 TRY', '6500 TRY'),
('ازمیر', 'izmir', 'Medium', '4.4M', 'Mediterranean', 'شهری مدرن، ساحلی و بسیار مناسب برای زندگی دانشجویی.', 'https://images.unsplash.com/photo-1572978393539-756623d6a782', '12000-22000 TRY', '4500-10000 TRY', '1300 TRY', '7000 TRY'),
('اسکی‌شهیر', 'eskisehir', 'Low', '900K', 'Continental', 'شهر دانشجویی ترکیه با جوی بسیار صمیمی و هزینه پایین.', 'https://images.unsplash.com/photo-1562774053-701939374585', '7000-13000 TRY', '3000-7000 TRY', '900 TRY', '5500 TRY'),
('بورسا', 'bursa', 'Medium', '3.1M', 'Mediterranean', 'شهری تاریخی و صنعتی در نزدیکی استانبول.', 'https://images.unsplash.com/photo-1598335624134-49971939634e', '9000-18000 TRY', '3500-8000 TRY', '1100 TRY', '6000 TRY')
ON CONFLICT (slug) DO UPDATE SET 
  population = EXCLUDED.population,
  rent = EXCLUDED.rent,
  food = EXCLUDED.food;

-- 2. UNIVERSITIES POPULATION (TOP TIER)
INSERT INTO public.universities (name, slug, city_id, type, ranking_global, ranking_local, verified, published, description, hero_image_url) VALUES
('دانشگاه استانبول (Istanbul University)', 'istanbul-university', (SELECT id FROM public.cities WHERE slug = 'istanbul'), 'Public', 801, 5, true, true, 'قدیمی‌ترین و بزرگترین دانشگاه دولتی ترکیه با تاریخچه‌ای غنی.', 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3'),
('دانشگاه بوغازیچی (Boğaziçi University)', 'bogazici-university', (SELECT id FROM public.cities WHERE slug = 'istanbul'), 'Public', 601, 2, true, true, 'معتبرترین دانشگاه دولتی انگلیسی‌زبان ترکیه.', 'https://images.unsplash.com/photo-1562774053-701939374585'),
('دانشگاه فنی استانبول (ITU)', 'itu', (SELECT id FROM public.cities WHERE slug = 'istanbul'), 'Public', 551, 3, true, true, 'برترین دانشگاه مهندسی ترکیه با استانداردهای جهانی.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1'),
('دانشگاه حاجت‌تپه (Hacettepe University)', 'hacettepe-university', (SELECT id FROM public.cities WHERE slug = 'ankara'), 'Public', 651, 4, true, true, 'برترین دانشگاه علوم پزشکی و سلامت در ترکیه.', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200'),
('دانشگاه بیلکنت (Bilkent University)', 'bilkent-university', (SELECT id FROM public.cities WHERE slug = 'ankara'), 'Private', 451, 1, true, true, 'اولین دانشگاه خصوصی ترکیه با رنکینگ بین‌المللی عالی.', 'https://images.unsplash.com/photo-1589113320674-a098583626e2')
ON CONFLICT (slug) DO NOTHING;

-- 3. PROGRAMS (BACHELOR)
INSERT INTO public.programs (university_id, name, degree_level, language, duration_years, tuition_fee, currency) VALUES
((SELECT id FROM public.universities WHERE slug = 'itu'), 'مهندسی عمران', 'Bachelor', 'English', 4, 1500, 'USD'),
((SELECT id FROM public.universities WHERE slug = 'itu'), 'مهندسی مکانیک', 'Bachelor', 'English', 4, 1500, 'USD'),
((SELECT id FROM public.universities WHERE slug = 'bogazici-university'), 'اقتصاد', 'Bachelor', 'English', 4, 0, 'USD'),
((SELECT id FROM public.universities WHERE slug = 'hacettepe-university'), 'پزشکی', 'Bachelor', 'Turkish', 6, 4000, 'USD'),
((SELECT id FROM public.universities WHERE slug = 'bilkent-university'), 'مدیریت هتلداری', 'Bachelor', 'English', 4, 12000, 'USD')
ON CONFLICT DO NOTHING;

-- 4. KNOWLEDGE BASE ARTICLES (COMPREHENSIVE GUIDES)
INSERT INTO public.articles (slug, category, published, featured_image) VALUES
('student-visa-guide-2026', 'Visa', true, 'https://images.unsplash.com/photo-1544027993-37dbfe43562a'),
('residence-permit-turkey', 'Legal', true, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'),
('yos-exam-complete-guide', 'Exams', true, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173'),
('opening-bank-account-turkey', 'Life', true, 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f')
ON CONFLICT (slug) DO NOTHING;

-- ARTICLE TRANSLATIONS (Persian)
INSERT INTO public.article_translations (article_id, language_code, title, content, excerpt) VALUES
((SELECT id FROM public.articles WHERE slug = 'student-visa-guide-2026'), 'fa', 'راهنمای کامل دریافت ویزای تحصیلی ترکیه در سال ۲۰۲۶', 'ویزای تحصیلی ترکیه اولین قدم برای مهاجرت شماست. در این مقاله به بررسی مدارک لازم از جمله نامه پذیرش، تمکن مالی و بیمه می‌پردازیم...', 'مراحل گام‌به‌گام و مدارک لازم برای دریافت ویزای دانشجویی ترکیه از سفارت.'),
((SELECT id FROM public.articles WHERE slug = 'residence-permit-turkey'), 'fa', 'همه چیز درباره اقامت دانشجویی (کیملیک) ترکیه', 'بعد از ورود به ترکیه با ویزای تحصیلی، شما ۳۰ روز فرصت دارید تا برای راندوو اقامت اقدام کنید. مدارک مورد نیاز شامل برگه دانشجو، اجاره‌نامه نوتر شده و...', 'راهنمای دریافت کارت اقامت صورتی (کیملیک) برای دانشجویان خارجی.'),
((SELECT id FROM public.articles WHERE slug = 'yos-exam-complete-guide'), 'fa', 'آزمون یوس (YÖS) چیست؟ راهنمای جامع ۲۰۲۶', 'آزمون یوس اصلی‌ترین راه ورود به دانشگاه‌های دولتی ترکیه در مقطع کارشناسی است. این آزمون شامل سوالات هوش، ریاضی و هندسه می‌باشد...', 'بررسی ساختار آزمون TR-YÖS، منابع مطالعه و نحوه ثبت‌نام.'),
((SELECT id FROM public.articles WHERE slug = 'opening-bank-account-turkey'), 'fa', 'آموزش افتتاح حساب بانکی برای دانشجویان در ترکیه', 'داشتن حساب بانکی در بانک‌هایی مثل زراعت یا ایش بانک برای دریافت مبالغ بورسیه و پرداخت اجاره الزامی است...', 'چگونه بدون کارت اقامت یا با آن در بانک‌های زراعت و ایش بانک حساب باز کنیم؟')
ON CONFLICT (article_id, language_code) DO NOTHING;

-- 5. FAQs POPULATION
INSERT INTO public.faqs (university_id, category, order_index) VALUES
(null, 'Admission', 1),
(null, 'Visa', 2),
(null, 'Living', 3)
ON CONFLICT DO NOTHING;

INSERT INTO public.faq_translations (faq_id, language_code, question, answer) VALUES
((SELECT id FROM public.faqs WHERE category = 'Admission' LIMIT 1), 'fa', 'آیا بدون مدرک زبان می‌توان پذیرش گرفت؟', 'بله، اکثر دانشگاه‌ها دوره حاضرلیک (آمادگی زبان) دارند و شما می‌توانید یک سال به یادگیری زبان بپردازید.'),
((SELECT id FROM public.faqs WHERE category = 'Visa' LIMIT 1), 'fa', 'مدت زمان صدور ویزای تحصیلی چقدر است؟', 'معمولاً بین ۲ تا ۴ هفته پس از مصاحبه در کنسولگری زمان می‌برد.'),
((SELECT id FROM public.faqs WHERE category = 'Living' LIMIT 1), 'fa', 'متوسط هزینه زندگی دانشجویی در ترکیه چقدر است؟', 'بسته به شهر بین ۴۰۰ تا ۷۰۰ دلار ماهانه متغیر است.')
ON CONFLICT DO NOTHING;

-- 6. SCHOLARSHIPS
INSERT INTO public.scholarships (name, type, coverage_percentage, description, funding_amount, currency) VALUES
('ترکیه بورسلاری (Türkiye Bursları)', 'Government', 100, 'بورسیه کامل دولتی ترکیه شامل شهریه، خوابگاه و بیمه.', 3500, 'TRY'),
('بورسیه دانشگاه کچ', 'University', 50, 'بورسیه برای دانشجویان ممتاز ورودی در مقطع ارشد و دکترا.', 10000, 'TRY')
ON CONFLICT DO NOTHING;
