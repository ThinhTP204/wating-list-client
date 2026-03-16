"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Clock } from "lucide-react";

const ATTENDANCE_DATA = [
  { name: "Đúng giờ", value: 45, color: "#22c55e" },
  { name: "Trễ giờ", value: 12, color: "#f59e0b" },
  { name: "Không chấm công", value: 3, color: "#ef4444" },
];

const chartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
};

export default function AttendanceChartCard() {
  const total = ATTENDANCE_DATA.reduce((sum, item) => sum + item.value, 0);
  const onTimePercent = Math.round((ATTENDANCE_DATA[0].value / total) * 100);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Clock className="w-4 h-4 text-[#8f58e4]" />
          Thống kê chấm công hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center pt-0">
        <div className="flex items-center justify-between w-full gap-8 pl-4">
          {/* Chart */}
          <div className="shrink-0 w-[120px] h-[120px]">
            <ChartContainer config={chartConfig} className="h-[120px] w-[120px]">
              <PieChart>
                <Pie
                  data={ATTENDANCE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={48}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {ATTENDANCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 px-3 py-2 text-xs">
                          <p className="font-medium">{payload[0].name}</p>
                          <p className="text-neutral-500">{payload[0].value} người</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ChartContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-4 pr-2">
            {ATTENDANCE_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">{item.value}</span>
                  <span className="text-[10px] text-neutral-400">người</span>
                </div>
              </div>
            ))}
            <div className="pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-neutral-500">Tổng cộng</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">{total} người</span>
              </div>
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-neutral-500">Tỷ lệ đúng giờ</span>
                <span className="text-sm font-bold text-green-600">{onTimePercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
