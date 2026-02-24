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

const navItems = [
  { name: "Trang chủ", link: "/" },
  { name: "Vấn đề gặp phải", link: "#van-de" },
  { name: "Blog", link: "#blog" },
  { name: "Về chúng tôi", link: "#ve-chung-toi" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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

          <div className="flex items-center gap-4">
            <Button variant="default" className="bg-black text-white font-bold" asChild>
              <a href="#dang-ky">Trải nghiệm ngay</a>
            </Button>
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
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
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
                className="w-full bg-black rounded-md px-4 py-2 text-base font-bold"
                asChild
              >
                <a href="#dang-ky" onClick={() => setIsMobileMenuOpen(false)}>
                  Trải nghiệm ngay
                </a>
              </Button>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
