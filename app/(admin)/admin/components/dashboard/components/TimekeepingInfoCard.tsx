"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fingerprint, CheckCircle, Clock } from "lucide-react";

const TIMEEPING_INFO = [
  { label: "Check-in sáng", value: "07:05", status: "late", icon: Clock },
  { label: "Check-out sáng", value: "11:58", status: "normal", icon: CheckCircle },
  { label: "Check-in chiều", value: "13:02", status: "late", icon: Clock },
  { label: "Check-out chiều", value: "18:00", status: "normal", icon: CheckCircle },
];

const STATUS_CONFIG = {
  normal: {
    text: "Đúng giờ",
    textColor: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-500",
  },
  late: {
    text: "Trễ 5p",
    textColor: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-500",
  },
  missing: {
    text: "Chưa chấm",
    textColor: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-500",
  },
};

export default function TimekeepingInfoCard() {
  const onTimeCount = TIMEEPING_INFO.filter((item) => item.status === "normal").length;
  const lateCount = TIMEEPING_INFO.filter((item) => item.status === "late").length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Fingerprint className="w-4 h-4 text-[#4C88C6]" />
          Thông tin chấm công hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-3">
        {TIMEEPING_INFO.map((item, index) => {
          const config = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-800"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${config.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.label}</p>
                  <p className={`text-xs ${config.textColor}`}>{config.text}</p>
                </div>
              </div>
              <span className="text-lg font-bold text-neutral-900 dark:text-white">{item.value}</span>
            </div>
          );
        })}

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-neutral-500">Đúng giờ: </span>
            <span className="text-xs font-semibold text-neutral-900 dark:text-white">{onTimeCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-neutral-500">Trễ: </span>
            <span className="text-xs font-semibold text-neutral-900 dark:text-white">{lateCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
