"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Clock, 
  Trophy, 
  TrendingUp, 
  AlertCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Award,
  MessageSquare
} from "lucide-react";
import { PremiumCard, MagneticButton, AnimatedCounter } from "@/components/ui/PremiumComponents";
import { useJourney } from "@/hooks/useJourney";
import { cn } from "@/lib/utils";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { DocumentCenter } from "./DocumentCenter";
import { TaskManager } from "./TaskManager";

const MissionCard = ({ title, xp, status }: any) => (
  <div className="p-4 rounded-xl glass border-white/5 flex justify-between items-center group cursor-pointer hover:border-primary/30 transition-all">
    <div className="flex items-center gap-3">
       <div className={cn("w-2 h-2 rounded-full", status === 'completed' ? "bg-green-500" : "bg-primary animate-pulse")} />
       <span className="text-xs font-black text-foreground">{title}</span>
    </div>
    <span className="text-[10px] font-black text-primary">{xp} XP</span>
  </div>
);

export const ExecutiveDashboard = ({ apps = [] }: { apps?: any[] }) => {
  const { user, decisionReport, progress, tasks } = useJourney();
  const currentApp = apps[0];
  const userName = (user as any).first_name || (user as any).name || "دانشجو";

  return (
    <div className="space-y-10 py-10">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2 text-right md:text-left">
           <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
             سلام، {userName} عزیز.
           </h2>
           <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
             READY TO CONTINUE YOUR JOURNEY? <ShieldCheck className="inline w-3 h-3 text-primary" />
           </p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 glass rounded-2xl flex items-center gap-3 border-primary/20">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <div className="text-right">
                 <div className="text-xs font-black text-muted-foreground uppercase">Current Level</div>
                 <div className="text-xl font-black text-foreground">Explorer II</div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Stats Panel */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <PremiumCard className="p-8 space-y-4 border-primary/10">
                <div className="flex justify-between items-start">
                   <Target className="w-6 h-6 text-primary" />
                   <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-3xl font-black text-foreground"><AnimatedCounter value={decisionReport?.overallReadiness || 0} />%</div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Admission Readiness</div>
             </PremiumCard>

             <PremiumCard className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                   <Zap className="w-6 h-6 text-yellow-500" />
                   <span className="text-[10px] font-black text-primary">+12%</span>
                </div>
                <div className="text-3xl font-black text-foreground">2,850</div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total XP</div>
             </PremiumCard>

             <PremiumCard className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                   <Clock className="w-6 h-6 text-blue-500" />
                   <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-3xl font-black text-foreground">12 Days</div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Study Streak</div>
             </PremiumCard>
          </div>

          <PremiumCard className="p-10 border-primary/20 bg-primary/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5"><Target className="w-32 h-32" /></div>
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="text-right space-y-4 flex-1">
                   <h3 className="text-2xl font-black text-foreground">اقدام اولویت‌دار بعدی</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     بر اساس تحلیل هوشمند پروفایل شما، تکمیل «نامه انگیزشی» می‌تواند شانس پذیرش شما را برای دانشگاه‌های برتر تا ۱۵٪ افزایش دهد.
                   </p>
                   <MagneticButton className="px-10 py-4 text-xs font-black shadow-lg">شروع نگارش SOP</MagneticButton>
                </div>
                <div className="w-full md:w-1/3 space-y-4">
                   <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-4">Recommended Content</span>
                   <div className="p-4 rounded-xl glass border-white/5 flex items-center gap-4 hover:bg-white/5 cursor-pointer transition-colors">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="text-[11px] font-bold">راهنمای نگارش SOP حرفه‌ای</span>
                   </div>
                </div>
             </div>
          </PremiumCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <DocumentCenter />
             <TaskManager />
          </div>
          
          <div className="space-y-6">
             <h4 className="text-xl font-black text-foreground">مسیر اپلیکیشن شما</h4>
             <PremiumCard className="p-10">
                <ApplicationTimeline currentStatus={currentApp?.status || 'Draft'} />
             </PremiumCard>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="lg:col-span-4 space-y-8">
           <PremiumCard className="p-8">
              <h4 className="text-xl font-black mb-8 flex items-center gap-2 text-foreground">
                <Zap className="text-yellow-500 w-5 h-5" /> ماموریت‌های امروز
              </h4>
              <div className="space-y-4">
                 <MissionCard title="مشاهده درس لیسنینگ آیلتس" xp="+50" status="pending" />
                 <MissionCard title="تکمیل پروفایل تحصیلی" xp="+100" status="completed" />
                 <MissionCard title="رزرو وقت مشاوره اولیه" xp="+30" status="pending" />
              </div>
           </PremiumCard>

           <PremiumCard className="p-10 bg-primary border-transparent text-white overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Award className="w-32 h-32" />
              </div>
              <div className="relative z-10 text-right">
                  <h3 className="text-2xl font-black mb-4">پاداش بورسیه!</h3>
                  <p className="text-sm font-bold opacity-80 leading-relaxed mb-10">
                    با توجه به پیشرفت شما، واجد شرایط دریافت بورسیه ۷۵٪ سابانجی هستید.
                  </p>
                  <button className="bg-white text-primary px-8 py-3 rounded-xl font-black text-sm">بررسی شرایط</button>
              </div>
           </PremiumCard>

           <PremiumCard className="p-8 border-primary/20">
              <h4 className="text-xl font-black mb-6 text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> پیام‌های مشاور
              </h4>
              <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl text-right">
                     <p className="text-sm font-bold text-foreground">علیرضا محمدی:</p>
                     <p className="text-xs text-muted mt-1 leading-relaxed italic">"اسکن پاسپورت شما تایید شد. لطفاً نمره آیلتس خود را بارگذاری کنید."</p>
                  </div>
              </div>
              <MagneticButton className="w-full mt-6 py-4 text-xs font-black" variant="glass">ارسال پیام</MagneticButton>
           </PremiumCard>

           <PremiumCard className="p-8">
              <div className="flex justify-between items-center mb-8">
                 <h4 className="text-lg font-black text-foreground tracking-tight">مدارک ناقص</h4>
                 <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <div className="space-y-4">
                 {[
                   { label: "ریزنمرات رسمی", color: "text-red-400" },
                   { label: "ترجمه پاسپورت", color: "text-yellow-400" },
                 ].map((doc, i) => (
                   <div key={i} className="flex justify-between items-center text-xs font-bold">
                      <span className="text-muted-foreground">{doc.label}</span>
                      <ArrowRight className="w-3 h-3 rotate-180 text-primary" />
                   </div>
                 ))}
              </div>
           </PremiumCard>
        </div>
      </div>
    </div>
  );
};
