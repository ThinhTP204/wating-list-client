"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, UserX, Palmtree } from "lucide-react";

const WORKING_STATS = [
  {
    label: "Đang làm việc",
    value: 38,
    icon: Users,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
    dot: "bg-green-500",
  },
  {
    label: "Đi muộn",
    value: 5,
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    dot: "bg-amber-500",
  },
  {
    label: "Chưa vào ca",
    value: 7,
    icon: UserX,
    color: "text-red-600",
    bg: "bg-red-100 dark:bg-red-900/30",
    dot: "bg-red-500",
  },
  {
    label: "Nghỉ phép",
    value: 3,
    icon: Palmtree,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    dot: "bg-blue-500",
  },
];

export default function StaffWorkingCard() {
  const total = WORKING_STATS.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Users className="w-4 h-4 text-[#8f58e4]" />
          Ai đang làm việc
          <span className="ml-auto text-xs text-neutral-500 font-normal">Tổng: {total} người</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-3">
          {WORKING_STATS.map((stat) => {
            const Icon = stat.icon;
            const percent = Math.round((stat.value / total) * 100);
            return (
              <div
                key={stat.label}
                className="flex flex-col gap-2 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${stat.dot} animate-pulse`} />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                </div>
                <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stat.dot}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
