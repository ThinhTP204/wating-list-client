"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const tabs = [
  { name: "Tổng quan", tab: "dashboard" },
  { name: "Lịch ca", tab: "calendar" },
  { name: "Nhân viên", tab: "employees" },
  { name: "Chấm công", tab: "time-keeping" },
  { name: "Yêu cầu", tab: "request" },
  { name: "Đổi ca (NV)", tab: "request-user" },
  { name: "Lương", tab: "salary" },
  { name: "Công việc", tab: "task" },
];

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "calendar";

  const handleTabClick = (tab: string) => {
    router.push(`/features?tab=${tab}`);
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
            <nav className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => {
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
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
