"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard, AnimatedCounter, MagneticButton, SuccessMoments } from "@/components/ui/PremiumComponents";
import { Home, Utensils, Train, ShieldCheck, Wallet, Info, ArrowLeft, Lightbulb } from "lucide-react";
import { City } from "@/types/database";
import { useJourney } from "@/hooks/useJourney";
import { useQuery } from "@tanstack/react-query";
import { container } from "@/lib/core/di/Container";
import { TOKENS } from "@/lib/core/di/registry";
import { CityService } from "@/services/city/city.service";

export const CostCalculator = () => {
  const { user } = useJourney();
  const [cityId, setCityId] = useState<string | null>(null);
  const [housing, setHousing] = useState<"dorm" | "apartment">("dorm");
  const [showSuccess, setShowSuccess] = useState(false);
  
  const cityService = useMemo(() => container.resolve<CityService>(TOKENS.CITY_SERVICE as any), []);

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: () => cityService.getAll(),
  });

  // Set default city once loaded
  useMemo(() => {
    if (cities.length > 0 && !cityId) {
      setCityId(cities[0].id);
    }
  }, [cities, cityId]);

  const city = useMemo(() => cities.find(c => c.id === cityId), [cities, cityId]);

  const costs = useMemo(() => {
    if (!city) return { monthly: 0, rentVal: 0, foodVal: 0, rentPercentage: 0 };
    const rentVal = housing === "dorm" ? parseInt(city.dorm.split("-")[0].replace(/,/g, "")) : parseInt(city.rent.split("-")[0].replace(/,/g, ""));
    const foodVal = parseInt(city.food.split("-")[0].replace(/,/g, ""));
    const monthly = rentVal + foodVal + 600;
    const rentPercentage = Math.round((rentVal / monthly) * 100);
    return { monthly, rentVal, foodVal, rentPercentage };
  }, [city, housing]);

  const budgetDisplay = (user.budget || 0).toLocaleString();

  return (
    <section id="costs" className="py-40 px-6 relative overflow-hidden bg-[#020617]">
      <SuccessMoments show={showSuccess} onComplete={() => setShowSuccess(false)} />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="text-right">
            <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">Financial Intelligence</span>
            <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-tight text-foreground">هزینه‌ها رو <br /><span className="text-primary">شفاف کن.</span></h2>
            <p className="opacity-40 text-xl max-w-xl leading-relaxed text-muted">ما بودجه {budgetDisplay} دلاری شما رو با واقعیت‌های ۲۰۲۶ ترکیه تطبیق دادیم.</p>
          </div>
          
          <div className="flex gap-4 p-2 glass rounded-[2rem] border-white/5">
            {cities.slice(0, 3).map(c => (
              <button key={c.id} onClick={() => setCityId(c.id)} className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${cityId === c.id ? "bg-primary text-white shadow-xl" : "opacity-30 hover:opacity-100"}`}>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <PremiumCard className="p-12 space-y-16">
              {city && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex p-2 bg-white/5 rounded-3xl border border-white/5 w-full md:w-auto">
                      <button onClick={() => setHousing("dorm")} className={`flex-1 md:flex-none px-12 py-4 rounded-2xl font-black text-sm transition-all ${housing === "dorm" ? "bg-white/10 text-white" : "opacity-30"}`}>خوابگاه</button>
                      <button onClick={() => setHousing("apartment")} className={`flex-1 md:flex-none px-12 py-4 rounded-2xl font-black text-sm transition-all ${housing === "apartment" ? "bg-white/10 text-white" : "opacity-30"}`}>آپارتمان</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    <CostItem icon={<Home />} label="اجاره ماهانه" value={housing === "dorm" ? city.dorm : city.rent} />
                    <CostItem icon={<Utensils />} label="تغذیه" value={city.food} />
                    <CostItem icon={<Train />} label="رفت و آمد" value={city.transport} />
                    <CostItem icon={<ShieldCheck />} label="بیمه" value="۱,۵۰۰" />
                  </div>

                  <div className="pt-12 border-t border-white/5">
                    <div className="flex items-start gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 text-right">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><Lightbulb /></div>
                        <div className="space-y-2">
                          <h5 className="font-black text-lg text-foreground">تحلیل هوشمند بودجه</h5>
                          <p className="text-sm text-muted leading-relaxed font-bold">
                            در شهر {city.name}، حدود **{costs.rentPercentage}٪** از بودجه ماهانه شما صرف اسکان می‌شود.
                          </p>
                        </div>
                    </div>
                  </div>
                </>
              )}
            </PremiumCard>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-primary p-12 rounded-[3.5rem] text-white h-full flex flex-col justify-between shadow-[0_50px_100px_rgba(99,102,241,0.3)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10 text-right">
                <div className="text-xs font-black tracking-widest opacity-60 uppercase mb-4">Total Budget Estimate</div>
                <h3 className="text-4xl font-black mb-16 tracking-tight">خلاصه تخمین</h3>
                
                <div className="space-y-12">
                  <div>
                    <div className="text-sm opacity-60 mb-2">میانگین هزینه ماهانه</div>
                    <div className="text-7xl font-black tracking-tighter text-foreground">
                      <AnimatedCounter value={costs.monthly} /> <span className="text-2xl font-normal opacity-60">₺</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-20">
                <MagneticButton onClick={() => setShowSuccess(true)} className="w-full bg-white text-primary py-6 rounded-[2rem] font-black text-2xl">ذخیره در پروفایل</MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface CostItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const CostItem = ({ icon, label, value }: CostItemProps) => (
  <div className="space-y-4 text-right">
    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mr-auto lg:mr-0">{icon}</div>
    <div>
      <div className="text-[10px] font-black uppercase tracking-widest mb-1 text-muted">{label}</div>
      <div className="text-2xl font-black tracking-tight text-foreground">{value} <span className="text-xs font-normal text-muted">₺</span></div>
    </div>
  </div>
);
