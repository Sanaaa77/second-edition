"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { 
  BrainCircuit, 
  TrendingUp, 
  Target, 
  Zap,
  Sparkles,
  BarChart3
} from "lucide-react";

export const FuturePredictor = () => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startPrediction = () => {
    setIsPredicting(true);
    setResult(null);
    setTimeout(() => {
      setIsPredicting(false);
      setResult({
        acceptance: 92,
        scholarship: 65,
        visa: 98,
        salary: "۱,۵۰۰ - ۲,۲۰۰",
        confidence: 89
      });
    }, 3000);
  };

  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto glass p-12 md:p-24 rounded-[4rem] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black mb-6 border border-primary/20">
            <BrainCircuit className="w-4 h-4" /> AI PREDICTION ENGINE
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">آینده خود را اسکن کنید.</h2>
          <p className="opacity-50 text-xl max-w-xl mx-auto leading-relaxed">با استفاده از دیتای ۱۲,۰۰۰ پرونده موفق، شانس پذیرش و موفقیت شغلی شما را پیش‌بینی می‌کنیم.</p>
        </div>

        <div className="flex flex-col items-center">
          {!result && !isPredicting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MagneticButton 
                onClick={startPrediction}
                className="bg-primary text-white px-12 py-6 rounded-3xl font-black text-2xl shadow-2xl shadow-primary/30 flex items-center gap-4"
              >
                <span>شروع آنالیز هوشمند</span>
                <Sparkles className="w-6 h-6" />
              </MagneticButton>
            </motion.div>
          )}

          {isPredicting && (
            <div className="space-y-8 text-center py-10 w-full max-w-md">
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute top-0 w-1/2 h-full bg-primary"
                />
              </div>
              <p className="font-bold opacity-40 animate-pulse">در حال تحلیل متغیرهای آکادمیک و اقتصادی...</p>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-10"
              >
                <PredictionStat label="شانس پذیرش" value={`${result.acceptance}%`} icon={<Target />} />
                <PredictionStat label="شانس بورسیه" value={`${result.scholarship}%`} icon={<Zap />} />
                <PredictionStat label="موفقیت ویزا" value={`${result.visa}%`} icon={<TrendingUp />} />
                <PredictionStat label="حقوق تخمینی" value={`$${result.salary}`} icon={<BarChart3 />} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const PredictionStat = ({ label, value, icon }: any) => (
  <div className="p-6 glass rounded-3xl border border-white/5 text-center space-y-3">
    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary mx-auto">
      {icon}
    </div>
    <div className="text-2xl font-black">{value}</div>
    <div className="text-[10px] font-black uppercase tracking-widest opacity-30">{label}</div>
  </div>
);
