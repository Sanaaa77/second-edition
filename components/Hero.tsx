"use client";
import React from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/PremiumComponents";
import { ArrowLeft, Star, CheckCircle, Sparkles } from "lucide-react";
import { useJourney } from "@/hooks/useJourney";
import Link from "next/link";

export const Hero = () => {
  const { user } = useJourney();
  const userName = (user as any).first_name || (user as any).name || "دانشجو";
  const userMajor = (user as any).preferred_major || (user as any).major || "";

  return (
    <section className="relative pt-40 pb-20 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/20 blur-[180px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[600px] h-[600px] bg-accent/10 blur-[150px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex items-center gap-4 mb-10 text-right">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-white/10" />)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-accent">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">انتخاب اول ۱۲,۰۰۰ دانشجو</span>
                </div>
              </div>
              
              <h1 className="text-6xl md:text-[5.5rem] font-black leading-[1] mb-10 tracking-tighter text-right text-foreground">
                سفر اختصاصی <br /> <span className="text-primary">{userName}</span> به ترکیه.
              </h1>
              
              <p className="text-xl md:text-2xl opacity-60 mb-12 max-w-xl leading-relaxed text-right ml-auto text-muted">ما اینجا نیستیم که فقط دانشگاه معرفی کنیم؛ ما تمام مسیر اپلای تا اشتغال شما را به صورت هوشمند مدیریت می‌کنیم.</p>

              <div className="flex flex-col sm:flex-row gap-6 items-center justify-end">
                <div className="flex items-center gap-2 text-xs font-bold opacity-40 order-2 sm:order-1">
                   <CheckCircle className="w-4 h-4 text-green-500" /> بدون کارمزد (پارتنر رسمی)
                </div>
                <Link href="/universities">
                  <MagneticButton className="bg-primary text-white px-12 py-6 rounded-2xl font-black text-2xl shadow-xl transition-all flex items-center gap-3 order-1 sm:order-2">
                    <span>شروع مسیر موفقیت</span> <ArrowLeft className="w-6 h-6" />
                  </MagneticButton>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="perspective-1000">
              <div className="relative glass rounded-[3rem] p-10 border border-white/10 shadow-2xl h-[500px] overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="flex items-center justify-between mb-10">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black">TH</div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">Online</div>
                  </div>
                </div>

                <div className="space-y-8 text-right">
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                      <div className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2">Next Step</div>
                      <div className="text-lg font-bold text-foreground">تکمیل مدارک پذیرش {userMajor}</div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-2">
                         <Sparkles className="text-primary w-6 h-6" />
                         <span className="text-[10px] font-black opacity-30">AI Matching</span>
                      </div>
                      <div className="h-24 bg-primary/20 rounded-3xl border border-primary/20 flex items-center justify-center">
                         <CheckCircle className="text-primary w-8 h-8" />
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
