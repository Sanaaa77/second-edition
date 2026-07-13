"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Flame, 
  BookOpen, 
  Trophy, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from "lucide-react";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { cn } from "@/lib/utils";

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <PremiumCard className="p-6 relative overflow-hidden group">
    <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 transition-transform duration-500 group-hover:scale-125", color)}>
      <Icon className="w-full h-full" />
    </div>
    <div className="relative z-10 flex flex-col gap-1">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-3xl font-black tracking-tighter text-foreground">{value}</span>
    </div>
  </PremiumCard>
);

export const AcademyDashboard = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full border-white/5">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black tracking-widest uppercase">Language Academy v2</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-foreground">
              مرکز تخصصی <br /><span className="text-primary">یادگیری زبان.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
             <StatCard icon={Flame} label="Streak" value="12 Days" color="text-orange-500" />
             <StatCard icon={Zap} label="XP Earned" value="2,450" color="text-yellow-500" />
             <StatCard icon={BookOpen} label="Lessons" value="48" color="text-blue-500" />
             <StatCard icon={Clock} label="Study Time" value="12.5h" color="text-green-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content: Active Course */}
          <div className="lg:col-span-8 space-y-8">
            <PremiumCard className="p-0 overflow-hidden border-primary/20 bg-primary/5">
              <div className="p-10 flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-2xl bg-black/40 flex items-center justify-center relative group">
                   <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <Zap className="w-12 h-12 text-primary animate-pulse" />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black px-3 py-1 bg-primary text-white rounded-full">B2 UPPER INTERMEDIATE</span>
                    <span className="text-[10px] font-black px-3 py-1 glass rounded-full">IELTS PREP</span>
                  </div>
                  <h3 className="text-3xl font-black text-foreground">Speaking Fluency Masterclass</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    در این دوره روی مهارت‌های مکالمه آکادمیک و تکنیک‌های نمره‌دهی آزمون آیلتس تمرکز می‌کنیم.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-muted-foreground">COURSE PROGRESS</span>
                      <span className="text-primary">65%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>

                  <MagneticButton className="w-full md:w-auto px-10 py-4 font-black shadow-xl">
                    ادامه یادگیری <ArrowRight className="mr-2 w-4 h-4 rotate-180" />
                  </MagneticButton>
                </div>
              </div>
            </PremiumCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PremiumCard className="p-8">
                <h4 className="text-xl font-black mb-6 flex items-center gap-2 text-foreground">
                  <Trophy className="text-yellow-500 w-5 h-5" /> دستاوردهای اخیر
                </h4>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-[100px] aspect-square rounded-2xl glass border-white/5 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-help" title="Unlocked on Lesson 10">
                       <Zap className="w-8 h-8 text-primary/50" />
                    </div>
                  ))}
                </div>
              </PremiumCard>

              <PremiumCard className="p-8">
                <h4 className="text-xl font-black mb-6 flex items-center gap-2 text-foreground">
                  <TrendingUp className="text-blue-500 w-5 h-5" /> تحلیل مهارت‌ها
                </h4>
                <div className="space-y-4">
                  {['Grammar', 'Vocabulary', 'Speaking', 'Listening'].map((skill) => (
                    <div key={skill} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                          <span>{skill}</span>
                          <span>{Math.floor(Math.random() * 40 + 60)}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary/40" style={{ width: `${Math.random() * 40 + 60}%` }} />
                       </div>
                    </div>
                  ))}
                </div>
              </PremiumCard>
            </div>
          </div>

          {/* Sidebar: AI Coach & Missions */}
          <div className="lg:col-span-4 space-y-8">
            <PremiumCard className="p-8 border-primary/30 bg-primary/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><MessageSquare className="w-20 h-20" /></div>
               <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white"><Sparkles className="w-5 h-5" /></div>
                   <h4 className="text-xl font-black text-foreground">AI Language Coach</h4>
                 </div>
                 <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-xs text-muted-foreground leading-relaxed italic">
                    "سلام! بر اساس عملکرد هفته گذشته، پیشنهاد می‌کنم امروز تمرکز بیشتری روی Writing داشته باشی."
                 </div>
                 <MagneticButton className="w-full py-3 text-xs font-black" variant="glass">
                   شروع گفت‌وگو با مربی
                 </MagneticButton>
               </div>
            </PremiumCard>

            <PremiumCard className="p-8">
               <h4 className="text-xl font-black mb-6 flex items-center gap-2 text-foreground">
                 <Zap className="text-yellow-500 w-5 h-5" /> ماموریت‌های روزانه
               </h4>
               <div className="space-y-4">
                 {[
                   { label: "Completion 2 Lessons", xp: "+50 XP", progress: 50 },
                   { label: "Learn 10 New Words", xp: "+30 XP", progress: 80 },
                   { label: "Practice Speaking", xp: "+40 XP", progress: 0 },
                 ].map((mission) => (
                   <div key={mission.label} className="p-4 rounded-xl glass border-white/5 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-foreground">{mission.label}</span>
                        <span className="text-[10px] font-black text-primary">{mission.xp}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${mission.progress}%` }} />
                      </div>
                   </div>
                 ))}
               </div>
            </PremiumCard>
          </div>
        </div>
      </div>
    </section>
  );
};
