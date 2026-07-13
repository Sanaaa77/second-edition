"use client";
import React from "react";
import { 
  MapPin, 
  Star, 
  Building2, 
  Users, 
  Trophy, 
  Globe, 
  CheckCircle2,
  Calendar,
  Wallet,
  ArrowRight,
  ChevronRight,
  Info,
  ShieldCheck
} from "lucide-react";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { cn } from "@/lib/utils";

import { University, Faculty, Campus, FAQ, CareerOutcome } from "@/types/database";

interface UniversityDetailProps {
  university: University;
}

export const UniversityDetail: React.FC<UniversityDetailProps> = ({ university }) => {
  return (
    <div className="bg-[#020617] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
        <div className="absolute inset-0 z-10 bg-black/40" />
        <img 
          src={university?.hero_image_url || "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=1200&q=80"} 
          className="h-full w-full object-cover"
          alt="University Background"
        />
        
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-end">
            <div className="w-40 h-40 rounded-3xl glass p-4 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
               <img src={university?.logo_url ?? undefined} className="w-full h-full object-contain" alt="Logo" />
            </div>
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap gap-3">
                 <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest">TOP RANKED</span>
                 <span className="px-4 py-1.5 glass text-white text-[10px] font-black rounded-full uppercase tracking-widest">STATE UNIVERSITY</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter">
                {university?.name || "KOC University"}
              </h1>
              <div className="flex items-center gap-6 text-white/80 font-bold">
                 <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> {university?.city?.name || "Istanbul"}</span>
                 <span className="flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" /> Global Rank: #{university?.ranking_global || 450}</span>
                 <span className="flex items-center gap-2 text-green-400"><ShieldCheck className="w-5 h-5" /> Verified by TurkeyHub</span>
              </div>
            </div>
            <div className="pb-4">
              <MagneticButton className="px-12 py-6 text-lg font-black shadow-2xl shadow-primary/40">درخواست پذیرش فوری</MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Quick Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
           {[
             { label: "دانشجویان بین‌المللی", value: "۴,۵۰۰+", icon: Users },
             { label: "نرخ اشتغال فارغ‌التحصیلان", value: "۹۴٪", icon: TrendingUp },
             { label: "تعداد دانشکده‌ها", value: "۱۲", icon: Building2 },
             { label: "برنامه‌های تبادل", value: "۲۸۰+", icon: Globe },
           ].map((stat, i) => (
             <PremiumCard key={i} className="p-8 text-center group">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform">
                   <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-foreground mb-2">{stat.value}</div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</div>
             </PremiumCard>
           ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Content */}
          <div className="lg:col-span-8 space-y-16">
            <div className="space-y-8">
               <h2 className="text-3xl font-black text-foreground flex items-center gap-4">
                 <Info className="text-primary" /> درباره دانشگاه
               </h2>
               <p className="text-muted-foreground text-lg leading-relaxed text-right">
                  {university?.description || "دانشگاه کچ یکی از معتبرترین دانشگاه‌های خصوصی در ترکیه است که در شهر استانبول واقع شده است. این دانشگاه با تمرکز بر آموزش‌های تحقیقاتی و استانداردهای بین‌المللی، فضایی منحصربه‌فرد برای رشد علمی دانشجویان فراهم می‌کند."}
               </p>
            </div>

            <div className="space-y-8">
               <h2 className="text-3xl font-black text-foreground">دانشکده‌ها و رشته‌ها</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {university?.faculties?.map((f: any) => (
                    <div key={f.id} className="p-6 glass border-white/5 rounded-2xl flex justify-between items-center group cursor-pointer hover:border-primary/40 transition-colors">
                       <span className="font-bold text-foreground">{f.name}</span>
                       <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-8">
               <h2 className="text-3xl font-black text-foreground">زندگی در پردیس</h2>
               <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square rounded-3xl overflow-hidden glass border-white/5 p-2">
                       <img 
                        src={`https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80&idx=${i}`} 
                        className="w-full h-full object-cover rounded-2xl"
                        alt="Campus"
                       />
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Column: Admission Card */}
          <div className="lg:col-span-4 space-y-8">
            <PremiumCard className="p-8 border-primary/20 sticky top-10">
               <h3 className="text-2xl font-black mb-8 text-foreground">خلاصه پذیرش</h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-center pb-6 border-b border-white/5">
                     <span className="text-muted-foreground text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /> آخرین مهلت اپلای</span>
                     <span className="text-foreground font-black">۱۵ سپتامبر ۲۰۲۶</span>
                  </div>
                  <div className="flex justify-between items-center pb-6 border-b border-white/5">
                     <span className="text-muted-foreground text-sm flex items-center gap-2"><Wallet className="w-4 h-4" /> شهریه (متوسط)</span>
                     <span className="text-foreground font-black">{university.tuition_fee ? `$${university.tuition_fee} / سال` : 'استعلام شهریه'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-6 border-b border-white/5">
                     <span className="text-muted-foreground text-sm flex items-center gap-2"><Star className="w-4 h-4" /> حداقل معدل مورد نیاز</span>
                     <span className="text-foreground font-black">{university.admission_requirements?.gpa || "۱۴ / ۲۰"}</span>
                  </div>
                  {university.admission_requirements?.ielts && (
                    <div className="flex justify-between items-center pb-6 border-b border-white/5">
                       <span className="text-muted-foreground text-sm flex items-center gap-2"><Globe className="w-4 h-4" /> نمره آیلتس مورد نیاز</span>
                       <span className="text-foreground font-black">{university.admission_requirements.ielts}</span>
                    </div>
                  )}

                  <div className="p-6 bg-primary/10 rounded-2xl space-y-4">
                     <div className="text-[10px] font-black text-primary uppercase tracking-widest">TurkeyHub AI Advisor</div>
                     <p className="text-xs text-muted-foreground leading-relaxed">
                        بر اساس تحلیل هوشمند، این دانشگاه با رزومه شما مطابقت دارد. همین حالا مدارک خود را برای بررسی نهایی آپلود کنید.
                     </p>
                  </div>

                  <MagneticButton className="w-full py-5 text-sm font-black uppercase">همین حالا اپلای کنید</MagneticButton>
                  <button className="w-full py-5 glass border-white/10 text-xs font-black text-foreground rounded-2xl hover:bg-white/5 transition-colors">دریافت مشاوره رایگان</button>
               </div>
            </PremiumCard>
          </div>
        </div>
      </section>
    </div>
  );
};

const TrendingUp: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
