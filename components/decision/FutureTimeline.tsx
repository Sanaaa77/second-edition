"use client";
import React from "react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { 
  Calendar, 
  Flag, 
  MapPin, 
  GraduationCap, 
  Briefcase,
  Clock
} from "lucide-react";

const MILESTONES = [
  { label: "ارسال اپلیکیشن", date: "تیر ۱۴۰۵", icon: <Flag />, status: "done" },
  { label: "دریافت پذیرش", date: "مرداد ۱۴۰۵", icon: <GraduationCap />, status: "active" },
  { label: "ویزای تحصیلی", date: "شهریور ۱۴۰۵", icon: <Calendar />, status: "todo" },
  { label: "ورود به ترکیه", date: "مهر ۱۴۰۵", icon: <MapPin />, status: "todo" },
  { label: "شروع اولین شغل", date: "۱۴۰۹", icon: <Briefcase />, status: "todo" },
];

export const FutureTimeline = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-right mb-16">
          <h3 className="text-3xl font-black mb-4">خط زمانی آینده شما (تخمینی)</h3>
          <p className="opacity-40 text-sm">این پیش‌بینی بر اساس میانگین زمان‌بندی دانشگاه‌های ترکیه و فرآیند سفارت انجام شده است.</p>
        </div>
        
        <div className="relative flex flex-col md:flex-row justify-between gap-8">
           <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 hidden md:block" />
           {MILESTONES.map((m, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="relative z-10 flex-1"
             >
                <PremiumCard className={cn(
                  "p-6 text-center border-white/5",
                  m.status === 'active' && "border-primary/50 bg-primary/5 shadow-2xl"
                )}>
                  <div className={cn(
                    "w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center",
                    m.status === 'done' ? "bg-green-500/10 text-green-500" : 
                    m.status === 'active' ? "bg-primary text-white" : "bg-white/5 opacity-20"
                  )}>
                    {m.icon}
                  </div>
                  <h4 className="font-bold text-sm mb-1">{m.label}</h4>
                  <div className="text-[10px] font-black opacity-30 uppercase">{m.date}</div>
                </PremiumCard>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

const cn = (...classes: any) => classes.filter(Boolean).join(" ");
