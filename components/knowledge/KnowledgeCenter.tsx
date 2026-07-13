"use client";
import React, { useState, useEffect } from "react";
import { 
  Search, 
  BookOpen, 
  Globe, 
  GraduationCap, 
  FileText, 
  ChevronRight,
  Sparkles,
  MapPin,
  Clock
} from "lucide-react";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { cn } from "@/lib/utils";

export const KnowledgeCenter = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const categories = [
    { id: "All", label: "همه مقالات", icon: Globe },
    { id: "Visa", label: "ویزا و اقامت", icon: FileText },
    { id: "Universities", label: "دانشگاه‌ها", icon: GraduationCap },
    { id: "Life", label: "زندگی در ترکیه", icon: MapPin },
    { id: "Admission", label: "پذیرش تحصیلی", icon: BookOpen },
  ];

  return (
    <section className="py-24 px-6 bg-[#020617] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border-white/5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-black tracking-widest uppercase">Knowledge Base v2.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
            مرکز دانش <br /><span className="text-primary">ترکیه هاب.</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            کامل‌ترین مرجع اطلاعاتی برای تحصیل، زندگی و آینده شغلی شما در ترکیه.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative glass border-white/10 rounded-2xl p-2 flex items-center gap-4">
            <Search className="w-6 h-6 text-muted-foreground mr-4" />
            <input 
              className="flex-1 bg-transparent border-none outline-none text-foreground py-4 text-lg" 
              placeholder="جستجو در مقالات، راهنماها و پرسش‌ها..."
            />
            <MagneticButton className="px-10 py-4 font-black">جستجو</MagneticButton>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-xl font-black transition-all",
                activeCategory === cat.id 
                  ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                  : "glass border-white/5 text-muted-foreground hover:border-primary/50"
              )}
            >
              <cat.icon className="w-5 h-5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PremiumCard key={i} className="group cursor-pointer p-0 overflow-hidden border-white/5 hover:border-primary/30">
              <div className="aspect-video bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <img 
                  src={`https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80&idx=${i}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Article Thumbnail"
                />
                <div className="absolute top-4 right-4 z-20">
                  <span className="text-[10px] font-black px-3 py-1 bg-primary text-white rounded-full uppercase">GUIDE</span>
                </div>
              </div>
              
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ۵ دقیقه مطالعه</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> ۳.۴ هزار بازدید</span>
                </div>
                <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-2">
                   راهنمای جامع دریافت ویزای تحصیلی ترکیه در سال ۲۰۲۶
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  در این مقاله گام‌به‌گام تمام مراحل، مدارک مورد نیاز و نکات امنیتی برای دریافت سریع ویزای دانشجویی ترکیه را بررسی می‌کنیم.
                </p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20" />
                      <span className="text-[10px] font-bold text-muted-foreground">تیم تحریریه ترکیه هاب</span>
                   </div>
                   <ChevronRight className="w-5 h-5 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
           <button className="px-12 py-5 glass border-white/10 text-sm font-black text-foreground hover:bg-white/5 transition-colors rounded-2xl">
              مشاهده مقالات بیشتر
           </button>
        </div>
      </div>
    </section>
  );
};
