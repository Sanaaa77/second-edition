-- 1. REQUIRED DOCUMENTS BY PROGRAM
CREATE TABLE IF NOT EXISTS public.program_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  is_mandatory BOOLEAN DEFAULT TRUE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. APPLICATION DOCUMENTS (Mapping uploaded docs to specific applications)
CREATE TABLE IF NOT EXISTS public.application_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, document_id)
);

-- 3. RLS
ALTER TABLE public.program_requirements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read requirements" ON public.program_requirements FOR SELECT USING (true);

ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own app docs" ON public.application_documents 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.applications 
    WHERE id = application_id AND profile_id = auth.uid()
  )
);
