"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  Search,
} from "lucide-react";

interface AnalyzedFile {
  name: string;
  status: string;
  feedback: string;
}

export const AIDocumentReview = () => {
  const [files, setFiles] = useState<AnalyzedFile[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      setTimeout(() => {
        setFiles(prev => [...prev, {
          name: file.name,
          status: "warning",
          feedback: "کیفیت تصویر پایین است. لطفا دوباره اسکن کنید."
        }]);
        setIsScanning(false);
      }, 2000);
    }
  }, []);

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-right">
            <span className="text-primary font-black tracking-widest uppercase text-xs mb-4 block">AI Vision System</span>
            <h2 className="text-5xl font-black mb-8 leading-tight tracking-tighter">بررسی هوشمند <br /><span className="text-primary">مدارک شما.</span></h2>
            <p className="opacity-50 text-xl leading-relaxed mb-12">سیستم هوش مصنوعی ما مدارک شما را قبل از ارسال به دانشگاه بررسی می‌کند.</p>
            <div className="space-y-4">
               {["تشخیص کیفیت اسکن", "بررسی انقضای پاسپورت", "تایید مهرهای رسمی"].map(t => (
                 <div key={t} className="flex items-center gap-3 font-bold opacity-70"><CheckCircle2 className="w-5 h-5 text-primary" />{t}</div>
               ))}
            </div>
          </div>

          <PremiumCard className="p-10 min-h-[400px] flex flex-col">
            <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-12 text-center relative group hover:border-primary/50 transition-colors">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleUpload} />
              <UploadCloud className="w-12 h-12 text-primary mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-black mb-2">آپلود مدرک</h4>
              <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">PDF, JPG (Max 10MB)</p>
            </div>

            <div className="mt-8 space-y-4">
              <AnimatePresence>
                {isScanning && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 bg-primary/5 rounded-2xl flex items-center gap-4 border border-primary/20">
                    <Search className="w-5 h-5 text-primary animate-spin" /><span className="font-bold text-sm">در حال آنالیز...</span>
                  </motion.div>
                )}
                {files.map((file, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 glass rounded-2xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <div><div className="font-bold text-xs">{file.name}</div><div className="text-[10px] text-yellow-500 font-bold">{file.feedback}</div></div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </PremiumCard>
        </div>
      </div>
    </section>
  );
};
