"use client";
import React, { useState } from "react";
import { container, TOKENS } from "@/lib/core/di/registry";
import { ImportEngineService, ImportEntityType } from "@/services/university/import-engine.service";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { Upload, Database, CheckCircle2, AlertCircle, Loader2, FileJson, FileSpreadsheet } from "lucide-react";

import { ImportResult } from "@/types/knowledge";

export default function ImportPage() {
  const [type, setType] = useState<ImportEntityType>("university");
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const importService = container.resolve<ImportEngineService>(TOKENS.IMPORT_ENGINE_SERVICE);

  const handleImport = async () => {
    if (!jsonInput) return alert("Please provide JSON data");
    
    setLoading(true);
    setResult(null);
    try {
      const data = JSON.parse(jsonInput) as Record<string, any>[];
      const res = await importService.importData(type, Array.isArray(data) ? data : [data], "admin-id");
      setResult(res);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert("Invalid JSON or Import Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-white tracking-tighter">سیستم واردات انبوه</h1>
          <p className="text-muted-foreground">وارد کردن داده‌های رسمی دانشگاه‌ها و مقالات در قالب JSON.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <PremiumCard className="p-8 space-y-6">
              <div className="space-y-4">
                 <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">انتخاب نوع داده</label>
                 <select 
                   value={type} 
                   onChange={(e) => setType(e.target.value as ImportEntityType)}
                   className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:ring-1 focus:ring-primary"
                 >
                   <option value="university">Universities</option>
                   <option value="program">Programs</option>
                   <option value="city">Cities</option>
                   <option value="scholarship">Scholarships</option>
                   <option value="article">Articles</option>
                 </select>
              </div>

              <div className="space-y-4">
                 <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">دیتا (JSON Array)</label>
                 <textarea 
                   value={jsonInput}
                   onChange={(e) => setJsonInput(e.target.value)}
                   className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-white font-mono text-sm outline-none focus:ring-1 focus:ring-primary"
                   placeholder='[{"name": "Istanbul University", "slug": "istanbul-uni", ...}]'
                 />
              </div>

              <MagneticButton onClick={handleImport} disabled={loading} className="w-full py-5 font-black">
                {loading ? <Loader2 className="animate-spin" /> : "اجرای عملیات واردات"}
              </MagneticButton>
           </PremiumCard>

           <div className="space-y-8">
              {result && (
                <PremiumCard className="p-8 border-primary/20 bg-primary/5">
                   <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                     <CheckCircle2 className="text-primary" /> گزارش عملیات
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 glass rounded-xl">
                         <div className="text-[10px] font-black text-muted-foreground uppercase">Total</div>
                         <div className="text-2xl font-black">{result.total}</div>
                      </div>
                      <div className="p-4 glass rounded-xl">
                         <div className="text-[10px] font-black text-green-500 uppercase">Success</div>
                         <div className="text-2xl font-black text-green-500">{result.success}</div>
                      </div>
                      <div className="p-4 glass rounded-xl">
                         <div className="text-[10px] font-black text-red-500 uppercase">Failed</div>
                         <div className="text-2xl font-black text-red-500">{result.failed}</div>
                      </div>
                   </div>
                   {result.errors.length > 0 && (
                     <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div className="text-xs font-bold text-red-500 mb-2">Errors detected in batches:</div>
                        <pre className="text-[10px] text-red-400 overflow-auto">{JSON.stringify(result.errors, null, 2)}</pre>
                     </div>
                   )}
                </PremiumCard>
              )}

              <PremiumCard className="p-8">
                 <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                   <AlertCircle className="text-yellow-500" /> نکات فنی
                 </h3>
                 <ul className="space-y-4 text-xs text-muted-foreground leading-relaxed">
                   <li>• از صحت ساختار <b>JSON</b> قبل از شروع اطمینان حاصل کنید.</li>
                   <li>• فیلد <b>slug</b> برای دانشگاه‌ها و شهرها به عنوان کلید یکتا عمل می‌کند.</li>
                   <li>• در صورت تکراری بودن اسلاگ، داده‌های قبلی <b>Update</b> می‌شوند.</li>
                   <li>• عملیات به صورت دسته‌های ۵۰ تایی انجام می‌شود تا فشار روی دیتابیس کنترل شود.</li>
                 </ul>
              </PremiumCard>
           </div>
        </div>
      </div>
    </div>
  );
}
