"use client";

import BackgroundRippleEffectDemo from "@/components/background-ripple-effect-demo";
import { useIsMobile } from "@/hooks/useMobile";

export default function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <>
      <BackgroundRippleEffectDemo />
    </>
  );
}

