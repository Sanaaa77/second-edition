"use client";
import React, { useState, useMemo } from "react";
import { PremiumCard, AnimatedCounter } from "@/components/ui/PremiumComponents";
import { useJourney } from "@/hooks/useJourney";
import { MultiDimEngine } from "@/lib/decision-engine/MultiDimEngine";

export const ScenarioSimulator = () => {
  const { user } = useJourney();
  const [gpa, setGpa] = useState(18);
  
  const analysis = useMemo(() => MultiDimEngine.calculate({ ...user, gpa }, {}, {}), [gpa, user]);

  return (
    <PremiumCard className="p-10 text-right space-y-8">
      <h3 className="text-2xl font-black">شبیه‌ساز سناریو</h3>
      <div className="space-y-4">
        <label className="block font-bold">معدل فرضی: {gpa}</label>
        <input type="range" min="10" max="20" step="0.1" value={gpa} onChange={e => setGpa(parseFloat(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="text-4xl font-black text-primary">%<AnimatedCounter value={analysis.overallReadiness} /> Readiness</div>
    </PremiumCard>
  );
};
