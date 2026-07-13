"use client";
import React from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "./ui/PremiumComponents";

export const Stats = () => {
  const stats = [
    { label: "دانشجویان موفق", value: 12450, suffix: "+" },
    { label: "دانشگاه‌های همکار", value: 85, suffix: "" },
    { label: "نرخ پذیرش موفق", value: 98, suffix: "%" },
    { label: "صرفه‌جویی در هزینه", value: 40, suffix: "%" },
  ];

  return (
    <section className="py-24 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }} 
            className="text-center group"
          >
            <div className="text-5xl font-black mb-4 text-foreground">
              <AnimatedCounter value={stat.value} /> 
              <span className="text-primary text-3xl">{stat.suffix}</span>
            </div>
            <div className="text-xs font-black uppercase tracking-[0.3em] text-muted group-hover:text-foreground transition-colors duration-300">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
