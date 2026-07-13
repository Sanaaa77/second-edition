"use client";
import React from "react";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { 
  Clock, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Tag
} from "lucide-react";

const ARTICLES = [
  {
    title: "چگونه در سال ۲۰۲۶ برای رشته دندانپزشکی در ترکیه اپلای کنیم؟",
    desc: "راهنمای کامل آزمون‌های ورودی، مدارک لازم و لیست بهترین دانشگاه‌های مورد تایید وزارت بهداشت ایران.",
    cat: "پزشکی و دندانپزشکی",
    date: "۱۰ تیر ۱۴۰۵",
    author: "تیم تحریریه ترکیه هاب",
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "تغییرات جدید قوانین اجازه کار دانشجویی در ترکیه",
    desc: "بررسی مصوبات جدید دولت ترکیه برای اشتغال دانشجویان بین‌المللی در حین تحصیل.",
    cat: "قوانین و ویزا",
    date: "۵ تیر ۱۴۰۵",
    author: "مشاور حقوقی",
    img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800"
  }
];

export const BlogSection = () => {
  return (
    <section id="blog" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="text-right">
            <span className="text-primary font-black tracking-widest uppercase text-sm mb-4 block">مجله آموزشی ترکیه هاب</span>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">دانش، قدرت <br />مهاجرت شماست.</h2>
            <p className="opacity-50 text-xl max-w-xl">به‌روزترین مقالات تحلیلی، قوانین جدید و راهنمای گام‌به‌گام زندگی دانشجویی.</p>
          </div>
          <button className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-2xl font-black border border-white/5 hover:bg-white/10 transition-all">
            ورود به وبلاگ <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <PremiumCard className="p-0 overflow-hidden group h-full">
              <div className="relative h-96">
                <img src={ARTICLES[0].img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={ARTICLES[0].title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-10 right-10 left-10 text-white">
                  <span className="px-4 py-1.5 bg-primary rounded-full text-xs font-black mb-6 inline-block text-white">{ARTICLES[0].cat}</span>
                  <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">{ARTICLES[0].title}</h3>
                  <div className="flex items-center gap-8 opacity-60 text-sm font-bold">
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> ۷ دقیقه مطالعه</div>
                    <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> ۱۲ دیدگاه</div>
                  </div>
                </div>
              </div>
            </PremiumCard>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <PremiumCard className="p-8">
              <h4 className="text-xl font-black mb-6 flex items-center gap-3">
                <TrendingUp className="text-accent" /> پربازدیدترین‌ها
              </h4>
              <div className="space-y-6">
                {ARTICLES.slice(1).map((art, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Tag className="w-3 h-3" /> {art.cat}
                    </div>
                    <h5 className="font-bold leading-relaxed group-hover:text-primary transition-colors">{art.title}</h5>
                  </div>
                ))}
              </div>
            </PremiumCard>
          </div>
        </div>
      </div>
    </section>
  );
};
