"use client";
import React from "react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { 
  CloudRain, 
  Moon, 
  Users, 
  Briefcase, 
  Bus, 
  Compass,
  Star
} from "lucide-react";

const CITY_MATCHES = [
  { 
    city: "Istanbul", 
    tag: "بهترین برای برون‌گراها", 
    icon: <Users />, 
    advice: "اگر به دنبال شب‌گردی و فرصت‌های شغلی هستید، اینجا قلب تپنده است.",
    score: 98 
  },
  { 
    city: "Ankara", 
    tag: "بهترین برای تمرکز علمی", 
    icon: <Briefcase />, 
    advice: "ایده‌آل برای کسانی که محیطی آرام و اداری برای تحقیق و مطالعه می‌خواهند.",
    score: 92 
  },
  { 
    city: "Izmir", 
    tag: "بهترین تعادل لایف‌استایل", 
    icon: <Compass />, 
    advice: "اگر آرامش ساحل و آزادی‌های اجتماعی برای شما اولویت است.",
    score: 89 
  }
];

export const CityLifestyleMatch = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-black mb-16 text-right">تطبیق شهر با لایف‌استایل شما</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CITY_MATCHES.map((item, i) => (
            <PremiumCard key={i} className="group hover:border-primary/50 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Match Score</div>
                  <div className="text-xl font-black text-primary">{item.score}%</div>
                </div>
              </div>
              <h4 className="text-xl font-black mb-4">{item.city}</h4>
              <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold mb-6">{item.tag}</span>
              <p className="text-xs opacity-50 leading-relaxed">{item.advice}</p>
            </PremiumCard>
          ))}
        </div>
      </div>
    </section>
  );
};
