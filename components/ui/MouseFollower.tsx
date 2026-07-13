"use client";
import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const MouseFollower = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const springConfig = { damping: 30, stiffness: 200 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX - 200);
      y.set(e.clientY - 200);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      style={{
        left: x,
        top: y,
      }}
      className="fixed w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0 hidden lg:block"
    />
  );
};
