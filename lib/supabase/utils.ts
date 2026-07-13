import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";

export const getSupabaseClient = () => {
  // Always use browser client in these services because they are called from hooks/client components
  // Server-side fetching should use server components directly or separate server services
  return createBrowserSupabaseClient();
};
