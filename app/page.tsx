"use client";
import React, { useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { DecisionCenter } from '@/components/decision/DecisionCenter';
import { ExecutiveDashboard } from '@/features/dashboard/ExecutiveDashboard';
import { UniversityExplorer } from '@/components/universities/UniversityExplorer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { JourneyProvider } from '@/context/JourneyContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { CostCalculator } from '@/components/calculators/CostCalculator';
import { ScholarshipSearch } from '@/components/scholarships/ScholarshipSearch';
import { AcademyDashboard } from '@/components/academy/AcademyDashboard';
import { ChevronLeft } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1
    }
  }
});

export default function ProductionApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <JourneyProvider>
        <main className="min-h-screen bg-[#030712] selection:bg-primary/30">
          <Navbar />

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="space-y-0"
            >
              <Hero />
              
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
                <Stats />
              </motion.div>

              <section id="dashboard" className="scroll-mt-24 pt-20">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-end mb-12">
                   <div className="text-right">
                      <h2 className="text-4xl font-black text-foreground">داشبورد شما</h2>
                      <p className="text-muted mt-2">مدیریت هوشمند مسیر مهاجرت.</p>
                   </div>
                   <Link href="/dashboard" className="flex items-center gap-2 text-primary font-bold hover:underline">
                      ورود به پنل کامل <ChevronLeft className="w-4 h-4 rotate-180" />
                   </Link>
                </div>
                <ErrorBoundary>
                  <ExecutiveDashboard />
                </ErrorBoundary>
              </section>

              <section id="universities" className="py-40 px-6 scroll-mt-24">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-end mb-16">
                     <div className="text-right">
                        <h2 className="text-4xl lg:text-6xl font-black text-foreground">اکتشاف دانشگاه‌ها</h2>
                        <p className="text-muted mt-4">برترین مراکز آموزشی ترکیه را پیدا کنید.</p>
                     </div>
                     <Link href="/universities" className="text-primary font-bold hover:underline">مشاهده همه</Link>
                  </div>
                  <ErrorBoundary>
                    <UniversityExplorer />
                  </ErrorBoundary>
                </div>
              </section>

              <section id="academy" className="py-40 px-6 bg-white/[0.01] scroll-mt-24 border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-end mb-16">
                     <div className="text-right">
                        <h2 className="text-4xl lg:text-6xl font-black text-primary">آکادمی آمادگی</h2>
                        <p className="text-muted mt-4">آمادگی استراتژیک برای پذیرش و زبان.</p>
                     </div>
                     <Link href="/academy" className="text-primary font-bold hover:underline">ورود به آکادمی</Link>
                  </div>
                  <ErrorBoundary>
                    <AcademyDashboard />
                  </ErrorBoundary>
                </div>
              </section>

              <section id="intelligence" className="scroll-mt-24 py-40">
                <div className="max-w-7xl mx-auto px-6 mb-16 text-right">
                   <h2 className="text-4xl lg:text-6xl font-black text-foreground">مرکز تصمیم‌گیری</h2>
                   <p className="text-muted mt-4">تحلیل هوشمند شانس پذیرش شما.</p>
                </div>
                <ErrorBoundary>
                  <DecisionCenter />
                </ErrorBoundary>
              </section>

              <section id="scholarships" className="py-40 px-6 bg-white/[0.01] scroll-mt-24 border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-end mb-16">
                     <div className="text-right">
                        <h2 className="text-4xl lg:text-6xl font-black text-accent">بورسیه‌های تحصیلی</h2>
                        <p className="text-muted mt-4">فرصت‌های طلایی برای کاهش هزینه‌ها.</p>
                     </div>
                     <Link href="/scholarships" className="text-primary font-bold hover:underline">جستجوی بورسیه</Link>
                  </div>
                  <ErrorBoundary>
                    <ScholarshipSearch />
                  </ErrorBoundary>
                </div>
              </section>

              <section id="costs" className="py-40 scroll-mt-24">
                 <div className="max-w-7xl mx-auto px-6 mb-16 text-right">
                   <h2 className="text-4xl lg:text-6xl font-black text-foreground">هزینه‌های زندگی</h2>
                   <p className="text-muted mt-4">برآورد دقیق مخارج ماهانه در ترکیه.</p>
                </div>
                <ErrorBoundary>
                  <CostCalculator />
                </ErrorBoundary>
              </section>

              <section className="py-40 text-center space-y-10">
                <h2 className="text-6xl lg:text-[10rem] font-black text-foreground tracking-tighter opacity-10 uppercase">
                  Future OS.
                </h2>
                <p className="text-muted font-bold uppercase tracking-[0.4em]">TurkeyHub is ready for your journey.</p>
                <Link href="/login">
                   <button className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all">
                      همین حالا شروع کنید
                   </button>
                </Link>
              </section>
            </motion.div>
          </AnimatePresence>

          <footer className="bg-[#010309] py-32 px-6 border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] pointer-events-none" />
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-32">
              <div className="col-span-2 text-right">
                <div className="flex items-center gap-4 mb-12 justify-end">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl">TH</div>
                  <span className="text-4xl font-black tracking-tighter text-foreground">TurkeyHub</span>
                </div>
                <p className="opacity-30 text-2xl leading-relaxed max-w-sm ml-auto text-foreground">ما با استفاده از تکنولوژی، مسیر تحصیل و اشتغال شما در ترکیه را هموار می‌کنیم.</p>
              </div>
              <div className="text-right">
                <h4 className="font-black opacity-20 text-[10px] uppercase tracking-[0.3em] mb-12 text-foreground text-right">Platform</h4>
                <ul className="space-y-8 font-black text-xl opacity-60">
                  <li><Link href="/universities" className="hover:text-primary transition-all text-foreground">University Search</Link></li>
                  <li><Link href="/cost-of-living" className="hover:text-primary transition-all text-foreground">Budget Intelligence</Link></li>
                  <li><Link href="/decision-center" className="hover:text-primary transition-all text-foreground">AI Consulting</Link></li>
                  <li><Link href="/academy" className="hover:text-primary transition-all text-foreground">Language Academy</Link></li>
                </ul>
              </div>
              <div className="text-right">
                <h4 className="font-black opacity-20 text-[10px] uppercase tracking-[0.3em] mb-12 text-foreground text-right">Company</h4>
                <ul className="space-y-8 font-black text-lg opacity-60">
                  <li><Link href="/about" className="hover:text-primary transition-all text-foreground">About Us</Link></li>
                  <li><Link href="/blog" className="hover:text-primary transition-all text-foreground">Journal</Link></li>
                  <li><Link href="/contact" className="hover:text-primary transition-all text-foreground">Contact</Link></li>
                  <li><Link href="/scholarships" className="hover:text-primary transition-all text-foreground">Scholarships</Link></li>
                </ul>
              </div>
            </div>
          </footer>
        </main>
      </JourneyProvider>
    </QueryClientProvider>
  );
}
