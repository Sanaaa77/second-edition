import React from "react";
import { Star, MapPin, ChevronLeft } from "lucide-react";
import Link from "next/link";

const universities = [
  { slug: "bahcesehir-university", name: "دانشگاه باهچه‌شهیر", city: "استانبول", rank: "Top 500", img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800" },
  { slug: "koc-university", name: "دانشگاه کوچ", city: "استانبول", rank: "Top 400", img: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800" },
  { slug: "metu", name: "دانشگاه خاورمیانه (METU)", city: "آنکارا", rank: "Top 600", img: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800" },
];

export const Universities = () => {
  return (
    <section className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-right">
            <h2 className="text-3xl md:text-5xl font-black text-foreground">دانشگاه‌های برتر</h2>
            <p className="text-muted mt-4">انتخاب از میان معتبرترین مراکز آموزشی ترکیه</p>
          </div>
          <Link href="/universities" className="text-primary font-bold hover:underline flex items-center gap-2">
            مشاهده همه دانشگاه‌ها <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {universities.map((uni, i) => (
            <Link key={i} href={`/universities/${uni.slug}`} className="group">
              <div className="relative h-64 rounded-[2rem] overflow-hidden mb-6 border border-white/5 group-hover:border-primary/50 transition-all">
                <img
                  src={uni.img}
                  alt={uni.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-black uppercase">
                  {uni.rank}
                </div>
              </div>
              <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors text-right text-foreground">{uni.name}</h3>
              <div className="flex items-center justify-end gap-2 opacity-60 text-sm">
                <span>{uni.city}</span>
                <MapPin className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
