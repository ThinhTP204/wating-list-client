"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import { useIsMobile } from "@/hooks/useMobile";
import { useRegisterDialog } from "@/hooks/useRegisterDialog";
import SparklesIcon from "@/components/ui/sparkles-icon";
import { ChainThemeToggle } from "@/components/ui/chain-theme-toggle";

const navItems = [
  { name: "Trang chủ", link: "/" },
  { name: "Vấn đề gặp phải", link: "#van-de" },
  { name: "Lợi ích", link: "#blog" },
  { name: "Dịch vụ", link: "#bang-gia" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { open: openRegister } = useRegisterDialog();

  useEffect(() => {
    if (!isMobile) setIsMobileMenuOpen(false);
  }, [isMobile]);

  return (
    <div className="relative w-full sticky top-0 z-50">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          {/* Logo */}
          <Link
            href="/"
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-bold text-black dark:text-white"
          >
            <span className="text-xl font-extrabold tracking-tight">wokki</span>
          </Link>

          <NavItems items={navItems} />

          <div className="relative z-20 flex items-center gap-4">
            <div className="relative">
              <InteractiveHoverButton variant="dark" className="font-bold text-sm" onClick={openRegister}>
                Trải nghiệm ngay
              </InteractiveHoverButton>
              <div className="absolute left-1/2 -translate-x-1/2 top-full z-40 flex flex-col items-center pointer-events-auto">
                <ChainThemeToggle />
              </div>
            </div>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <Link
              href="/"
              className="relative z-20 flex items-center px-2 py-1 text-xl font-extrabold tracking-tight text-black dark:text-white"
            >
              wokki
            </Link>
            <div className="flex items-center gap-2">
              <InteractiveHoverButton
                variant="dark"
                className="font-bold text-xs px-3 py-1"
                onClick={openRegister}
              >
                Trải nghiệm ngay
              </InteractiveHoverButton>
              <div className="relative">
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
                <div className="absolute left-1/2 -translate-x-1/2 top-full z-[60] flex flex-col items-center pointer-events-auto">
                  <ChainThemeToggle />
                </div>
              </div>
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="cursor-pointer relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 pt-2">
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

    </div>
  );
}
