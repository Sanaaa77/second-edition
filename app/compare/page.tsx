"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { container, TOKENS } from "@/lib/core/di/registry";
import { KnowledgeService } from "@/services/university/knowledge.service";
import { UniversityComparison } from "@/components/university/UniversityComparison";
import { Loader2 } from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const slugA = searchParams.get("a");
  const slugB = searchParams.get("b");
  
  const [data, setData] = useState<{ uniA: any; uniB: any } | null>(null);
  const [loading, setLoading] = useState(true);

  const knowledgeService = container.resolve<KnowledgeService>(TOKENS.KNOWLEDGE_SERVICE);

  useEffect(() => {
    async function fetchComparison() {
      if (slugA && slugB) {
        const [uniA, uniB] = await Promise.all([
          knowledgeService.getUniversityDetail(slugA),
          knowledgeService.getUniversityDetail(slugB)
        ]);
        setData({ uniA, uniB });
      }
      setLoading(false);
    }
    fetchComparison();
  }, [slugA, slugB]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#020617]"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
  if (!data?.uniA || !data?.uniB) return <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">لطفاً دو دانشگاه را برای مقایسه انتخاب کنید.</div>;

  return <UniversityComparison uniA={data.uniA} uniB={data.uniB} />;
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>}>
      <CompareContent />
    </Suspense>
  );
}
