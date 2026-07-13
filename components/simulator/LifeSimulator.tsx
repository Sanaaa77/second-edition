"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PremiumCard, AnimatedCounter } from "@/components/ui/PremiumComponents";
import { Smile, Zap, CreditCard, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export const LifeSimulator = () => {
  const [budget, setBudget] = useState(800);
  const [lifestyle, setLifestyle] = useState(50);
  const [city, setCity] = useState("istanbul");

  const results = useMemo(() => {
    return {
      happiness: Math.min(100, (budget / 20) + (lifestyle / 2)),
      safety: city === "istanbul" ? 75 : 90,
      nightlife: city === "istanbul" ? 95 : 60,
      savings: Math.max(0, budget - (500 + (lifestyle * 5)))
    };
  }, [budget, lifestyle, city]);

  return (
    <section className="py-32 px-6 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 text-right">
            <h2 className="text-5xl font-black mb-8 leading-tight tracking-tighter">شبیه‌ساز <br /><span className="text-primary">زندگی دانشجویی.</span></h2>
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex justify-between font-bold"><span>بودجه ماهانه</span><span className="text-primary">${budget}</span></div>
                <input type="range" min="400" max="3000" step="50" value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none accent-primary cursor-pointer" />
              </div>
              <div className="flex gap-4">
                {["istanbul", "ankara", "izmir"].map(c => (
                  <button key={c} onClick={() => setCity(c)} className={cn("flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all", city === c ? "bg-primary text-white" : "glass opacity-30 hover:opacity-100")}>{c}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-6">
            <MetricCard label="خوشبختی" value={results.happiness} icon={<Smile className="text-yellow-500" />} color="bg-yellow-500" />
            <MetricCard label="امنیت" value={results.safety} icon={<ShieldAlert className="text-green-500" />} color="bg-green-500" />
            <MetricCard label="تفریحات" value={results.nightlife} icon={<Zap className="text-purple-500" />} color="bg-purple-500" />
            <MetricCard label="پس‌انداز" value={(results.savings / budget) * 100} icon={<CreditCard className="text-primary" />} color="bg-primary" suffix={`$${results.savings}`} />
          </div>
        </div>
      </div>
    </section>
  );
};

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
}

const MetricCard = ({ label, value, icon, color, suffix }: MetricCardProps) => (
  <PremiumCard className="p-8 space-y-6">
    <div className="flex justify-between items-center">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">{icon}</div>
      <div className="text-2xl font-black text-foreground">{suffix || `${Math.round(value)}%`}</div>
    </div>
    <div className="space-y-2">
      <div className="text-[10px] font-black uppercase text-muted">{label}</div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={cn("h-full", color)} />
      </div>
    </div>
  </PremiumCard>
);
