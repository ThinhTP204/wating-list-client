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
import { useIsMobile } from "@/hooks/useMobile";
import { useRegisterDialog } from "@/hooks/useRegisterDialog";
import SparklesIcon from "@/components/ui/sparkles-icon";
import { ChainThemeToggle } from "@/components/ui/chain-theme-toggle";

const navItems = [
  { name: "Trang chủ", link: "/" },
  { name: "Vấn đề gặp phải", link: "#van-de" },
  { name: "Blog", link: "#blog" },
  { name: "Bảng giá", link: "#bang-gia" },
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
              <Button variant="default" className="bg-black dark:bg-white dark:text-black text-white font-bold" onClick={openRegister}>
                Trải nghiệm ngay
                <SparklesIcon size={16} className="ml-1" />
              </Button>
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
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 pt-2">
              <Button
                className="w-full bg-black dark:bg-white dark:text-black rounded-md px-4 py-2 text-base font-bold"
                onClick={() => { setIsMobileMenuOpen(false); openRegister(); }}
              >
                Trải nghiệm ngay
                <SparklesIcon size={16} className="ml-1" />
              </Button>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

    </div>
  );
}
