"use client";
import React, { useMemo } from "react";
import { PremiumCard, AnimatedCounter } from "@/components/ui/PremiumComponents";
import { useJourney } from "@/hooks/useJourney";
import { Target, Zap, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const ExecutiveDashboard = () => {
  const { progress, currentStep, tasks } = useJourney();

  const stats = useMemo(() => {
    const completedDocs = 8; // In prod: count verified documents
    const totalDocs = 10;
    return {
      readiness: Math.round(progress),
      step: currentStep,
      daysToDeadline: 45,
      docProgress: `${completedDocs}/${totalDocs}`
    };
  }, [progress, currentStep]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto">
      <StatCard label="آمادگی کل" value={stats.readiness + "%"} icon={<Target className="text-primary" />} color="text-primary" />
      <StatCard label="گام فعلی" value={stats.step.toString()} icon={<Zap className="text-accent" />} color="text-accent" />
      <StatCard label="روز تا ددلاین" value={stats.daysToDeadline.toString()} icon={<Clock className="text-blue-500" />} color="text-blue-500" />
      <StatCard label="مدارک تایید شده" value={stats.docProgress} icon={<ShieldCheck className="text-green-500" />} color="text-green-500" />
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ label, value, icon, color }: StatCardProps) => (
  <PremiumCard className="p-8 group hover:border-primary/30 transition-all">
    <div className="flex items-center justify-between mb-6">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <ArrowUpRight className="w-5 h-5 opacity-10 group-hover:opacity-60 transition-opacity" />
    </div>
    <div className={cn("text-4xl font-black tracking-tighter", color)}>{value}</div>
    <div className="text-[10px] font-black uppercase text-muted tracking-widest mt-2">{label}</div>
  </PremiumCard>
);
