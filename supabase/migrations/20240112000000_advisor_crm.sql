-- 1. ADVISOR ROLES & RELATIONSHIPS
-- We already have 'advisor' role in profiles. Let's create a linkage table.
CREATE TABLE IF NOT EXISTS public.advisor_students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Graduated')),
  UNIQUE(advisor_id, student_id)
);

-- 2. CONSULTATIONS & MEETINGS
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')),
  meeting_link TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADVISOR TASKS (Specific to CRM management)
CREATE TABLE IF NOT EXISTS public.advisor_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In_Progress', 'Completed', 'Cancelled')),
  due_date TIMESTAMPTZ,
  remind_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INTERNAL NOTES (Private to advisors)
CREATE TABLE IF NOT EXISTS public.advisor_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  is_private BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MESSAGING SYSTEM
CREATE TABLE IF NOT EXISTS public.message_threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_a UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_b UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID REFERENCES public.message_threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments TEXT[],
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LEAD PIPELINE
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  source TEXT,
  status TEXT DEFAULT 'New' CHECK (status IN (
    'New', 'Contacted', 'Consultation_Scheduled', 'Interested', 
    'Application_Started', 'Application_Submitted', 'Accepted', 'Enrolled', 'Closed', 'Rejected'
  )),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CALENDAR EVENTS (Meetings + Reminders)
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  event_type TEXT CHECK (event_type IN ('Meeting', 'Deadline', 'FollowUp', 'Task')),
  reference_id UUID, -- Links to consultation_id or task_id
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. RLS POLICIES
ALTER TABLE public.advisor_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Advisors View Assigned Students" ON public.advisor_students 
FOR ALL USING (advisor_id = auth.uid());

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Advisors View Consultations" ON public.consultations 
FOR ALL USING (advisor_id = auth.uid() OR student_id = auth.uid());

ALTER TABLE public.advisor_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Advisors Own Notes" ON public.advisor_notes 
FOR ALL USING (advisor_id = auth.uid());

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users View Own Messages" ON public.messages 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.message_threads 
    WHERE id = thread_id AND (participant_a = auth.uid() OR participant_b = auth.uid())
  )
);

-- 9. INDEXES
CREATE INDEX idx_advisor_student ON public.advisor_students(advisor_id, student_id);
CREATE INDEX idx_consult_advisor ON public.consultations(advisor_id);
CREATE INDEX idx_messages_thread ON public.messages(thread_id);
