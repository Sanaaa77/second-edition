"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { container, TOKENS } from "@/lib/core/di/registry";
import { KnowledgeService } from "@/services/university/knowledge.service";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { Search as SearchIcon, GraduationCap, FileText, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { SearchResult } from "@/types/knowledge";
import { University, ArticleTranslation } from "@/types/database";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const knowledgeService = container.resolve<KnowledgeService>(TOKENS.KNOWLEDGE_SERVICE);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      const data = await knowledgeService.globalSearch({ query: searchTerm });
      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] py-24 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-black text-white tracking-tighter">نتایج جستجو</h1>
          <div className="glass border-white/10 rounded-2xl p-2 flex items-center gap-4">
            <SearchIcon className="w-6 h-6 text-muted-foreground mr-4" />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              className="flex-1 bg-transparent border-none outline-none text-foreground py-4 text-lg" 
              placeholder="جستجو در تمام دیتابیس..."
            />
            <MagneticButton onClick={() => handleSearch(query)} className="px-10 py-4 font-black">جستجو</MagneticButton>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary w-12 h-12" /></div>
        ) : results ? (
          <div className="space-y-12">
            {/* Universities */}
            {results.universities && results.universities.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                  <GraduationCap className="text-primary" /> دانشگاه‌ها
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.universities.map((uni: Partial<University>) => (
                    <Link href={`/university/${uni.slug}`} key={uni.id}>
                      <PremiumCard className="p-6 hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-lg">{uni.name}</span>
                          <ChevronRight className="w-5 h-5 text-primary" />
                        </div>
                      </PremiumCard>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Articles */}
            {results.articles && results.articles.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                  <FileText className="text-primary" /> مقالات و راهنماها
                </h3>
                <div className="space-y-4">
                  {results.articles.map((art: Partial<ArticleTranslation>) => (
                    <PremiumCard key={art.article_id} className="p-6 flex justify-between items-center hover:border-primary/50 cursor-pointer">
                      <div>
                        <h4 className="font-bold text-foreground">{art.title}</h4>
                        <p className="text-xs text-muted-foreground mt-2">{art.excerpt}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-primary" />
                    </PremiumCard>
                  ))}
                </div>
              </div>
            )}
            
            {!results.universities?.length && !results.articles?.length && !results.programs?.length && (
              <div className="text-center py-20 text-muted-foreground">نتیجه‌ای یافت نشد.</div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">عبارتی را برای جستجو وارد کنید.</div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
