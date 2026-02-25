"use client";
import Headers from "@/components/layout/Header";
import HeroSection from "./components/HeroSection";
import Problem from "./components/Problem";
import Blog from "./components/Blog";
import AboutUs from "./components/AboutUs";
import Register from "./components/Register";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/useMobile";

export default function Home() {
  const isMobile = useIsMobile();
  return (
    <main className="min-h-screen bg-white">
      <Headers />
      <HeroSection />
      <div className={`${isMobile ? "px-4" : "pt-200"}`}>
        <Problem />
      </div>
      <Blog />
      <AboutUs />
      <Register />
      <Footer />
    </main>
  );
}
