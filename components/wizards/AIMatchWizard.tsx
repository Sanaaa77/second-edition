"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { 
  GraduationCap, 
  BadgeDollarSign, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  Target
} from "lucide-react";

const steps = [
  { id: "degree", label: "مقطع تحصیلی", icon: <GraduationCap />, options: ["Bachelor", "Master", "PhD"] },
  { id: "budget", label: "بودجه سالانه", icon: <BadgeDollarSign />, options: ["$3,000", "$8,000", "$15k+"] },
  { id: "city", label: "محیط زندگی", icon: <Target />, options: ["Metropolis", "Academic", "Coastal"] },
];

export const AIMatchWizard = () => {
  const [step, setStep] = useState(0);
  const [isMatching, setIsMatching] = useState(false);

  const handleSelect = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsMatching(true);
      setTimeout(() => setIsMatching(false), 2500); 
      setStep(step + 1);
    }
  };

  return (
    <div className="w-full relative">
      <PremiumCard className="p-8 md:p-12 min-h-[500px] flex flex-col justify-center relative overflow-hidden bg-[#0f172a]/50">
        <AnimatePresence mode="wait">
          {step < steps.length ? (
            <motion.div key="step" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex items-center gap-4 mb-10 text-right">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">{steps[step].icon}</div>
                <h3 className="text-2xl font-black">{steps[step].label}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {steps[step].options.map((opt) => (
                  <button key={opt} onClick={handleSelect} className="p-6 rounded-2xl border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-right font-bold opacity-60 hover:opacity-100">{opt}</button>
                ))}
              </div>
            </motion.div>
          ) : isMatching ? (
            <motion.div key="matching" className="text-center py-20 space-y-8">
              <Sparkles className="w-20 h-20 text-primary animate-pulse mx-auto" />
              <h3 className="text-2xl font-black">تحلیل رزومه...</h3>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-right">
              <h3 className="text-3xl font-black text-primary">پذیرش هوشمند</h3>
              <p className="opacity-40 font-bold mb-10">این ۳ گزینه بر اساس پروفایل شما پیشنهاد می‌شوند:</p>
              {[1,2,3].map(i => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                   <ChevronRight className="w-4 h-4 rotate-180 opacity-20" />
                   <span className="font-bold">دانشگاه برتر شماره {i}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </PremiumCard>
    </div>
  );
};
