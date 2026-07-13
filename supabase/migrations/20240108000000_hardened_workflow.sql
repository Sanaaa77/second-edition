-- SPRINT 6: ADVANCED APPLICATION WORKFLOW
-- 1. AUDIT LOGS FOR SECURITY
CREATE TABLE IF NOT EXISTS public.application_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES auth.users(id),
  previous_status TEXT,
  new_status TEXT,
  action_type TEXT NOT NULL, -- 'STATUS_CHANGE', 'DOCUMENT_UPLOAD', 'NOTE_ADDED'
  reason TEXT,
  ip_address TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HARDENED DOCUMENTS TABLE
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS checksum TEXT,
ADD COLUMN IF NOT EXISTS expiry_date DATE,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reject_reason TEXT,
ADD COLUMN IF NOT EXISTS storage_path TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- 3. APPLICATION CHECKLISTS
CREATE TABLE IF NOT EXISTS public.application_checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  type TEXT NOT NULL, -- 'PASSPORT', 'TRANSCRIPT', 'SOP', 'FEE_PAYMENT', etc.
  priority TEXT DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High', 'Urgent')),
  is_completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  required_for_status TEXT, -- Status that requires this item (e.g., 'Submitted')
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS POLICIES
ALTER TABLE public.application_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own app logs" ON public.application_audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = application_id AND profile_id = auth.uid())
);

ALTER TABLE public.application_checklists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own checklist" ON public.application_checklists FOR ALL USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = application_id AND profile_id = auth.uid())
);

-- 5. INDEXES
CREATE INDEX idx_audit_app_id ON public.application_audit_logs(application_id);
CREATE INDEX idx_checklist_app_id ON public.application_checklists(application_id);
CREATE INDEX idx_doc_storage_path ON public.documents(storage_path);
