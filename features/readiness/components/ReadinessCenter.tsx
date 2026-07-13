"use client";
import React from "react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { AlertCircle, CheckCircle2, Zap, ArrowRight, Clock, Target } from "lucide-react";
import { useJourney } from "@/hooks/useJourney";
import { CircularReadiness } from "./visuals/CircularReadiness";
import { cn } from "@/lib/utils";

export const ReadinessCenter = () => {
  const { decisionReport, isLoading } = useJourney();

  if (isLoading || !decisionReport) return <div className="py-20 text-center opacity-40 font-bold">Analyzing Intelligence...</div>;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Main Readiness Score */}
        <div className="lg:col-span-4 flex justify-center">
           <CircularReadiness value={decisionReport.overallReadiness} label="Overall Readiness" size={280} />
        </div>

        {/* Executive Summary */}
        <div className="lg:col-span-8 space-y-8 text-right">
           <div className="inline-flex items-center gap-2 px-4 py-1 glass rounded-full text-[10px] font-black uppercase text-primary border-primary/20">
              <Zap className="w-3 h-3 fill-primary" /> Multi-Dimensional Analysis
           </div>
           <h2 className="text-5xl font-black text-foreground tracking-tighter">آمادگی شما <br />در یک نگاه.</h2>
           <p className="text-muted text-lg leading-relaxed max-w-2xl ml-auto">
             تحلیل هوشمند ما ۱۳ جنبه مختلف پروفایل شما را بررسی کرده است. در حال حاضر آمادگی شما در سطح «{decisionReport.overallReadiness > 70 ? 'بسیار خوب' : 'نیازمند بهبود'}» ارزیابی می‌شود.
           </p>
           
           <div className="flex justify-end gap-10">
              <div className="text-right">
                 <div className="text-3xl font-black text-green-500">{decisionReport.admissionProbability}%</div>
                 <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Admission Chance</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-right">
                 <div className="text-3xl font-black text-accent">{decisionReport.scholarshipProbability}%</div>
                 <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Scholarship Probability</div>
              </div>
           </div>
        </div>
      </div>

      {/* Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(decisionReport.dimensions).slice(0, 8).map(([key, detail]) => (
          <PremiumCard key={key} className="p-8 space-y-6 group">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-muted tracking-widest">{detail.title}</span>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  detail.status === 'excellent' ? 'bg-green-500' : 'bg-primary'
                )} />
             </div>
             <div className="text-3xl font-black text-foreground tracking-tighter">%{detail.currentScore}</div>
             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${detail.currentScore}%` }} 
                  className="h-full bg-primary" 
                />
             </div>
             <p className="text-[9px] text-muted font-bold leading-relaxed">{detail.recommendation}</p>
          </PremiumCard>
        ))}
      </div>

      {/* Priority Engine Widget */}
      <PremiumCard className="p-10 border-primary/20 bg-primary/5">
         <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-right space-y-2">
               <h4 className="text-xl font-black text-foreground">بالاترین اولویت اجرایی</h4>
               <p className="text-sm text-muted font-bold">انجام این اقدام بیشترین تاثیر آنی را بر آمادگی شما دارد.</p>
            </div>
            <div className="flex items-center gap-8">
               <div className="text-right">
                  <div className="text-2xl font-black text-primary">+{decisionReport.nextBestAction.impact}%</div>
                  <div className="text-[10px] font-bold text-muted uppercase">Readiness Gain</div>
               </div>
               <button className="bg-primary text-white px-10 py-4 rounded-xl font-black text-sm shadow-xl flex items-center gap-3">
                 <span>{decisionReport.nextBestAction.label}</span>
                 <ArrowRight className="w-4 h-4 rotate-180" />
               </button>
            </div>
         </div>
      </PremiumCard>
    </div>
  );
};
