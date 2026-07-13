-- 1. EXTEND APPLICATION STATUSES
-- Note: Reusing public.applications but hardening its structure

-- 2. APPLICATION STATUS HISTORY (Already exists, but ensuring completeness)
CREATE TABLE IF NOT EXISTS public.application_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. OFFERS (University Acceptance Letters)
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE UNIQUE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  university_id UUID REFERENCES public.universities(id),
  program_id UUID REFERENCES public.programs(id),
  offer_type TEXT CHECK (offer_type IN ('Conditional', 'Unconditional')),
  tuition_deposit_required NUMERIC DEFAULT 0,
  deadline DATE,
  file_url TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VISA APPLICATIONS
CREATE TABLE IF NOT EXISTS public.visa_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  country TEXT DEFAULT 'Turkey',
  status TEXT DEFAULT 'Not_Started' CHECK (status IN ('Not_Started', 'Preparing', 'Submitted', 'Interview_Scheduled', 'Approved', 'Rejected')),
  appointment_date TIMESTAMPTZ,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RESIDENCE PERMITS (Ikamet)
CREATE TABLE IF NOT EXISTS public.residence_permits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  permit_number TEXT,
  expiry_date DATE,
  status TEXT CHECK (status IN ('Active', 'Expired', 'Processing')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. APPLICATION MESSAGES (Between Student and Admin/Advisor)
CREATE TABLE IF NOT EXISTS public.application_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  attachments TEXT[],
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS POLICIES FOR NEW TABLES
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own offers" ON public.offers FOR SELECT USING (auth.uid() = profile_id);

ALTER TABLE public.visa_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own visa" ON public.visa_applications FOR ALL USING (auth.uid() = profile_id);

ALTER TABLE public.application_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users participate in application chats" ON public.application_messages 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.applications 
    WHERE id = application_id AND profile_id = auth.uid()
  ) OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'advisor')
  )
);

-- 8. INDEXES
CREATE INDEX IF NOT EXISTS idx_offer_app_id ON public.offers(application_id);
CREATE INDEX IF NOT EXISTS idx_visa_profile_id ON public.visa_applications(profile_id);
CREATE INDEX IF NOT EXISTS idx_msg_app_id ON public.application_messages(application_id);
