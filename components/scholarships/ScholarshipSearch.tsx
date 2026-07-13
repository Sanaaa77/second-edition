"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ScholarshipService } from "@/services/scholarship/scholarship.service";
import { Scholarship } from "@/types/database";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { Award, ArrowLeft, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { container } from "@/lib/core/di/Container";
import { TOKENS } from "@/lib/core/di/registry";

export const ScholarshipSearch = () => {
  const [query, setQuery] = useState("");
  
  const scholarshipService = useMemo(() => container.resolve<ScholarshipService>(TOKENS.SCHOLARSHIP_SERVICE as any), []);

  const { data: scholarships = [] } = useQuery({
    queryKey: ['scholarships'],
    queryFn: () => scholarshipService.getAll(),
  });

  const filtered = useMemo(() => {
    return scholarships.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [scholarships, query]);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-right">
          <div>
            <span className="text-primary font-black uppercase text-[10px] tracking-widest mb-2 block">Scholarship Intelligence</span>
            <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-foreground">فرصت‌های طلایی.</h2>
          </div>
          <div className="flex bg-white/5 p-2 rounded-2xl border border-white/5 w-full md:w-auto">
             <Search className="w-5 h-5 opacity-40 mx-4 self-center" />
             <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجو..." className="bg-transparent p-4 outline-none font-bold text-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((s, i) => (
            <Link key={i} href="/scholarships">
              <PremiumCard className="flex flex-col h-full border-white/5 group cursor-pointer hover:border-primary/50 transition-all">
                <div className="flex justify-between items-start mb-8 text-right">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Award /></div>
                  <div className="text-3xl font-black text-primary">{s.coverage_percentage}%</div>
                </div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors text-right text-foreground">{s.name}</h3>
                <p className="opacity-40 text-sm mb-10 leading-relaxed flex-1 text-right text-muted">{s.description}</p>
                <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-bold opacity-30 text-muted">
                  <span>DEADLINE: {s.deadline}</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </PremiumCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
