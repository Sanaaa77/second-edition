"use client";
import React from "react";
import { motion } from "framer-motion";
import { JOURNEY_STEPS } from "@/data/userJourney";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { useJourney } from "@/hooks/useJourney";

export const JourneyLivingMap = () => {
  const { currentStep } = useJourney();

  return (
    <section className="py-section px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-foreground text-right md:text-center">نقشه زنده <br /><span className="text-primary">مسیر شما.</span></h2>
          <p className="text-muted text-xl max-w-2xl mx-auto text-right md:text-center leading-relaxed">این یک رودمپ معمولی نیست؛ این نقشه واقعی زندگی شماست.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {JOURNEY_STEPS.map((step, i) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            const Icon = (Icons as any)[step.icon] || Icons.HelpCircle;

            return (
              <motion.div 
                key={step.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }}
              >
                <PremiumCard className={cn(
                  "p-8 text-center h-full border-white/5",
                  isActive ? "border-primary/50 shadow-2xl scale-105 bg-primary/5" : "opacity-30"
                )}>
                  <div className={cn(
                    "w-12 h-12 rounded-xl mx-auto mb-6 flex items-center justify-center", 
                    isActive ? "bg-primary text-white" : "bg-white/5 text-muted"
                  )}>
                    {isCompleted ? <Icons.Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <h4 className="font-bold text-lg mb-1 text-foreground">{step.label}</h4>
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{step.duration}</p>
                </PremiumCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
