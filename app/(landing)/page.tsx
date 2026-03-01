"use client";
import { useState } from "react";
import Headers from "@/components/layout/Header";
import HeroSection from "./components/HeroSection";
import Problem from "./components/Problem";
import Blog from "./components/Blog";
import Subscription from "./components/Supscription";
import AboutQuestion from "./components/AboutQuestion";
import Register from "./components/Register";
import RegisterDialog from "./components/RegisterDialog";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/useMobile";
import { RegisterDialogProvider } from "@/hooks/useRegisterDialog";
import SplashScreen from "@/components/SplashScreen";
import Conclusion from "./components/Conclusion";

export default function Home() {
  const isMobile = useIsMobile();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <RegisterDialogProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <main className={`min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 ${showSplash ? "overflow-hidden h-screen" : ""}`}>
        <Headers />
        <HeroSection />
          <Problem />
        <Blog />
        <Subscription />
        <Register />
        <AboutQuestion />
        <Conclusion />
        <Footer />
        <RegisterDialog />
      </main>
    </RegisterDialogProvider>
  );
}
