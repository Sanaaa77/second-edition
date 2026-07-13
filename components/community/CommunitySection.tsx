"use client";
import React from "react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { 
  MessageCircle, 
  Heart, 
  Share2,
  MoreHorizontal
} from "lucide-react";

const FORUM_POSTS = [
  {
    author: "علی محمدی",
    avatar: "https://i.pravatar.cc/100?u=ali",
    uni: "ITU",
    content: "کسی تجربه گرفتن خوابگاه دولتی KYK در استانبول رو داره؟ چقدر طول کشید جوابش بیاد؟",
    likes: 24,
    replies: 12,
    time: "۲ ساعت پیش"
  },
  {
    author: "مریم احمدی",
    avatar: "https://i.pravatar.cc/100?u=maryam",
    uni: "Koc",
    content: "امروز ویزای تحصیلی من اومد! خوشحال میشم اگه کسی سوالی درباره پروسه سفارت در تهران داره بتونم کمک کنم.",
    likes: 156,
    replies: 45,
    time: "۵ ساعت پیش"
  }
];

export const CommunitySection = () => {
  return (
    <section id="community" className="py-24 px-6 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 text-right">
            <span className="text-primary font-black tracking-widest uppercase text-sm mb-4 block">جامعه دانشجویی ترکیه هاب</span>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">شما تنها <br /><span className="text-primary">نیستید.</span></h2>
            <p className="opacity-50 text-xl leading-relaxed mb-12">
              به شبکه‌ای متشکل از ۱۲,۰۰۰ دانشجوی ایرانی در ترکیه بپیوندید. تجربه بگیرید، سوال بپرسید و دوستان جدید پیدا کنید.
            </p>
            
            <div className="flex gap-4">
              <button className="bg-primary px-8 py-4 rounded-2xl font-black text-white shadow-xl shadow-primary/20">عضویت در انجمن</button>
              <button className="glass px-8 py-4 rounded-2xl font-black">مشاهده گروه‌ها</button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {FORUM_POSTS.map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <PremiumCard className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 overflow-hidden">
                        <img src={post.avatar} alt={post.author} />
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {post.author}
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] rounded-full uppercase font-black">{post.uni}</span>
                        </div>
                        <div className="text-[10px] opacity-40 font-bold">{post.time}</div>
                      </div>
                    </div>
                    <button className="opacity-20 hover:opacity-100 transition-opacity">
                      <MoreHorizontal />
                    </button>
                  </div>
                  
                  <p className="text-lg leading-relaxed mb-8 opacity-80">{post.content}</p>
                  
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-6">
                      <button className="flex items-center gap-2 text-xs font-bold opacity-40 hover:text-red-500 hover:opacity-100 transition-all">
                        <Heart className="w-4 h-4" /> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-xs font-bold opacity-40 hover:text-primary hover:opacity-100 transition-all">
                        <MessageCircle className="w-4 h-4" /> {post.replies} پاسخ
                      </button>
                    </div>
                    <button className="opacity-20 hover:opacity-100 transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
