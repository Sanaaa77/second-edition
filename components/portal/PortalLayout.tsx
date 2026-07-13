"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Send, 
  Clock, 
  CreditCard, 
  Settings, 
  User, 
  Bell, 
  HelpCircle,
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  { id: "overview", icon: <LayoutDashboard />, label: "داشبورد" },
  { id: "apps", icon: <Send />, label: "اپلیکیشن‌ها", badge: 2 },
  { id: "docs", icon: <FileText />, label: "مدارک من" },
  { id: "timeline", icon: <Clock />, label: "نقشه راه" },
  { id: "payments", icon: <CreditCard />, label: "پرداخت‌ها" },
  { id: "settings", icon: <Settings />, label: "تنظیمات" },
];

export const PortalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-[#030712] overflow-hidden text-foreground">
      {/* Sidebar */}
      <aside className="w-80 border-l border-white/5 bg-white/[0.01] flex flex-col p-8 z-50">
        <div className="flex items-center gap-4 mb-16 px-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl">TH</div>
          <span className="text-2xl font-black tracking-tighter">TurkeyHub</span>
        </div>

        <nav className="flex-1 space-y-4">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold group",
                item.id === "overview" ? "bg-primary/10 text-primary border border-primary/20" : "opacity-40 hover:opacity-100 hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-4">
                <span className={cn("transition-colors", item.id === "overview" ? "text-primary" : "text-white/40 group-hover:text-white")}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5 mt-auto">
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl opacity-40 hover:opacity-100 transition-all font-bold hover:bg-red-500/10 hover:text-red-500">
            <LogOut className="w-5 h-5" />
            <span>خروج از حساب</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-y-auto no-scrollbar">
        {/* Top Header */}
        <header className="px-12 py-8 flex items-center justify-between sticky top-0 bg-[#030712]/80 backdrop-blur-md z-40">
          <div>
            <h2 className="text-3xl font-black tracking-tight">پنل دانشجو</h2>
            <p className="text-xs opacity-40 font-bold uppercase tracking-widest mt-1">Status: All systems functional</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 glass p-2 rounded-full border border-white/10 px-6">
              <div className="text-right">
                <div className="text-xs font-black">سارا کریمی</div>
                <div className="text-[10px] opacity-40 uppercase font-bold tracking-widest">Premium Student</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden border border-primary/20">
                <img src="https://i.pravatar.cc/100?u=sara" alt="User" />
              </div>
              <ChevronRight className="w-4 h-4 opacity-40 rotate-90" />
            </div>
            <div className="relative">
              <Bell className="w-6 h-6 opacity-40 cursor-pointer hover:opacity-100 transition-opacity" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background" />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="px-12 pb-12">
          {children}
        </div>
      </main>
    </div>
  );
};
