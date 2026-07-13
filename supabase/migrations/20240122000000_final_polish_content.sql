-- 1. EXTENDED CITIES DETAILS
UPDATE public.cities SET 
  districts = ARRAY['Beşiktaş', 'Kadıköy', 'Şişli', 'Fatih', 'Üsküdar'],
  hospitals = ARRAY['Acıbadem', 'American Hospital', 'Istanbul Florence Nightingale'],
  banks = ARRAY['Ziraat Bankası', 'İş Bankası', 'Garanti BBVA', 'Yapı Kredi'],
  emergency_numbers = '{"police": "155", "ambulance": "112", "fire": "110"}'::jsonb
WHERE slug = 'istanbul';

UPDATE public.cities SET 
  districts = ARRAY['Çankaya', 'Yenimahalle', 'Keçiören', 'Etimesgut'],
  hospitals = ARRAY['Hacettepe University Hospital', 'Ankara City Hospital'],
  emergency_numbers = '{"police": "155", "ambulance": "112", "fire": "110"}'::jsonb
WHERE slug = 'ankara';

-- 2. SCHOLARSHIP DATABASE COMPLETION
INSERT INTO public.scholarships (name, type, coverage_percentage, description, eligibility_criteria, application_guide, official_source, deadline) VALUES
('Success Scholarship (Başarı Bursu)', 'University', 50, 'Offered to students with high GPA during their studies.', '{"min_gpa": 3.5}', 'Apply through the student portal after the first semester.', 'University Official Website', '2026-10-01'),
('Support Scholarship (Destek Bursu)', 'Foundation', 25, 'Financial aid for students in need.', '{"need_based": true}', 'Submit income documents and family status.', 'Foundation Portal', '2026-09-15')
ON CONFLICT DO NOTHING;

-- 3. MASSIVE ARTICLE LIBRARY EXPANSION
INSERT INTO public.articles (slug, category, published) VALUES
('turkish-health-insurance-guide', 'Health', true),
('opening-sim-card-turkey', 'Technology', true),
('renting-apartment-student-guide', 'Accommodation', true),
('working-permit-graduates', 'Career', true),
('turkish-culture-for-students', 'Student Life', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.article_translations (article_id, language_code, title, content, excerpt) VALUES
((SELECT id FROM public.articles WHERE slug = 'turkish-health-insurance-guide'), 'fa', 'راهنمای کامل بیمه سلامت دانشجویی در ترکیه', 'بیمه سلامت (SGK یا خصوصی) برای تمدید اقامت الزامی است...', 'چگونه ارزان‌ترین و معتبرترین بیمه دانشجویی را بخریم؟'),
((SELECT id FROM public.articles WHERE slug = 'renting-apartment-student-guide'), 'fa', 'آموزش اجاره خانه دانشجویی و عقد قرارداد نوتر', 'نکات حقوقی قرارداد اجاره، هزینه‌های دپوزیت و کمیسیون املاک...', 'راهنمای گام به گام اجاره آپارتمان در استانبول و آنکارا.')
ON CONFLICT DO NOTHING;

-- 4. ACADEMY EXPANSION (MORE LEVELS)
INSERT INTO public.academy_courses (title, slug, language, level, xp_reward, is_published) VALUES
('IELTS Reading Strategies', 'ielts-reading', 'English', 'IELTS', 1000, true),
('Academic Writing for Master/PhD', 'academic-writing', 'English', 'Academic', 1200, true),
('Turkish B1 Intermediate', 'turkish-b1', 'Turkish', 'B1', 800, true)
ON CONFLICT (slug) DO NOTHING;
