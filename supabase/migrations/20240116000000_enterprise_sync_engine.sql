-- 1. DATA SOURCES REGISTRY
CREATE TABLE IF NOT EXISTS public.data_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  url TEXT,
  description TEXT,
  auth_config JSONB, -- For future API keys
  last_sync_at TIMESTAMPTZ,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SYNC JOBS & HISTORY
CREATE TABLE IF NOT EXISTS public.sync_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID REFERENCES public.data_sources(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'university', 'program', etc.
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Running', 'Completed', 'Failed', 'Partial')),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  records_processed INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_inserted INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  errors JSONB,
  log_output TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AUDIT LOGS FOR CHANGES (Incremental Updates Detection)
CREATE TABLE IF NOT EXISTS public.data_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES auth.users(id),
  job_id UUID REFERENCES public.sync_jobs(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ADD METADATA COLUMNS TO CORE TABLES
ALTER TABLE public.universities 
ADD COLUMN IF NOT EXISTS source_id UUID REFERENCES public.data_sources(id),
ADD COLUMN IF NOT EXISTS source_url TEXT,
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS import_version TEXT DEFAULT '1.0';

ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS source_id UUID REFERENCES public.data_sources(id),
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS import_version TEXT DEFAULT '1.0';

-- 5. VALIDATION REPORTS
CREATE TABLE IF NOT EXISTS public.data_validation_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  rule_name TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('Warning', 'Error', 'Critical')),
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BACKGROUND JOB QUEUE (Simple)
CREATE TABLE IF NOT EXISTS public.background_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_type TEXT NOT NULL,
  payload JSONB,
  status TEXT DEFAULT 'Queued' CHECK (status IN ('Pending', 'Processing', 'Completed', 'Failed')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_error TEXT,
  run_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INDEXES
CREATE INDEX idx_sync_source ON public.sync_jobs(source_id);
CREATE INDEX idx_audit_entity ON public.data_audit_logs(entity_type, entity_id);
CREATE INDEX idx_jobs_status ON public.background_jobs(status, run_at);
