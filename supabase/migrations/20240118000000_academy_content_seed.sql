-- 1. ACADEMY COURSES
INSERT INTO public.academy_courses (title, slug, description, language, level, xp_reward, is_published) VALUES
('English for Beginners (A1)', 'english-a1', 'شروع یادگیری زبان انگلیسی از صفر با تمرکز بر جملات پایه و مکالمات روزمره.', 'English', 'A1', 500, true),
('Turkish for Beginners (A1)', 'turkish-a1', 'یادگیری الفبا و مکالمات مقدماتی زبان ترکی استانبولی برای زندگی در ترکیه.', 'Turkish', 'A1', 500, true),
('IELTS Preparation Masterclass', 'ielts-masterclass', 'آمادگی فشرده برای آزمون آیلتس با تمرکز بر مهارت‌های Speaking و Writing.', 'English', 'IELTS', 1500, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. MODULES FOR ENGLISH A1
INSERT INTO public.academy_modules (course_id, title, order_index) VALUES
((SELECT id FROM public.academy_courses WHERE slug = 'english-a1'), 'The Alphabet & Basic Greetings', 1),
((SELECT id FROM public.academy_courses WHERE slug = 'english-a1'), 'Numbers & Colors', 2),
((SELECT id FROM public.academy_courses WHERE slug = 'turkish-a1'), 'الفبای ترکی و تلفظ', 1),
((SELECT id FROM public.academy_courses WHERE slug = 'turkish-a1'), 'احوال‌پرسی و معرفی', 2)
ON CONFLICT DO NOTHING;

-- 3. LESSONS
INSERT INTO public.academy_lessons (module_id, title, type, content_json, order_index, duration_minutes, xp_reward) VALUES
((SELECT id FROM public.academy_modules WHERE title = 'The Alphabet & Basic Greetings' LIMIT 1), 'Lesson 1: Hello & Goodbye', 'Video', '{"video_url": "https://youtube.com/embed/demo1", "text": "In this lesson we learn how to say hello."}', 1, 15, 20),
((SELECT id FROM public.academy_modules WHERE title = 'الفبای ترکی و تلفظ' LIMIT 1), 'درس ۱: حروف صدادار و بی صدا', 'Video', '{"video_url": "https://youtube.com/embed/demo2", "text": "تلفظ صحیح حروف در ترکی استانبولی بسیار مهم است."}', 1, 20, 25)
ON CONFLICT DO NOTHING;

-- 4. EXERCISES
INSERT INTO public.academy_exercises (lesson_id, type, title, instruction, content, order_index) VALUES
((SELECT id FROM public.academy_lessons WHERE title = 'Lesson 1: Hello & Goodbye' LIMIT 1), 'multiple_choice', 'Greeting Check', 'Choose the correct formal greeting.', '{"question": "How do you say hello formally?", "options": ["Hi", "Hello", "Good Morning", "Hey"], "correct_answer": "Good Morning", "explanation": "Good morning is more formal than Hi."}', 1)
ON CONFLICT DO NOTHING;

-- 5. DAILY MISSIONS
INSERT INTO public.academy_daily_missions (title, description, xp_reward, goal_type, goal_value) VALUES
('زبان‌شناس امروز', 'کامل کردن ۲ درس از دوره ترکی', 100, 'LessonsCount', 2),
('سحرخیز', 'مطالعه ۱۵ دقیقه قبل از ظهر', 50, 'StudyTime', 15)
ON CONFLICT DO NOTHING;
