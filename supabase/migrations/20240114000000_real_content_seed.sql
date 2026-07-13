-- SEED DATA FOR CITIES
INSERT INTO public.cities (name, slug, living_cost_index, population, climate, description, image_url) VALUES
('استانبول', 'istanbul', 'High', '15.46M', 'Moderate', 'قطب فرهنگی و اقتصادی ترکیه، پلی میان آسیا و اروپا.', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200'),
('آنکارا', 'ankara', 'Medium', '5.66M', 'Continental', 'پایتخت ترکیه و مرکز سیاسی و دانشگاهی کشور.', 'https://images.unsplash.com/photo-1589113320674-a098583626e2'),
('ازمیر', 'izmir', 'Medium', '4.37M', 'Mediterranean', 'مروارید دریای اژه، شهری مدرن با جو دانشجویی عالی.', 'https://images.unsplash.com/photo-1572978393539-756623d6a782')
ON CONFLICT (slug) DO NOTHING;

-- SEED DATA FOR UNIVERSITIES
INSERT INTO public.universities (name, slug, type, ranking_global, ranking_local, logo_url, hero_image_url, verified, published, description) VALUES
('دانشگاه کچ (Koç University)', 'koc-university', 'Private', 451, 1, 'https://upload.wikimedia.org/wikipedia/en/2/29/Koc_University_logo.png', 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3', true, true, 'یکی از معتبرترین دانشگاه‌های خصوصی ترکیه با تمرکز بر تحقیق.'),
('دانشگاه فنی خاورمیانه (METU)', 'metu', 'Public', 501, 2, 'https://upload.wikimedia.org/wikipedia/en/b/ba/Middle_East_Technical_University_logo.png', 'https://images.unsplash.com/photo-1562774053-701939374585', true, true, 'برترین دانشگاه دولتی ترکیه در زمینه مهندسی و علوم پایه.'),
('دانشگاه سابانجی (Sabancı University)', 'sabanci-university', 'Private', 530, 3, 'https://upload.wikimedia.org/wikipedia/en/0/0e/Sabanci_University_logo.png', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1', true, true, 'دانشگاهی مدرن با سیستم آموزشی میان‌رشته‌ای در استانبول.')
ON CONFLICT (slug) DO NOTHING;

-- LINK UNIVERSITIES TO CITIES
UPDATE public.universities SET city_id = (SELECT id FROM public.cities WHERE slug = 'istanbul') WHERE slug IN ('koc-university', 'sabanci-university');
UPDATE public.universities SET city_id = (SELECT id FROM public.cities WHERE slug = 'ankara') WHERE slug = 'metu';

-- SEED DATA FOR KNOWLEDGE ARTICLES
INSERT INTO public.articles (slug, category, published, featured_image) VALUES
('study-in-turkey-guide', 'Study in Turkey', true, 'https://images.unsplash.com/photo-1527672809634-04ed36500acd'),
('turkish-student-visa-2026', 'Visa', true, 'https://images.unsplash.com/photo-1544027993-37dbfe43562a'),
('living-costs-in-istanbul', 'Life', true, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750')
ON CONFLICT (slug) DO NOTHING;

-- ARTICLE TRANSLATIONS
INSERT INTO public.article_translations (article_id, language_code, title, content, excerpt) VALUES
((SELECT id FROM public.articles WHERE slug = 'study-in-turkey-guide'), 'fa', 'راهنمای جامع تحصیل در ترکیه ۲۰۲۶', 'محتوای کامل درباره نحوه پذیرش، بورسیه‌ها و زندگی دانشجویی در ترکیه...', 'همه آنچه باید برای شروع مهاجرت تحصیلی به ترکیه بدانید.'),
((SELECT id FROM public.articles WHERE slug = 'turkish-student-visa-2026'), 'fa', 'مراحل دریافت ویزای دانشجویی ترکیه', 'راهنمای گام به گام دریافت ویزا از سفارت ترکیه در ایران...', 'مدارک و مراحل لازم برای ویزای تحصیلی.'),
((SELECT id FROM public.articles WHERE slug = 'living-costs-in-istanbul'), 'fa', 'هزینه‌های زندگی دانشجویی در استانبول', 'تحلیل دقیق هزینه‌های اجاره، خوراک و حمل و نقل...', 'چقدر پول برای زندگی در استانبول نیاز دارید؟')
ON CONFLICT (article_id, language_code) DO NOTHING;

-- UPDATE KOÇ UNIVERSITY DETAILS
UPDATE public.universities SET 
admission_requirements = '{
  "ielts": 6.5,
  "gpa": 16.0,
  "documents": ["Passport", "Diploma", "Transcript", "SOP"]
}',
facts = '[
  {"label": "Academic Staff", "value": "500+", "icon": "Users"},
  {"label": "Research Projects", "value": "1000+", "icon": "Beaker"},
  {"label": "Global Partners", "value": "300+", "icon": "Globe"}
]'
WHERE slug = 'koc-university';

-- UPDATE METU DETAILS
UPDATE public.universities SET 
admission_requirements = '{
  "ielts": 6.0,
  "gpa": 15.0,
  "documents": ["Passport", "Diploma", "Transcript", "SAT"]
}',
facts = '[
  {"label": "Founded", "value": "1956", "icon": "Calendar"},
  {"label": "Campus Area", "value": "4500 Hectares", "icon": "Map"},
  {"label": "Library", "value": "500,000+ Books", "icon": "Book"}
]'
WHERE slug = 'metu';

-- PROGRAMS
INSERT INTO public.programs (university_id, name, degree_level, language, duration_years, tuition_fee, currency) VALUES
((SELECT id FROM public.universities WHERE slug = 'koc-university'), 'مهندسی کامپیوتر', 'Bachelor', 'English', 4, 15000, 'USD'),
((SELECT id FROM public.universities WHERE slug = 'koc-university'), 'مدیریت کسب و کار (MBA)', 'Master', 'English', 2, 20000, 'USD'),
((SELECT id FROM public.universities WHERE slug = 'metu'), 'مهندسی عمران', 'Bachelor', 'English', 4, 2500, 'USD'),
((SELECT id FROM public.universities WHERE slug = 'sabanci-university'), 'طراحی و ارتباطات تصویری', 'Bachelor', 'English', 4, 18000, 'USD')
ON CONFLICT DO NOTHING;
