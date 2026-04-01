"use client";

import AppShellLayout from "@/components/layout/AppShellLayout";
import type { TabDef } from "@/components/layout/AppShellLayout";

const EMPLOYEE_TABS: TabDef[] = [
  { name: "Lịch ca", tab: "calendar" },
  { name: "Đổi ca", tab: "shift-swap" },
  { name: "Thu nhập", tab: "earnings" },
  { name: "Nhắn tin", tab: "chat" },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShellLayout tabs={EMPLOYEE_TABS} basePath="/employee">
      {children}
    </AppShellLayout>
  );
}
