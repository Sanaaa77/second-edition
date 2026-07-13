"use client";
import React from "react";
import { PremiumCard } from "./PremiumComponents";
import { ArrowLeft } from "lucide-react";

export const SEOContentBlocks = () => {
  const blocks = [
    { title: "تحصیل پزشکی", desc: "بدون آزمون ورودی در بهترین دانشگاه‌ها." },
    { title: "بورسیه ۲۰۲۶", desc: "راهنمای دریافت بورسیه‌های تا ۱۰۰٪." },
    { title: "کار دانشجویی", desc: "قوانین جدید اجازه کار برای دانشجویان." },
    { title: "آزمون YÖS", desc: "منابع رایگان و تاریخ‌های آزمون." },
  ];

  return (
    <section className="py-24 px-6 border-t border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {blocks.map((b, i) => (
          <PremiumCard key={i} className="p-8 hover:bg-white/[0.03]">
            <h4 className="text-xl font-black mb-4">{b.title}</h4>
            <p className="opacity-40 text-sm mb-6 leading-relaxed">{b.desc}</p>
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase group cursor-pointer">
              Read more <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </PremiumCard>
        ))}
      </div>
    </section>
  );
};
