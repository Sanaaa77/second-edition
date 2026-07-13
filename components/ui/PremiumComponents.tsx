"use client";
import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface MagneticButtonProps {
  variant?: "primary" | "glass" | "accent";
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

/**
 * Premium Magnetic Interaction for Buttons
 */
export const MagneticButton = React.memo(({ 
  children, 
  className, 
  onClick, 
  variant = "primary",
  disabled,
  type = "button"
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.4);
    y.set((clientY - centerY) * 0.4);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const variantClasses = useMemo(() => {
    switch(variant) {
      case "primary": return "bg-primary text-white";
      case "accent": return "bg-accent text-white";
      case "glass": return "glass text-foreground";
      default: return "bg-primary text-white";
    }
  }, [variant]);

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "relative group flex items-center justify-center transition-all duration-300 rounded-button",
        variantClasses,
        className
      )}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[inherit]" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
});

MagneticButton.displayName = "MagneticButton";

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Premium Card with Mouse Lighting & Tilt
 */
export const PremiumCard = React.memo(({ children, className }: PremiumCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    let { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }, [mouseX, mouseY]);

  const backgroundRadial = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(99,102,241,0.06), transparent 40%)`
  );

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative group glass p-8 rounded-card border border-white/10 overflow-hidden",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background: backgroundRadial }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
});

PremiumCard.displayName = "PremiumCard";

/**
 * Apple-style Smooth Text Streaming
 */
export const TextStream = React.memo(({ text }: { text: string }) => {
  const words = useMemo(() => text.split(" "), [text]);
  return (
    <div className="flex flex-wrap gap-x-[0.3em] gap-y-1">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
});

TextStream.displayName = "TextStream";

/**
 * Success Celebration Component
 */
export const SuccessMoments = React.memo(({ show, onComplete }: { show: boolean; onComplete: () => void }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm" />
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="glass p-12 rounded-card border-primary/30 flex flex-col items-center gap-6 shadow-2xl"
          >
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary/40">
              <Check className="w-12 h-12" strokeWidth={3} />
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-black mb-2 tracking-tight text-foreground text-right">عملیات با موفقیت انجام شد!</h3>
              <p className="text-muted font-bold uppercase tracking-widest text-[10px]">Your journey is accelerating.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SuccessMoments.displayName = "SuccessMoments";

export const AnimatedCounter = React.memo(({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = (totalMiliseconds / (end || 1)) * 5;

    let timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, Math.max(incrementTime, 20));

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString('fa-IR')}</span>;
});

AnimatedCounter.displayName = "AnimatedCounter";
