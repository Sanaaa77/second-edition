-- MASSIVE ACADEMY CONTENT SEED (Production Level)
DO $$
DECLARE
    eng_a1 UUID;
    tur_a1 UUID;
    mod_id UUID;
    lesson_id UUID;
BEGIN
    SELECT id INTO eng_a1 FROM public.academy_courses WHERE slug = 'english-a1';
    SELECT id INTO tur_a1 FROM public.academy_courses WHERE slug = 'turkish-a1';

    -- 1. ENGLISH A1 - MODULE 3: FAMILY & HOME
    INSERT INTO public.academy_modules (course_id, title, order_index) 
    VALUES (eng_a1, 'Family & Home', 3) RETURNING id INTO mod_id;

    INSERT INTO public.academy_lessons (module_id, title, type, content_json, order_index, duration_minutes, xp_reward)
    VALUES (mod_id, 'Lesson 5: Family Members', 'Video', '{"video_url": "https://youtube.com/embed/fam1", "text": "Learning about Mother, Father, Brother, Sister."}', 1, 12, 50)
    RETURNING id INTO lesson_id;

    INSERT INTO public.academy_exercises (lesson_id, type, title, instruction, content, order_index)
    VALUES (lesson_id, 'matching', 'Match Family Roles', 'Match the English word to its relation.', '{"pairs": [{"a": "Mother", "b": "Mom"}, {"a": "Father", "b": "Dad"}]}', 1);

    -- 2. TURKISH A1 - MODULE 3: SHOPPING
    INSERT INTO public.academy_modules (course_id, title, order_index)
    VALUES (tur_a1, 'خرید و قیمت‌ها', 3) RETURNING id INTO mod_id;

    INSERT INTO public.academy_lessons (module_id, title, type, content_json, order_index, duration_minutes, xp_reward)
    VALUES (mod_id, 'درس ۵: در بازار', 'Video', '{"video_url": "https://youtube.com/embed/tr_shop1", "text": "چگونه قیمت بپرسیم؟"}', 1, 18, 60)
    RETURNING id INTO lesson_id;

    INSERT INTO public.academy_exercises (lesson_id, type, title, instruction, content, order_index)
    VALUES (lesson_id, 'fill_in_the_blank', 'خرید نان', 'جای خالی را پر کنید.', '{"question": "Bir ____ ekmek lütfen.", "correct_answer": "tane", "explanation": "تانه به معنای دانه یا عدد است."}', 1);

END $$;
