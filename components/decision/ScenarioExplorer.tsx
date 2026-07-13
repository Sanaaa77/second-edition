"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { Sparkles, Brain, Lightbulb, MapPin, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioInsightProps {
  icon: React.ReactNode;
  text: string;
}

const ScenarioInsight = ({ icon, text }: ScenarioInsightProps) => (
  <div className="flex gap-4 items-start">
    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">{icon}</div>
    <p className="text-sm font-bold opacity-70 leading-relaxed text-right">{text}</p>
  </div>
);

export const ScenarioExplorer = () => {
  const [budget, setBudget] = useState(12000);
  const [city, setCity] = useState("Istanbul");
  const [isAnalyzing, setIsThinking] = useState(false);

  const handleScenarioChange = useCallback((newBudget: number) => {
    setBudget(newBudget);
    setIsThinking(true);
    setTimeout(() => setIsThinking(false), 1500);
  }, []);

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <PremiumCard className="p-16 relative overflow-hidden bg-primary/[0.02]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 text-right">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-8">
                <Brain className="w-6 h-6" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">حالت «چه می‌شد اگر؟»</h2>
              <p className="opacity-50 text-lg leading-relaxed mb-10">
                سناریوهای مختلف را آزمایش کنید تا ببینید تغییرات کوچک چگونه مسیر آینده شما را تغییر می‌دهند.
              </p>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-sm">
                    <span className="opacity-40">بودجه سالانه</span>
                    <span className="text-primary">${budget.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="5000" max="30000" step="1000"
                    value={budget} 
                    onChange={(e) => handleScenarioChange(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex gap-4">
                  {["Istanbul", "Ankara", "Izmir"].map(c => (
                    <button 
                      key={c}
                      onClick={() => setCity(c)}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-bold text-xs transition-all",
                        city === c ? "bg-primary text-white" : "glass opacity-40 hover:opacity-100"
                      )}
                    >{c}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div 
                    key="analyzing"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-[300px] text-center"
                  >
                    <div className="relative mb-6">
                      <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                    </div>
                    <p className="font-bold opacity-40">در حال آنالیز احتمالات جدید...</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-8 glass border-primary/20 rounded-[2.5rem] relative overflow-hidden">
                       <h4 className="text-xl font-black mb-6 flex items-center gap-3">
                         <Lightbulb className="text-primary" /> خروجی سناریو
                       </h4>
                       <div className="space-y-6">
                         <ScenarioInsight 
                           icon={<MapPin className="w-4 h-4" />} 
                           text={`در ${city} با این بودجه، شما می‌توانید در ۳۲ دانشگاه (۵ مورد بیشتر از قبل) اپلای کنید.`} 
                         />
                         <ScenarioInsight 
                           icon={<DollarSign className="w-4 h-4" />} 
                           text="شانس دریافت بورسیه شما از ۴۰٪ به ۶۵٪ افزایش یافت." 
                         />
                         <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-xs font-bold leading-relaxed opacity-80">
                           نکته: افزایش ۳,۰۰۰ دلاری بودجه، دسترسی شما به دانشکده‌های پزشکی برتر استانبول را باز می‌کند.
                         </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </PremiumCard>
      </div>
    </section>
  );
};
