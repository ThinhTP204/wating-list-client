"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut, ShieldCheck, User } from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout, selectUser } from "@/lib/redux/slices/authSlice";
import { cn } from "@/lib/utils";

export interface TabDef {
  name: string;
  tab: string;
}

interface AppShellLayoutProps {
  children: React.ReactNode;
  tabs: TabDef[];
  basePath: string; // e.g. "/admin" | "/employee"
}

export default function AppShellLayout({ children, tabs, basePath }: AppShellLayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const role = user?.role ?? "user";
  const currentTab = searchParams.get("tab") || tabs[0]?.tab;

  const handleTabClick = (tab: string) => {
    router.push(`${basePath}?tab=${tab}`);
  };

  const handleLogout = () => {
    deleteCookie("auth-token", { path: "/" });
    deleteCookie("user-role", { path: "/" });
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md">
        <div className="px-6">
          <div className="flex items-center gap-6 h-14">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-1.5">
              <Image
                src="/WOKKI-LOGO.png"
                alt="Wokki"
                width={90}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
              <span className="text-sm font-extrabold tracking-tight text-neutral-900 dark:text-white">Wokki</span>
            </Link>

            <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-700 shrink-0" />

            {/* Tabs */}
            <nav className="flex items-center gap-1 overflow-x-auto flex-1">
              {tabs.map((tab) => {
                const isActive = currentTab === tab.tab;
                return (
                  <button
                    key={tab.tab}
                    onClick={() => handleTabClick(tab.tab)}
                    className={cn(
                      "shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-[#102854] via-[#4C88C6] to-[#1D4D8F] text-white shadow-sm"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </nav>

            {/* User info + logout */}
            <div className="shrink-0 flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {role === "admin" ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#4C88C6]" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline font-medium text-neutral-700 dark:text-neutral-300">
                    {user.name}
                  </span>
                  <span className="hidden sm:inline px-1.5 py-0.5 rounded text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                    {role === "admin" ? "Admin" : "Nhân viên"}
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
