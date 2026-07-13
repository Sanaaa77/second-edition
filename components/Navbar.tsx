"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe, Menu, X, Phone, MessageSquare, LayoutDashboard, LogIn } from "lucide-react";
import { useJourney } from "@/hooks/useJourney";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, progress } = useJourney();
  const { user: authUser } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "دانشگاه‌ها", href: "/universities" },
    { label: "هزینه‌ها", href: "/cost-of-living" },
    { label: "ابزارها", href: "/tools" },
    { label: "آکادمی", href: "/academy" },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6",
        scrolled ? "py-3" : "py-6"
      )}>
        <div className={cn(
          "max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 rounded-full px-6",
          scrolled ? "glass py-3 shadow-2xl" : "bg-transparent py-0"
        )}>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">TH</div>
              <span className="text-xl font-black tracking-tighter hidden sm:block">TurkeyHub</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-bold opacity-60">
            {navLinks.map(link => (
               <Link key={link.href} href={link.href} className={cn("hover:text-primary transition-colors", pathname === link.href && "text-primary opacity-100")}>
                 {link.label}
               </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
             {/* Progress Indicator */}
             {authUser && (
               <div className="hidden md:flex items-center gap-3 glass px-4 py-2 rounded-full border-white/5 mr-4">
                  <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-primary" />
                  </div>
                  <span className="text-[10px] font-black opacity-40">{Math.round(progress)}%</span>
               </div>
             )}

            {authUser ? (
              <Link href="/dashboard" className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-black transition-all shadow-xl hover:scale-105 flex items-center gap-2">
                 <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">پنل {(user as any).first_name || (user as any).name || "دانشجو"}</span>
              </Link>
            ) : (
              <Link href="/login" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-black transition-all shadow-xl hover:scale-105 flex items-center gap-2">
                <LogIn className="w-4 h-4" /> <span>ورود</span>
              </Link>
            )}
            
            <button className="lg:hidden p-2 glass rounded-xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }} 
            className="fixed inset-0 z-[90] glass pt-32 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-6 text-center text-2xl font-black">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>{link.label}</Link>
              ))}
              <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                {authUser ? (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="bg-primary py-4 rounded-2xl text-white">پنل کاربری</Link>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="bg-white text-black py-4 rounded-2xl">ورود به سیستم</Link>
                )}
                <div className="flex justify-center gap-6 opacity-40 py-4">
                   <Phone />
                   <MessageSquare />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
