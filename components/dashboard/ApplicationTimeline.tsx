"use client";
import React from "react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";
import { ApplicationStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const STAGES: { status: ApplicationStatus; label: string; desc: string }[] = [
  { status: 'Draft', label: 'انتخاب اولیه', desc: 'انتخاب رشته و دانشگاه مقصد' },
  { status: 'Preparing', label: 'آماده‌سازی مدارک', desc: 'جمع‌آوری و ترجمه اسناد تحصیلی' },
  { status: 'Submitted', label: 'ارسال اپلیکیشن', desc: 'ثبت نهایی در پورتال دانشگاه' },
  { status: 'Review', label: 'بررسی دانشگاه', desc: 'ارزیابی توسط هیئت علمی' },
  { status: 'Accepted', label: 'پذیرش نهایی', desc: 'دریافت نامه پذیرش قطعی' },
  { status: 'Visa', label: 'ویزای تحصیلی', desc: 'اقدام جهت خروج و اقامت ترکیه' },
  { status: 'Completed', label: 'ثبت‌نام حضوری', desc: 'شروع کلاس‌ها در ترکیه' },
];

export const ApplicationTimeline = ({ currentStatus }: { currentStatus: ApplicationStatus }) => {
  const currentIndex = STAGES.findIndex(s => s.status === currentStatus);

  return (
    <div className="space-y-8">
      <div className="text-right px-2">
        <h3 className="text-xl font-black text-foreground tracking-tighter">وضعیت اپلیکیشن شما</h3>
        <p className="text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Lifecycle Tracking</p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-0 right-5 w-px h-full bg-white/5" />

        <div className="space-y-12 relative">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex || currentStatus === 'Completed';
            const isActive = stage.status === currentStatus;
            const isPending = idx > currentIndex && currentStatus !== 'Completed';

            return (
              <div key={stage.status} className="flex gap-8 group">
                <div className={cn(
                  "w-10 h-10 rounded-full border-4 border-[#030712] shrink-0 z-10 flex items-center justify-center transition-all duration-500",
                  isCompleted ? "bg-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]" : 
                  isActive ? "bg-accent animate-pulse" : "bg-white/5 opacity-20"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5 opacity-20" />}
                </div>

                <div className="flex-1 text-right pt-1">
                  <h4 className={cn(
                    "text-lg font-black transition-colors",
                    isPending ? "opacity-30" : "text-foreground",
                    isActive && "text-accent"
                  )}>
                    {stage.label}
                  </h4>
                  <p className="text-xs text-muted font-bold leading-relaxed">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
