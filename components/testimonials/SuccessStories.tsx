"use client";
import React from "react";
import { TESTIMONIALS } from "@/data/mockData";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { Clock, CheckCircle, Home } from "lucide-react";

export const SuccessStories = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black mb-16 text-center tracking-tighter">قصه‌های واقعی موفقیت.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <PremiumCard key={i} className="p-0 overflow-hidden group flex flex-col md:flex-row h-full">
              <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="p-8 md:w-2/3 text-right">
                <div className="mb-6">
                   <h4 className="font-black text-xl">{t.name}</h4>
                   <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{t.uni}</p>
                </div>
                <p className="opacity-70 text-sm leading-relaxed mb-8 italic">"{t.story}"</p>
                <div className="flex justify-end gap-6 text-[10px] font-black opacity-30">
                  <div className="flex items-center gap-2"><Clock className="w-3 h-3" /> {t.timeline}</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3" /> ویزا تایید</div>
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>
      </div>
    </section>
  );
};
