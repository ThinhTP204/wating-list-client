"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { DollarSign } from "lucide-react";

const SALARY_DATA = [
  { month: "T10", salary: 42 },
  { month: "T11", salary: 45 },
  { month: "T12", salary: 48 },
  { month: "T1", salary: 44 },
  { month: "T2", salary: 47 },
  { month: "T3", salary: 51 },
];

const chartConfig: ChartConfig = {
  salary: {
    label: "Lương (triệu)",
    color: "#8f58e4",
  },
};

export default function SalaryChartCard() {
  const currentMonth = SALARY_DATA[SALARY_DATA.length - 1];
  const prevMonth = SALARY_DATA[SALARY_DATA.length - 2];
  const diff = currentMonth.salary - prevMonth.salary;
  const diffPercent = Math.round((diff / prevMonth.salary) * 100);

  return (
    <Card className="flex h-100 flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <DollarSign className="w-4 h-4 text-[#8f58e4]" />
          Biểu đồ lương
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-bold text-neutral-900 dark:text-white">
              {currentMonth.salary}M
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
              diffPercent >= 0
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}>
              {diffPercent >= 0 ? "+" : ""}{diffPercent}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <ChartContainer config={chartConfig} className="w-full h-60">
          <BarChart data={SALARY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}M`}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => [`${value} triệu`, "Lương"]} />}
            />
            <Bar
              dataKey="salary"
              fill="url(#salaryGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8f58e4" />
                <stop offset="100%" stopColor="#402093" />
              </linearGradient>
            </defs>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
