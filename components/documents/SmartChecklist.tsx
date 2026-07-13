"use client";
import React from "react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { CheckCircle2, Circle } from "lucide-react";
import { useJourney } from "@/hooks/useJourney";

export const SmartChecklist = () => {
  const { user, tasks } = useJourney();
  const completedCount = tasks.filter(t => t.status === "completed").length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const userName = (user as any).first_name || (user as any).name || "دانشجو";

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6">
        <div className="flex items-center justify-between mb-12">
          <div className="text-right">
            <h3 className="text-3xl font-black mb-2 tracking-tight">سلام، {userName} 👋</h3>
            <p className="opacity-40 font-bold uppercase tracking-widest text-[10px]">{tasks.length - completedCount} گام تا پایان مدارک</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-primary mb-1">{Math.round(progress)}%</div>
          </div>
        </div>

        <div className="w-full h-2 bg-white/5 rounded-full mb-12 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-primary shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
        </div>

        <div className="space-y-4">
          {tasks.map((task, i) => (
            <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <PremiumCard className={cn("p-6 flex items-center justify-between", task.status === "locked" && "opacity-30 pointer-events-none")}>
                <div className="flex items-center gap-6">
                  {task.status === "completed" ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6 opacity-20" />}
                  <h4 className={cn("font-bold text-lg", task.status === "completed" && "line-through opacity-40")}>{task.label}</h4>
                </div>
                {task.status === "pending" && <span className="text-[10px] font-black text-primary uppercase">باقی‌مانده</span>}
              </PremiumCard>
            </motion.div>
          ))}
        </div>
    </div>
  );
};

function cn(...classes: any) { return classes.filter(Boolean).join(" "); }
