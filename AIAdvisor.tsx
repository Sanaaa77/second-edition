"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Sparkles, User, RefreshCw, HelpCircle } from "lucide-react";
import { PremiumCard, TextStream, MagneticButton } from "@/components/ui/PremiumComponents";
import { useJourney } from "@/hooks/useJourney";

export const AIAdvisor = () => {
  const { user } = useJourney();
  const userName = (user as any).first_name || (user as any).name || "دانشجو";
  const userMajor = (user as any).preferred_major || (user as any).major || "";
  const userBudget = (user.budget || 0).toLocaleString();
  const [messages, setMessages] = useState([
    { id: "1", role: "assistant", content: `سلام ${userName} عزیز! من تمام سوابق و اهداف تو رو بررسی کردم. با بودجه ${userBudget} دلاریت، گزینه‌های خیلی خوبی در استانبول داریم. چه سوالی داری؟` }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: `خیالت راحت باشه، برای رشته ${userMajor} در دانشگاه‌های خصوصی ترکیه، معدل ${user.gpa} تو کاملاً رقابتیه. پیشنهاد می‌کنم تمرکزمون رو روی گرفتن بورسیه حداکثری بذاریم.` 
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div id="ai-advisor" className="w-full max-w-4xl mx-auto py-12 px-6">
      <PremiumCard className="h-[700px] flex flex-col p-0 overflow-hidden relative border-white/10 group">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="glass px-4 py-1.5 rounded-full flex items-center gap-2 border-white/5 shadow-2xl">
            <HelpCircle className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-bold opacity-60">نکته: من می‌تونم شانس بورسیه رو بر اساس معدل ${user.gpa} شما تخمین بزنم.</span>
          </div>
        </div>
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Bot className="w-6 h-6" />
            </div>
            <div className="text-right">
              <h3 className="text-xl font-black">AI Advisor</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Active Context: {userName}
              </div>
            </div>
          </div>
          <button className="p-3 hover:bg-white/5 rounded-xl opacity-30">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
          <AnimatePresence mode="popLayout">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} items-end gap-4`}
              >
                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 opacity-40" />
                  </div>
                )}
                
                <div className={`max-w-[80%] p-6 rounded-[2rem] text-sm leading-relaxed text-right ${
                  m.role === 'user' 
                    ? "bg-white/5 rounded-br-none border border-white/10" 
                    : "bg-primary text-white rounded-bl-none"
                }`}>
                  {m.role === 'assistant' ? <TextStream text={m.content} /> : m.content}
                </div>

                {m.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}

            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-end gap-4"
              >
                <div className="bg-primary/10 p-6 rounded-[2rem] rounded-bl-none flex gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="w-2 h-2 bg-primary rounded-full" 
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="p-8 bg-white/[0.02] border-t border-white/5">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="چیزی بپرسید..." 
              className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl pr-8 pl-24 outline-none focus:border-primary font-bold text-lg text-right"
            />
            <div className="absolute left-3">
              <MagneticButton onClick={handleSend} className="w-14 h-14 rounded-2xl">
                <Send className="w-5 h-5 rotate-180" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
};
