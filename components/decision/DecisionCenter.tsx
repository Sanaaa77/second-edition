"use client";
import React, { useMemo } from "react";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRightLeft,
  Zap,
  Target,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Loader2
} from "lucide-react";
import { useJourney } from "@/hooks/useJourney";
import { cn } from "@/lib/utils";

interface InsightBoxProps {
  title: string;
  pros: string[];
  cons: string[];
}

const InsightBox = ({ title, pros, cons }: InsightBoxProps) => (
  <div className="space-y-8">
    <div className="font-black text-lg border-b border-white/5 pb-4 text-foreground">{title}</div>
    <div className="space-y-4">
      {pros.map((p) => (
        <div key={p} className="flex items-center justify-end gap-3 text-sm font-bold text-green-500/80">
          {p} <ThumbsUp className="w-4 h-4" />
        </div>
      ))}
      {cons.map((c) => (
        <div key={c} className="flex items-center justify-end gap-3 text-sm font-bold text-red-500/80">
          {c} <ThumbsDown className="w-4 h-4" />
        </div>
      ))}
    </div>
  </div>
);

export const DecisionCenter = () => {
  const { user, decisionReport, isLoading } = useJourney();

  const userName = useMemo(() => (user as any).first_name || (user as any).name || "دانشجو", [user]);
  const userMajor = useMemo(() => (user as any).preferred_major || (user as any).major || "رشته انتخابی", [user]);

  return (
    <section id="decision-center" className="py-32 px-6 bg-[#020617] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto text-right">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border-white/5">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs font-black tracking-widest uppercase">Decision Intelligence OS</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-foreground md:text-center">اتاق فکر <br /><span className="text-primary">مسیر {userName}.</span></h2>
          <p className="text-muted text-xl max-w-2xl mx-auto md:text-center leading-relaxed">
            گزارش نهایی هوش مصنوعی بر اساس {userMajor} و رزومه اختصاصی شما.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-black mb-8 px-4 text-foreground">تحلیل برترین گزینه‌ها</h3>
            {isLoading ? (
              <div className="py-20 text-center glass rounded-card border-white/5"><Loader2 className="animate-spin mx-auto text-primary" /></div>
            ) : (
              decisionReport?.topMatches.map((match: any) => (
                <PremiumCard key={match.university.id} className="p-8 border-primary/10 hover:border-primary/30 cursor-default">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-1 text-green-500 font-bold text-xs">
                      <Zap className="w-3 h-3 fill-current" /> {match.admission.score}% شانس
                    </div>
                    <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">Score {match.admission.score}</span>
                  </div>
                  <h4 className="text-xl font-black mb-4 text-foreground">{match.university.name || "University"}</h4>
                  <div className="space-y-4">
                     {(match.admission.reasons || []).slice(0, 2).map((r: string, i: number) => (
                       <p key={i} className="text-[10px] font-bold text-muted leading-relaxed">• {r}</p>
                     ))}
                  </div>
                </PremiumCard>
              ))
            )}
          </div>

          <div className="lg:col-span-8 space-y-10">
            {decisionReport?.topMatches[0] && (
              <PremiumCard className="p-12">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-2xl font-black flex items-center gap-3 text-foreground">
                    <ArrowRightLeft className="text-primary" /> تحلیل استراتژیک تضادها
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-right">
                  <InsightBox 
                    title={decisionReport.topMatches[0].university.name} 
                    pros={decisionReport.topMatches[0].admission.strengths} 
                    cons={decisionReport.topMatches[0].admission.weaknesses} 
                  />
                  {decisionReport.topMatches[1] && (
                    <InsightBox 
                      title={decisionReport.topMatches[1].university.name} 
                      pros={decisionReport.topMatches[1].admission.strengths} 
                      cons={decisionReport.topMatches[1].admission.weaknesses} 
                    />
                  )}
                </div>

                <div className="mt-16 p-10 bg-primary/5 border border-primary/10 rounded-card relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><Zap className="w-24 h-24" /></div>
                  <div className="text-right relative z-10">
                    <h4 className="text-xl font-black mb-4 flex items-center justify-end gap-2 text-foreground">
                       پیشنهاد نهایی موتور هوشمند <CheckCircle2 className="w-5 h-5 text-primary" />
                    </h4>
                    <p className="text-sm text-muted leading-relaxed max-w-xl ml-auto">
                      {decisionReport.topMatches[0].admission.reasons[0]} بر اساس تحلیل بودجه سالیانه شما، این دانشگاه بازگشت سرمایه (ROI) سریع‌تری خواهد داشت.
                    </p>
                  </div>
                </div>
              </PremiumCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PremiumCard className="p-8 border-primary/20 bg-primary/5">
                <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center"><ArrowRight className="w-5 h-5 rotate-180" /></div>
                    <h4 className="text-xl font-black text-foreground">{"بهبود نمره زبان"}</h4>
                    <p className="text-[10px] text-muted font-bold leading-relaxed">این گام شانس پذیرش نهایی شما را تا ۲۰٪ افزایش می‌دهد.</p>
                    <MagneticButton className="w-full py-4 text-sm font-black shadow-lg">اجرای پیشنهاد</MagneticButton>
                </div>
              </PremiumCard>

              <PremiumCard className="p-8">
                 <div className="space-y-4">
                    <div className="text-xs font-black uppercase text-muted tracking-widest">Confidence Score</div>
                    <div className="text-5xl font-black text-primary tracking-tighter">{decisionReport?.confidenceScore || 0}%</div>
                    <p className="text-[9px] text-muted leading-relaxed text-right">تحلیل بر اساس ۱۲,۰۰۰ پرونده مشابه با ۹۸٪ دقت آماری.</p>
                 </div>
              </PremiumCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
