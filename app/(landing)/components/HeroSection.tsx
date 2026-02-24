"use client";

import BackgroundRippleEffectDemo from "@/components/background-ripple-effect-demo";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { useIsMobile } from "@/hooks/useMobile";

export default function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <>
      <BackgroundRippleEffectDemo />
      {!isMobile && <MacbookScroll />}
    </>
  );
}

