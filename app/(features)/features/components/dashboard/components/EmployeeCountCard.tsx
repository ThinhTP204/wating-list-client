"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, TrendingUp, TrendingDown } from "lucide-react";

const EMPLOYEE_DATA = {
  total: 53,
  lastMonth: 48,
  increase: 5,
  increasePercent: 10.4,
};

export default function EmployeeCountCard() {
  const isPositive = EMPLOYEE_DATA.increase >= 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <UserPlus className="w-4 h-4 text-[#4C88C6]" />
          Số lượng nhân viên
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="text-center py-3">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-4xl font-bold text-neutral-900 dark:text-white">{EMPLOYEE_DATA.total}</span>
            <span className="text-lg text-neutral-500">người</span>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Tháng trước</span>
            </div>
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {EMPLOYEE_DATA.lastMonth} người
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Tăng thêm</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? "+" : ""}{EMPLOYEE_DATA.increase} người
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                isPositive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {isPositive ? "+" : ""}{EMPLOYEE_DATA.increasePercent}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
