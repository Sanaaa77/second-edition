-- Enterprise Audit System
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role TEXT,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  previous_value JSONB,
  new_value JSONB,
  reason TEXT,
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  correlation_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for security
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can see audit logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Indexes for performance
CREATE INDEX idx_audit_actor_id ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_entity_type_id ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_correlation_id ON public.audit_logs(correlation_id);
CREATE INDEX idx_audit_created_at ON public.audit_logs(created_at);
