"use client";
import React from "react";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  ClipboardList, 
  TrendingUp,
  Clock,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  Sparkles,
  Zap,
  AlertCircle
} from "lucide-react";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { cn } from "@/lib/utils";

const MetricCard = ({ label, value, trend, icon: Icon }: any) => (
  <PremiumCard className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-primary/10 rounded-lg text-primary"><Icon className="w-5 h-5" /></div>
      <span className={cn("text-xs font-bold", trend.startsWith('+') ? "text-green-500" : "text-red-500")}>
        {trend}
      </span>
    </div>
    <div className="space-y-1">
      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</span>
      <h4 className="text-3xl font-black text-foreground tracking-tighter">{value}</h4>
    </div>
  </PremiumCard>
);

export const AdvisorDashboard = () => {
  return (
    <section className="py-20 px-6 bg-[#020617]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4 text-right md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full border-white/5">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black tracking-widest uppercase">Advisor CRM v1.0</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-foreground">
              داشبورد <br /><span className="text-primary">مدیریت دانشجویان.</span>
            </h2>
          </div>
          <div className="flex gap-4">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <input className="pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs focus:ring-1 focus:ring-primary outline-none min-w-[300px]" placeholder="جستجوی دانشجو، پرونده یا مدارک..." />
             </div>
             <MagneticButton className="px-6 py-3 text-xs font-black">گزارش جدید</MagneticButton>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <MetricCard label="Active Students" value="42" trend="+12%" icon={Users} />
           <MetricCard label="Meetings Today" value="8" trend="+2" icon={Calendar} />
           <MetricCard label="Pending Docs" value="15" trend="-4%" icon={ClipboardList} />
           <MetricCard label="Avg. Conversion" value="68%" trend="+5%" icon={TrendingUp} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main List: Assigned Students */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-black text-foreground">دانشجویان تخصیص یافته</h3>
               <div className="flex gap-2">
                 <button className="p-2 glass rounded-lg hover:bg-white/10"><Filter className="w-4 h-4" /></button>
                 <button className="p-2 glass rounded-lg hover:bg-white/10"><MoreVertical className="w-4 h-4" /></button>
               </div>
            </div>

            <div className="space-y-4">
              {[
                { name: "علی رضایی", program: "Computer Science (MS)", status: "Accepted", risk: "Low", avatar: "AR" },
                { name: "سارا کریمی", program: "Medicine (MD)", status: "Application Started", risk: "Medium", avatar: "SK" },
                { name: "محمد محمدی", program: "Architecture (BS)", status: "Enrolled", risk: "Low", avatar: "MM" },
                { name: "مریم علوی", program: "Economy (BS)", status: "Lead", risk: "High", avatar: "MA" },
              ].map((student, i) => (
                <PremiumCard key={i} className="p-6 flex items-center justify-between group hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center font-black text-primary text-sm">{student.avatar}</div>
                    <div>
                      <h4 className="font-black text-foreground group-hover:text-primary transition-colors">{student.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-wider">{student.program}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="hidden md:block text-right">
                       <span className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Status</span>
                       <span className={cn(
                         "text-[9px] font-black px-2 py-0.5 rounded-full border",
                         student.status === 'Accepted' ? "border-green-500/30 text-green-500 bg-green-500/5" : "border-white/10 text-muted-foreground"
                       )}>{student.status}</span>
                    </div>

                    <div className="hidden md:block text-right">
                       <span className="text-[10px] font-black uppercase text-muted-foreground block mb-1">AI Risk</span>
                       <div className="flex items-center gap-1.5 justify-end">
                          <div className={cn("w-1.5 h-1.5 rounded-full", student.risk === 'Low' ? "bg-green-500" : student.risk === 'Medium' ? "bg-yellow-500" : "bg-red-500")} />
                          <span className="text-[10px] font-black text-foreground">{student.risk}</span>
                       </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </PremiumCard>
              ))}
            </div>
            
            <button className="w-full py-4 glass border-dashed border-white/10 text-xs font-black text-muted-foreground hover:text-foreground transition-colors">نمایش همه دانشجویان</button>
          </div>

          {/* Sidebar: Activity & AI Assistant */}
          <div className="lg:col-span-4 space-y-8">
            <PremiumCard className="p-8 border-primary/20 bg-primary/5">
               <h4 className="text-xl font-black mb-8 flex items-center gap-2 text-foreground">
                 <Zap className="text-primary w-5 h-5" /> دستیار هوشمند مشاور
               </h4>
               <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-yellow-500">
                      <AlertCircle className="w-3 h-3" /> ریسک ویزا شناسایی شد
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      دانشجو <b>مریم علوی</b> در بخش مدارک مالی با نقص مواجه است. احتمال ریجکتی ویزا ۱۵٪ افزایش یافته است.
                    </p>
                    <MagneticButton className="w-full py-2 text-[9px] font-black">مشاهده و رفع نقص</MagneticButton>
                  </div>

                  <div className="space-y-4">
                     <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">توصیه‌های امروز</span>
                     {[
                       "پیگیری مدارک سارا کریمی",
                       "تایید رزومه علی رضایی",
                       "تماس با لید جدید (نیما)"
                     ].map((rec, i) => (
                       <div key={i} className="flex items-center gap-3 text-xs font-bold text-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {rec}
                       </div>
                     ))}
                  </div>
               </div>
            </PremiumCard>

            <PremiumCard className="p-8">
               <h4 className="text-xl font-black mb-8 flex items-center gap-2 text-foreground">
                 <Clock className="text-muted-foreground w-5 h-5" /> فعالیت‌های اخیر
               </h4>
               <div className="space-y-6 relative">
                 <div className="absolute top-0 bottom-0 left-[7px] w-px bg-white/5" />
                 {[
                   { user: "علی", action: "Resume Uploaded", time: "2h ago" },
                   { user: "سارا", action: "Meeting Booked", time: "4h ago" },
                   { user: "محمد", action: "Quiz Completed", time: "1d ago" },
                 ].map((act, i) => (
                   <div key={i} className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#0f172a] border-2 border-white/10" />
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-black text-foreground">{act.user} <span className="text-muted-foreground font-medium">{act.action}</span></span>
                        <span className="text-[9px] text-muted-foreground font-bold">{act.time}</span>
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
