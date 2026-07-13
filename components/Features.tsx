"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe, ArrowUpRight, Check } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import Link from "next/link";

export const Features = () => {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-2xl text-right">
            <span className="text-primary font-black tracking-widest uppercase text-sm mb-4 block">قدرت گرفته از تکنولوژی</span>
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">پلتفرمی برای <br /><span className="text-primary">نسل جدید دانشجویان.</span></h2>
            <p className="opacity-50 text-xl leading-relaxed">ما تمام فرآیندهای سنتی و خسته‌کننده مهاجرت را خودکار کرده‌ایم تا شما فقط روی یادگیری تمرکز کنید.</p>
          </div>
          <Link href="/about" className="flex items-center gap-3 font-bold opacity-60 hover:opacity-100 transition-all py-6 group">
            <span>چرا ترکیه هاب؟</span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <PremiumCard className="md:col-span-8 p-12 flex flex-col justify-between h-[500px] group overflow-hidden relative">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-10">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-black mb-6">پذیرش مستقیم و سریع</h3>
              <p className="opacity-50 text-xl max-w-lg leading-relaxed">
                مدارک شما مستقیماً به سیستم مدیریت پذیرش دانشگاه متصل می‌شود. نتایج را در نیمی از زمان معمول دریافت کنید.
              </p>
            </div>
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {["بدون واسطه", "تایید آنی", "بورسیه تضمینی", "پشتیبانی ۲۴/۷"].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs font-bold opacity-40">
                  <Check className="w-4 h-4 text-primary" /> {t}
                </div>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard className="md:col-span-4 p-10 flex flex-col justify-center gap-8">
            <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-4">امنیت قانونی و مالی</h3>
              <p className="opacity-40 leading-relaxed">
                تمام قراردادهای ما طبق قوانین ترکیه و ایران تنظیم شده‌اند. تراکنش‌های مالی شفاف و قابل پیگیری هستند.
              </p>
            </div>
          </PremiumCard>
        </div>
      </div>
    </section>
  );
};
