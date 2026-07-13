"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Send, ArrowLeft } from "lucide-react";
import { MagneticButton } from "@/components/ui/PremiumComponents";

export const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasDismissed) {
        setIsVisible(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasDismissed]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="max-w-xl w-full glass p-12 rounded-[4rem] border border-white/10 relative overflow-hidden shadow-[0_100px_100px_rgba(0,0,0,0.8)]"
      >
        <button 
          onClick={() => { setIsVisible(false); setHasDismissed(true); }}
          className="absolute top-8 left-8 p-3 hover:bg-white/5 rounded-full transition-colors opacity-40 hover:opacity-100"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-accent/20 rounded-[2rem] flex items-center justify-center text-accent mx-auto mb-10 shadow-2xl shadow-accent/20">
            <Gift className="w-10 h-10" />
          </div>
          <h3 className="text-4xl font-black mb-6 tracking-tighter">کجا با این عجله؟ 🛑</h3>
          <p className="opacity-60 text-lg leading-relaxed mb-10">
            قبل از رفتن، پکیج «مشاوره متنی رایگان» ما را دریافت کنید. فقط شماره موبایل خود را بگذارید تا کارشناسان ما در واتس‌اپ با شما در ارتباط باشند.
          </p>

          <div className="space-y-4">
            <input 
              type="tel" 
              placeholder="شماره تماس (واتس‌اپ / تلگرام)" 
              className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl outline-none focus:border-primary transition-all font-bold text-center text-xl"
            />
            <MagneticButton className="w-full bg-primary py-6 rounded-2xl font-black text-2xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
              <span>دریافت هدیه</span>
              <ArrowLeft className="w-6 h-6" />
            </MagneticButton>
          </div>

          <p className="mt-8 text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">Limited time offer for students</p>
        </div>
      </motion.div>
    </div>
  );
};
