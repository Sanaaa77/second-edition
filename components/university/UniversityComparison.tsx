"use client";
import React from "react";
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  MapPin, 
  Wallet,
  GraduationCap
} from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { cn } from "@/lib/utils";

import { University } from "@/types/database";

interface UniversityComparisonProps {
  uniA: University;
  uniB: University;
}

export const UniversityComparison: React.FC<UniversityComparisonProps> = ({ uniA, uniB }) => {
  const ComparisonRow: React.FC<{ label: string; valA: string | number | undefined; valB: string | number | undefined; icon: React.ElementType }> = ({ label, valA, valB, icon: Icon }) => (
    <div className="grid grid-cols-12 gap-4 py-8 border-b border-white/5 items-center group">
       <div className="col-span-4 text-center">
          <div className="text-xl font-black text-foreground">{valA}</div>
       </div>
       <div className="col-span-4 text-center">
          <div className="flex flex-col items-center gap-2">
             <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                <Icon className="w-5 h-5" />
             </div>
             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
          </div>
       </div>
       <div className="col-span-4 text-center">
          <div className="text-xl font-black text-foreground">{valB}</div>
       </div>
    </div>
  );

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
           <h2 className="text-4xl font-black text-foreground flex items-center justify-center gap-4">
              <ArrowRightLeft className="text-primary w-8 h-8" /> مقایسه تخصصی
           </h2>
           <p className="text-muted-foreground">تحلیل تفاوت‌های کلیدی بین گزینه‌های برتر شما.</p>
        </div>

        <PremiumCard className="p-0 overflow-hidden">
           {/* Header */}
           <div className="grid grid-cols-12 bg-white/5 border-b border-white/10 p-12 gap-8 items-center">
              <div className="col-span-4 text-center space-y-4">
                 <div className="w-24 h-24 glass rounded-2xl mx-auto p-4"><img src={uniA?.logo_url ?? undefined} alt="A" /></div>
                 <h3 className="text-xl font-black text-foreground">{uniA?.name}</h3>
              </div>
              <div className="col-span-4 text-center">
                 <div className="text-5xl font-black text-primary/20 tracking-tighter italic uppercase">VS</div>
              </div>
              <div className="col-span-4 text-center space-y-4">
                 <div className="w-24 h-24 glass rounded-2xl mx-auto p-4"><img src={uniB?.logo_url ?? undefined} alt="B" /></div>
                 <h3 className="text-xl font-black text-foreground">{uniB?.name}</h3>
              </div>
           </div>

           {/* Content Rows */}
           <div className="p-12">
              <ComparisonRow label="Global Ranking" valA={`#${uniA?.ranking_global}`} valB={`#${uniB?.ranking_global}`} icon={Trophy} />
              <ComparisonRow label="Annual Tuition" valA={`$${uniA?.tuition_fee}`} valB={`$${uniB?.tuition_fee}`} icon={Wallet} />
              <ComparisonRow label="City" valA={uniA?.city?.name} valB={uniB?.city?.name} icon={MapPin} />
              <ComparisonRow label="Degree Levels" valA="BS, MS, PhD" valB="BS, MS" icon={GraduationCap} />
              
              <div className="grid grid-cols-12 gap-4 py-8 items-center">
                 <div className="col-span-4 flex flex-col items-center gap-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                       {['Dormitory', 'Scholarship', 'English'].map(f => (
                         <span key={f} className="px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {f}</span>
                       ))}
                    </div>
                 </div>
                 <div className="col-span-4 text-center">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Key Features</span>
                 </div>
                 <div className="col-span-4 flex flex-col items-center gap-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                       {['Dormitory', 'English'].map(f => (
                         <span key={f} className="px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {f}</span>
                       ))}
                       <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[9px] font-black rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Scholarship</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* AI Conclusion */}
           <div className="bg-primary/5 p-12 border-t border-white/5 text-center">
              <h4 className="text-primary font-black text-sm uppercase tracking-widest mb-4">TurkeyHub AI Insight</h4>
              <p className="max-w-2xl mx-auto text-muted-foreground text-sm leading-relaxed">
                 اگر به دنبال رتبه بالاتر و فرصت‌های تحقیقاتی هستید، <b>{uniA?.name}</b> انتخاب بهتری است. اما با توجه به بودجه اعلامی شما، <b>{uniB?.name}</b> ارزش سرمایه‌گذاری (ROI) بالاتری در کوتاه‌مدت خواهد داشت.
              </p>
           </div>
        </PremiumCard>
      </div>
    </section>
  );
};
