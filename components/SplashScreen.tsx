"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FancyText } from "@/components/ui/fancy-text";
import { useIsMobile } from "@/hooks/useMobile";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const isMobile = useIsMobile();

  const handleTextComplete = useCallback(() => {
    // Small pause after text animation, then start exit
    setTimeout(() => setIsExiting(true), 600);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {!isExiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          {/* Subtle top gradient */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)]" />

          {/* Main text */}
          <div className="relative flex flex-col items-center gap-2 px-4">
            <FancyText
              className={`${
                isMobile ? "text-4xl" : "text-6xl md:text-8xl lg:text-9xl"
              } font-black leading-none tracking-tighter text-neutral-200`}
              fillClassName="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-black"
              stagger={isMobile ? 0.07 : 0.1}
              duration={isMobile ? 0.9 : 1.2}
              delay={0.3}
              onComplete={handleTextComplete}
            >
              WOKKI TEAM
            </FancyText>

            {/* Subtitle line that appears after a delay */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: isMobile ? 1.2 : 1.6 }}
              className={isMobile ? "mt-2" : "mt-3"}
            >
              <span className={`${
                isMobile ? "text-xs" : "text-sm md:text-base"
              } font-medium tracking-widest uppercase text-neutral-400`}>
                Nền tảng quản lí ca làm #1 Việt Nam
              </span>
            </motion.div>
          </div>

          {/* Bottom loading bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: isMobile ? 1.6 : 2.2,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={`absolute bottom-0 left-0 ${isMobile ? "h-1.5" : "h-1"} w-full origin-left bg-gradient-to-r from-emerald-400 to-cyan-400`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
