"use client";
import Headers from "@/components/layout/Header";
import HeroSection from "./components/HeroSection";
import Problem from "./components/Problem";
import Solution from "./components/Solution";
import Blog from "./components/Blog";
import Subscription from "./components/Supscription";
import AboutQuestion from "./components/AboutQuestion";
import Register from "./components/Register";
import RegisterDialog from "./components/RegisterDialog";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/useMobile";
import { RegisterDialogProvider } from "@/hooks/useRegisterDialog";

export default function Home() {
  const isMobile = useIsMobile();
  return (
    <RegisterDialogProvider>
      <main className="min-h-screen bg-white">
        <Headers />
        <HeroSection />
          <Problem />
        <Solution />
        <Blog />
        <Subscription />
        <AboutQuestion />
        <Register />
        <Footer />
        <RegisterDialog />
      </main>
    </RegisterDialogProvider>
  );
}
