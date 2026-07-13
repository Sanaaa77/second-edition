-- 1. CATEGORIZED ARTICLES
INSERT INTO public.articles (slug, category, published) VALUES
('how-to-study-mba-in-turkey', 'Programs', true),
('medicine-in-turkey-guide', 'Programs', true),
('engineering-prospects-turkey', 'Career', true),
('working-as-student-turkey', 'Student Life', true),
('turkish-citizenship-by-investment', 'Legal', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.article_translations (article_id, language_code, title, content, excerpt) VALUES
((SELECT id FROM public.articles WHERE slug = 'how-to-study-mba-in-turkey'), 'fa', 'راهنمای تحصیل در رشته MBA در ترکیه', 'بررسی بهترین دانشگاه‌های بیزینس ترکیه از جمله کچ و سابانجی...', 'شرایط پذیرش، شهریه و آینده شغلی MBA در ترکیه.'),
((SELECT id FROM public.articles WHERE slug = 'medicine-in-turkey-guide'), 'fa', 'تحصیل پزشکی در ترکیه: دولتی یا خصوصی؟', 'مقایسه دانشگاه‌های حاجت‌تپه، آنکارا و دانشگاه‌های خصوصی برتر...', 'همه چیز درباره آزمون یوس، سات و شهریه‌های سنگین رشته پزشکی.'),
((SELECT id FROM public.articles WHERE slug = 'working-as-student-turkey'), 'fa', 'قوانین کار دانشجویی در ترکیه ۲۰۲۶', 'آیا دانشجویان اجازه کار قانونی دارند؟ بررسی اجازه کار (Çalışما İzni)...', 'چگونه همزمان با تحصیل در ترکیه درآمد کسب کنیم؟')
ON CONFLICT DO NOTHING;

-- 2. HUNDREDS OF FAQs (Simulated via bulk categories)
DO $$
DECLARE
    cat TEXT;
    faqs_to_add JSONB := '[
        {"q": "آیا خوابگاه دولتی به دانشجویان خارجی تعلق می‌گیرد؟", "a": "بله، اما ظرفیت خوابگاه‌های KYK محدود است و اولویت با بورسیه‌هاست."},
        {"q": "تفاوت دانشگاه دولتی و خصوصی در چیست؟", "a": "دانشگاه‌های دولتی ارزان‌تر هستند اما آزمون ورودی دشوارتری دارند."},
        {"q": "آیا مدرک دانشگاه‌های ترکیه در ایران معتبر است؟", "a": "بله، بسیاری از دانشگاه‌ها مورد تایید وزارت علوم و بهداشت ایران هستند."}
    ]';
    faq RECORD;
BEGIN
    FOR cat IN SELECT unnest(ARRAY['Accommodation', 'Legal', 'Career']) LOOP
        FOR faq IN SELECT * FROM jsonb_to_recordset(faqs_to_add) AS x(q TEXT, a TEXT) LOOP
            INSERT INTO public.faqs (category) VALUES (cat) RETURNING id INTO faq.id;
            INSERT INTO public.faq_translations (faq_id, language_code, question, answer) 
            VALUES (faq.id, 'fa', faq.q, faq.a);
        END LOOP;
    END LOOP;
END $$;
