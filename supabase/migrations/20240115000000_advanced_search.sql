-- ADVANCED SEARCH FUNCTIONS
CREATE OR REPLACE FUNCTION search_universities(
  search_query TEXT,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  logo_url TEXT,
  rank_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.slug,
    u.logo_url,
    ts_rank(u.search_vector, websearch_to_tsquery('english', search_query)) as rank_score
  FROM public.universities u
  WHERE u.search_vector @@ websearch_to_tsquery('english', search_query)
     OR u.name ILIKE '%' || search_query || '%'
  ORDER BY rank_score DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- TRENDING SEARCHES TRACKING
CREATE TABLE IF NOT EXISTS public.search_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  results_count INTEGER,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RECENTLY VIEWED (Client-side would handle this mostly, but we can store it)
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'university', 'article', 'program'
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
