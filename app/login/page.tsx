"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/auth";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, Mail, Lock, Chrome, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { loginSchema, signUpSchema, LoginFormValues, SignUpFormValues } from "@/lib/validation/auth";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : signUpSchema) as any,
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error } = await authService.signIn(data.email, data.password);
        if (error) throw new Error(error.message);
        router.push("/dashboard");
      } else {
        const { error } = await authService.signUp(data.email, data.password, data.name || "");
        if (error) throw new Error(error.message);
        setSuccess("ایمیل تایید برای شما ارسال شد. لطفاً صندوق ورودی خود را چک کنید.");
      }
    } catch (err: any) {
      setError(err.message || "خطایی رخ داده است.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await authService.signInWithGoogle();
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#030712] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full -z-10" />
      
      <PremiumCard className="max-w-md w-full p-10 space-y-8 border-white/5 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter">
            {isLogin ? "خوش آمدید" : "ساخت حساب کاربری"}
          </h1>
          <p className="opacity-40 text-sm font-medium">
            {isLogin ? "برای دسترسی به پنل هوشمند وارد شوید." : "سفر تحصیلی خود را از اینجا شروع کنید."}
          </p>
        </div>

        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setIsLogin(true)}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-black transition-all",
              isLogin ? "bg-primary text-white" : "opacity-40 hover:opacity-100"
            )}
          >
            ورود
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-black transition-all",
              !isLogin ? "bg-primary text-white" : "opacity-40 hover:opacity-100"
            )}
          >
            ثبت‌نام
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2 text-right">
              <label className="text-[10px] font-black uppercase opacity-30 tracking-widest px-1">نام و نام خانوادگی</label>
              <div className="relative">
                <input 
                  {...register("name")}
                  className={cn(
                    "w-full bg-white/5 border p-4 pr-12 rounded-2xl outline-none focus:border-primary font-bold transition-all",
                    errors.name ? "border-red-500/50" : "border-white/10"
                  )} 
                  placeholder="مثلاً سارا کریمی"
                />
                <UserPlus className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20" />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 font-bold px-1">{errors.name.message}</p>}
            </div>
          )}
          
          <div className="space-y-2 text-right">
            <label className="text-[10px] font-black uppercase opacity-30 tracking-widest px-1">ایمیل</label>
            <div className="relative">
              <input 
                {...register("email")}
                type="email"
                className={cn(
                  "w-full bg-white/5 border p-4 pr-12 rounded-2xl outline-none focus:border-primary font-bold transition-all",
                  errors.email ? "border-red-500/50" : "border-white/10"
                )} 
                placeholder="example@mail.com"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20" />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 font-bold px-1">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-2 text-right">
            <div className="flex justify-between items-center px-1">
              {isLogin && <button type="button" className="text-[10px] font-bold text-primary hover:underline">فراموشی رمز عبور؟</button>}
              <label className="text-[10px] font-black uppercase opacity-30 tracking-widest">رمز عبور</label>
            </div>
            <div className="relative">
              <input 
                {...register("password")}
                type="password" 
                className={cn(
                  "w-full bg-white/5 border p-4 pr-12 rounded-2xl outline-none focus:border-primary font-bold transition-all",
                  errors.password ? "border-red-500/50" : "border-white/10"
                )} 
                placeholder="••••••••"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20" />
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold px-1">{errors.password.message}</p>}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs text-center font-bold">
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-xs text-center font-bold">
              {success}
            </motion.div>
          )}

          <MagneticButton 
            className="w-full py-5 rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-3"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? "ورود به سیستم" : "ساخت حساب")}
          </MagneticButton>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-[#030712] px-4 opacity-20">یا ادامه دهید با</span></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full py-4 rounded-2xl border border-white/10 flex items-center justify-center gap-3 font-bold hover:bg-white/5 transition-all text-sm"
        >
          <Chrome className="w-5 h-5" />
          <span>Google</span>
        </button>

        {isLogin && (
          <p className="text-center text-xs opacity-40 font-medium">
            حسابی ندارید؟ <button onClick={() => setIsLogin(false)} className="text-primary font-bold hover:underline">ثبت‌نام کنید</button>
          </p>
        )}
      </PremiumCard>
    </main>
  );
}
