"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palmtree, TrendingUp, TrendingDown } from "lucide-react";

const LEAVE_DATA = {
  total: 8,
  lastMonth: 5,
  increase: 3,
  increasePercent: 60,
};

export default function LeaveCountCard() {
  const isPositive = LEAVE_DATA.increase >= 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Palmtree className="w-4 h-4 text-[#4C88C6]" />
          Số lượng nghỉ phép
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="text-center py-3">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-4xl font-bold text-neutral-900 dark:text-white">{LEAVE_DATA.total}</span>
            <span className="text-lg text-neutral-500">người</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Tháng này</p>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Tháng trước</span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {LEAVE_DATA.lastMonth} người
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-amber-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm text-neutral-500 dark:text-neutral-400">So với tháng trước</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${isPositive ? "text-amber-600" : "text-green-600"}`}>
                {isPositive ? "+" : ""}{LEAVE_DATA.increase} người
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                isPositive
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              }`}>
                {isPositive ? "+" : ""}{LEAVE_DATA.increasePercent}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
