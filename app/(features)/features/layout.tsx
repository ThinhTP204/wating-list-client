"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut, ShieldCheck, User } from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout, selectUser } from "@/lib/redux/slices/authSlice";

// ── Tab definitions with role access ──────────────────────────────────────────
type Role = "admin" | "user";

const tabs: { name: string; tab: string; roles: Role[] }[] = [
  { name: "Tổng quan",    tab: "dashboard",    roles: ["admin"] },
  { name: "Lịch ca",      tab: "calendar",     roles: ["admin", "user"] },
  { name: "Nhân viên",    tab: "employees",    roles: ["admin"] },
  { name: "Chấm công",    tab: "time-keeping", roles: ["admin"] },
  { name: "Yêu cầu",      tab: "request",      roles: ["admin"] },
  { name: "Đổi ca",       tab: "request-user", roles: ["user"] },
  { name: "Lương",        tab: "salary",       roles: ["admin"] },
  { name: "Công việc",    tab: "task",         roles: ["admin", "user"] },
];

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const role = (user?.role ?? "user") as Role;
  const visibleTabs = tabs.filter((t) => t.roles.includes(role));

  const currentTab = searchParams.get("tab") || visibleTabs[0]?.tab;

  const handleTabClick = (tab: string) => {
    router.push(`/features?tab=${tab}`);
  };

  const handleLogout = () => {
    deleteCookie("auth-token", { path: "/" });
    deleteCookie("user-role", { path: "/" });
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md">
        <div className="px-6">
          <div className="flex items-center gap-6 h-14">
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white"
            >
              wokki
            </Link>

            <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-700 shrink-0" />

            {/* Tabs */}
            <nav className="flex items-center gap-1 overflow-x-auto flex-1">
              {visibleTabs.map((tab) => {
                const isActive = currentTab === tab.tab;
                return (
                  <button
                    key={tab.tab}
                    onClick={() => handleTabClick(tab.tab)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-[#102854] via-[#4C88C6] to-[#1D4D8F] text-white shadow-sm"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
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
                  <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 capitalize">
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
