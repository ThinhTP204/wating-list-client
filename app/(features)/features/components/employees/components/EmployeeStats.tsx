"use client";

import { Employee, STATUS_META } from "./types";

interface EmployeeStatsProps {
  employees: Employee[];
}

export default function EmployeeStats({ employees }: EmployeeStatsProps) {
  const stats = [
    {
      label: "Tổng nhân sự",
      value: employees.length,
      color: "from-[#402093] via-[#8f58e4] to-[#5e34b7]",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: "Đang làm việc",
      value: employees.filter(e => e.status === "active").length,
      color: "from-green-500 to-green-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Thử việc",
      value: employees.filter(e => e.status === "probation").length,
      color: "from-amber-500 to-amber-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Nghỉ phép",
      value: employees.filter(e => e.status === "leave").length,
      color: "from-blue-500 to-blue-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-neutral-950 rounded-xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{stat.label}</span>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
              {stat.icon}
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
