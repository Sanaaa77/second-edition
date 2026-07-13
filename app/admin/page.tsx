"use client";
import React from "react";
import { 
  Database, 
  FileText, 
  GraduationCap, 
  MapPin, 
  Settings, 
  BarChart, 
  Upload, 
  ShieldCheck,
  ChevronRight,
  Plus
} from "lucide-react";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import Link from "next/link";

const AdminMenuCard = ({ title, desc, icon: Icon, href }: any) => (
  <Link href={href}>
    <PremiumCard className="p-8 hover:border-primary transition-all group cursor-pointer">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6" />
        </div>
        <Plus className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="text-xl font-black text-white mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </PremiumCard>
  </Link>
);

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#020617] py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full border-white/5">
              <ShieldCheck className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black tracking-widest uppercase">System Administrator</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-white">
              پنل مدیریت <br /><span className="text-primary">دیتابیس مرکزی.</span>
            </h2>
          </div>
          <div className="flex gap-4">
             <Link href="/admin/import">
                <MagneticButton className="px-8 py-4 text-xs font-black"><Upload className="w-4 h-4 mr-2" /> واردات انبوه</MagneticButton>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AdminMenuCard 
             title="دانشگاه‌ها" 
             desc="مدیریت تمام دانشگاه‌های دولتی و خصوصی ترکیه، رنکینگ‌ها و گالری تصاویر." 
             icon={GraduationCap} 
             href="/admin/universities" 
           />
           <AdminMenuCard 
             title="برنامه‌های تحصیلی" 
             desc="افزودن و ویرایش رشته‌های کارشناسی، ارشد و دکترا به همراه شهریه و ظرفیت." 
             icon={Database} 
             href="/admin/programs" 
           />
           <AdminMenuCard 
             title="مرکز دانش" 
             desc="نوشتن و انتشار مقالات آموزشی، راهنماهای ویزا و زندگی دانشجویی." 
             icon={FileText} 
             href="/admin/articles" 
           />
           <AdminMenuCard 
             title="شهرها" 
             desc="مدیریت اطلاعات هزینه‌های زندگی، حمل و نقل و جاذبه‌های توریستی شهرها." 
             icon={MapPin} 
             href="/admin/cities" 
           />
           <AdminMenuCard 
             title="بورسیه‌ها" 
             desc="پایگاه داده بورسیه‌های دولتی و خصوصی ترکیه با شرایط پذیرش." 
             icon={BarChart} 
             href="/admin/scholarships" 
           />
           <AdminMenuCard 
             title="تنظیمات سیستم" 
             desc="مدیریت وزن‌های AI، قوانین پذیرش و پیکربندی کلی پلتفرم." 
             icon={Settings} 
             href="/admin/settings" 
           />
        </div>
      </div>
    </div>
  );
}
