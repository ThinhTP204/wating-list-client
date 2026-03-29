"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
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
  { name: "Mô hình", link: "/features", requireAuth: true },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { open: openRegister } = useRegisterDialog();
  const router = useRouter();

  useEffect(() => {
    if (!isMobile) setIsMobileMenuOpen(false);
  }, [isMobile]);

  const handleAuthNav = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    const token = getCookie("auth-token");
    if (token) {
      if (link === "/features") {
        const role = getCookie("user-role");
        router.push(role === "admin" ? "/admin?tab=dashboard" : "/employee?tab=calendar");
      } else {
        router.push(link);
      }
    } else {
      router.push(`/login?callbackUrl=${encodeURIComponent(link)}`);
    }
  };

  return (
    <div className="relative w-full sticky top-0 z-50">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          {/* Logo */}
          <Link href="/" className="relative z-20 mr-4 flex items-center gap-1.5 px-2 py-1">
            <Image
              src="/WOKKI-LOGO.png"
              alt="Wokki"
              width={90}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
            <span className="text-xl font-extrabold tracking-tight text-black dark:text-white">wokki</span>
          </Link>

          <NavItems
            items={navItems}
            onItemClick={(item, e) => {
              if (item.requireAuth) {
                handleAuthNav(e as React.MouseEvent<HTMLAnchorElement>, item.link);
              }
            }}
          />

          <div className="relative z-20 flex items-center gap-4">
            <div className="relative">
              <InteractiveHoverButton
                variant="dark"
                className="font-bold text-sm"
                onClick={openRegister}
              >
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
            <Link href="/" className="relative z-20 flex items-center gap-1.5 px-2 py-1">
              <Image
                src="/WOKKI-LOGO.png"
                alt="Wokki"
                width={90}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <span className="text-xl font-extrabold tracking-tight text-black dark:text-white">wokki</span>
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

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.requireAuth ? undefined : item.link}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (item.requireAuth) handleAuthNav(e, item.link);
                }}
                className="cursor-pointer relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 pt-2"></div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
