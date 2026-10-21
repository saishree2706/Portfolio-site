"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useMode } from "@/context/ModeContext";

export default function ScrollProgress() {
  const { mode } = useMode();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className={`fixed top-0 inset-x-0 h-[2px] origin-left z-[70] ${
        mode === "passion" ? "bg-gradient-to-r from-gold-deep via-gold to-rose" : "bg-accent"
      }`}
    />
  );
}
