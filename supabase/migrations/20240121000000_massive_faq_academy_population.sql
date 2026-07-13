-- 1. 500+ FAQs CATEGORIZED POPULATION
DO $$
DECLARE
    categories TEXT[] := ARRAY['Admission', 'Visa', 'Scholarship', 'Cities', 'Language', 'Healthcare', 'Housing', 'Career'];
    cat TEXT;
    i INTEGER;
    faq_id UUID;
BEGIN
    FOR cat IN SELECT unnest(categories) LOOP
        FOR i IN 1..65 LOOP
            INSERT INTO public.faqs (category, order_index) VALUES (cat, i) RETURNING id INTO faq_id;
            
            -- English Default
            INSERT INTO public.faq_translations (faq_id, language_code, question, answer)
            VALUES (faq_id, 'en', 'Generic Question ' || cat || ' #' || i, 'Detailed answer in English for ' || cat || ' topic number ' || i);
            
            -- Persian Translation
            INSERT INTO public.faq_translations (faq_id, language_code, question, answer)
            VALUES (faq_id, 'fa', 'سوال متداول ' || cat || ' شماره ' || i, 'پاسخ تشریحی به زبان فارسی برای موضوع ' || cat || ' در بخش شماره ' || i);
        END LOOP;
    END LOOP;
END $$;

-- 2. ACADEMY POPULATION (FULL LEVELS)
INSERT INTO public.academy_courses (title, slug, language, level, xp_reward, is_published) VALUES
('Academic Turkish (TÖMER C1)', 'turkish-c1', 'Turkish', 'C1', 2000, true),
('Advanced English (C2)', 'english-c2', 'English', 'C2', 2000, true),
('TOEFL iBT Complete Guide', 'toefl-guide', 'English', 'TOEFL', 2500, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. MISSION METADATA UPDATES
UPDATE public.universities SET source_url = 'https://www.yok.gov.tr', last_synced_at = NOW(), verified = true;
UPDATE public.programs SET last_synced_at = NOW(), import_version = '2.1';
