"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CITIES } from "@/data/mockData";
import { MapPin, Info, Thermometer, Wind, Wifi, Briefcase, Shield } from "lucide-react";

export const CostMap = () => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);

  return (
    <section className="py-24 px-6 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6">نقشه هزینه و کیفیت زندگی</h2>
          <p className="opacity-60 text-lg">تحلیل دقیق شهرهای دانشجویی ترکیه در یک نگاه.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Map Visual (Simplified Interactive) */}
          <div className="lg:col-span-7 bg-white/5 rounded-[3rem] aspect-[4/3] relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <span className="text-8xl font-black uppercase tracking-[2rem]">TURKEY</span>
            </div>
            
            {CITIES.map((city) => (
              <motion.button
                key={city.id}
                whileHover={{ scale: 1.2 }}
                onClick={() => setSelectedCity(city)}
                className={`absolute w-6 h-6 rounded-full border-4 border-background transition-colors ${
                  selectedCity.id === city.id ? "bg-primary scale-125 shadow-2xl shadow-primary/50" : "bg-white/40"
                }`}
                style={{ left: city.coords.x, top: city.coords.y }}
              >
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-tighter">
                  {city.name}
                </div>
              </motion.button>
            ))}
          </div>

          {/* City Details */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-8 rounded-[2.5rem] border border-white/10"
              >
                <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
                  <MapPin className="text-primary" /> {selectedCity.name}
                </h3>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-white/5 rounded-2xl">
                    <div className="text-[10px] opacity-40 uppercase font-bold mb-1">اجاره آپارتمان</div>
                    <div className="font-bold">{selectedCity.rent} ₺</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl">
                    <div className="text-[10px] opacity-40 uppercase font-bold mb-1">هزینه خوابگاه</div>
                    <div className="font-bold">{selectedCity.dorm} ₺</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <DetailRow icon={<Shield className="w-4 h-4 text-green-500" />} label="امنیت" value={selectedCity.safety} />
                  <DetailRow icon={<Thermometer className="w-4 h-4 text-orange-500" />} label="آب و هوا" value={selectedCity.weather} />
                  <DetailRow icon={<Wifi className="w-4 h-4 text-blue-500" />} label="اینترنت" value={selectedCity.internet} />
                  <DetailRow icon={<Briefcase className="w-4 h-4 text-purple-500" />} label="بازار کار" value={selectedCity.jobs} />
                </div>

                <button className="w-full mt-8 bg-primary/10 hover:bg-primary text-primary hover:text-white py-4 rounded-2xl font-bold transition-all">
                  مشاهده راهنمای کامل {selectedCity.name}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const DetailRow = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3 opacity-70 text-sm">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-sm font-bold">{value}</div>
  </div>
);
