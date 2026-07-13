"use client";
import React, { useState } from "react";
import { 
  Wallet, 
  Target, 
  TrendingUp, 
  Calculator, 
  Clock, 
  Zap, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { cn } from "@/lib/utils";

export const InteractiveTools = () => {
  const [activeTab, setActiveCategory] = useState("Financial");

  const categories = [
    { id: "Financial", icon: Wallet, label: "محاسبات مالی" },
    { id: "Admission", icon: Target, label: "تخمین پذیرش" },
    { id: "Academic", icon: TrendingUp, label: "برنامه‌ریزی تحصیلی" },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full border-white/5">
              <Calculator className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black tracking-widest uppercase">Smart Utilities v1.0</span>
           </div>
           <h2 className="text-5xl font-black tracking-tighter text-foreground">
             ابزارهای هوشمند <br /><span className="text-primary">تصمیم‌گیری.</span>
           </h2>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
             با استفاده از داده‌های واقعی، هزینه‌ها و شانس پذیرش خود را دقیقاً محاسبه کنید.
           </p>
        </div>

        <div className="flex justify-center gap-4">
           {categories.map((cat) => (
             <button
               key={cat.id}
               onClick={() => setActiveCategory(cat.id)}
               className={cn(
                 "flex items-center gap-3 px-8 py-4 rounded-xl font-black transition-all",
                 activeTab === cat.id ? "bg-primary text-white" : "glass border-white/5 text-muted-foreground hover:bg-white/5"
               )}
             >
                <cat.icon className="w-4 h-4" /> {cat.label}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {activeTab === "Financial" && (
             <>
               <ToolCard 
                 title="محاسبه‌گر هزینه زندگی" 
                 desc="تخمین دقیق هزینه‌های ماهانه در شهرهای مختلف ترکیه بر اساس سبک زندگی شما." 
                 icon={Wallet} 
               />
               <ToolCard 
                 title="تخمین بودجه کل تحصیل" 
                 desc="محاسبه مجموع هزینه‌های شهریه و زندگی برای کل دوره تحصیلی." 
                 icon={Zap} 
               />
               <ToolCard 
                 title="برآورد هزینه‌های ویزا" 
                 desc="محاسبه هزینه‌های دولتی، بیمه و ترجمه مدارک برای فرآیند ویزا." 
                 icon={ShieldCheck} 
               />
             </>
           )}

           {activeTab === "Admission" && (
             <>
               <ToolCard 
                 title="شانس‌سنج پذیرش" 
                 desc="تخمین احتمال قبولی در دانشگاه‌های هدف بر اساس رزومه فعلی شما." 
                 icon={Target} 
               />
               <ToolCard 
                 title="شبیه‌ساز بورسیه" 
                 desc="بررسی احتمال دریافت بورسیه‌های دولتی و خصوصی ترکیه." 
                 icon={Zap} 
               />
             </>
           )}
        </div>
      </div>
    </section>
  );
};

const ToolCard = ({ title, desc, icon: Icon }: any) => (
  <PremiumCard className="p-8 group hover:border-primary/40 transition-colors cursor-pointer flex flex-col justify-between">
    <div className="space-y-6">
       <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6" />
       </div>
       <h3 className="text-xl font-black text-foreground">{title}</h3>
       <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
    <div className="mt-10 flex justify-end">
       <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 rotate-180" />
    </div>
  </PremiumCard>
);
