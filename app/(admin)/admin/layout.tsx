"use client";

import AppShellLayout from "@/components/layout/AppShellLayout";
import type { TabDef } from "@/components/layout/AppShellLayout";

const ADMIN_TABS: TabDef[] = [
  { name: "Tổng quan",  tab: "dashboard"    },
  { name: "Lịch ca",    tab: "calendar"     },
  { name: "Nhân viên",  tab: "employees"    },
  { name: "Chấm công",  tab: "time-keeping" },
  { name: "Yêu cầu",    tab: "request"      },
  { name: "Lương",      tab: "salary"       },
  { name: "Công việc",  tab: "task"         },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShellLayout tabs={ADMIN_TABS} basePath="/admin">
      {children}
    </AppShellLayout>
  );
}
