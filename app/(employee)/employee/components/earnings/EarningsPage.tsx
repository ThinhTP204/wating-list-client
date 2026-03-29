"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Wallet,
  CalendarDays,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DailyEntry {
  day: number;
  label: string; // "01", "02", ...
  earned: number; // amount earned on this day (0 if weekend/holiday)
  cumulative: number; // running total
  type: "worked" | "weekend" | "holiday" | "future";
}

interface SalaryComponent {
  label: string;
  amount: number;
  color: string;
  bg: string;
}

// ─── Mock data helpers ────────────────────────────────────────────────────────

const TODAY = new Date(2026, 2, 29); // March 29 2026

function buildMonthData(year: number, month: number): DailyEntry[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayDay =
    year === TODAY.getFullYear() && month === TODAY.getMonth() + 1 ? TODAY.getDate() : 0;

  // Public holidays for demo (March)
  const holidays = new Set<number>([]);

  // Working days in this month (Mon–Sat pattern for demo)
  const workingDays: number[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month - 1, d).getDay(); // 0=Sun
    if (dow !== 0 && !holidays.has(d)) workingDays.push(d);
  }

  const basicSalary = 15_000_000;
  const allowances = 1_200_000;
  const totalMonthly = basicSalary + allowances;
  const dailyRate = totalMonthly / workingDays.length;

  let cumulative = 0;
  const entries: DailyEntry[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month - 1, d).getDay();
    const isWeekend = dow === 0;
    const isHoliday = holidays.has(d);
    const isFuture = todayDay > 0 && d > todayDay;

    let type: DailyEntry["type"] = "worked";
    let earned = 0;

    if (isHoliday) {
      type = "holiday";
    } else if (isWeekend) {
      type = "weekend";
    } else if (isFuture) {
      type = "future";
      earned = dailyRate; // projected
    } else {
      type = "worked";
      earned = dailyRate;
    }

    if (!isWeekend && !isHoliday) cumulative += earned;

    entries.push({
      day: d,
      label: String(d).padStart(2, "0"),
      earned,
      cumulative,
      type,
    });
  }

  return entries;
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

interface TooltipPayload {
  payload?: { cumulative: number; earned: number; type: DailyEntry["type"] };
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  const typeLabel: Record<DailyEntry["type"], string> = {
    worked: "Ngày làm việc",
    weekend: "Cuối tuần",
    holiday: "Ngày lễ",
    future: "Dự kiến",
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl shadow-xl p-3 min-w-[160px]">
      <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2">
        Ngày {label} — {typeLabel[d.type]}
      </p>
      {d.type !== "weekend" && d.type !== "holiday" && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Hôm nay:{" "}
          <span className="font-semibold text-neutral-700 dark:text-neutral-200">
            +{formatVND(d.earned)}
          </span>
        </p>
      )}
      <p className="text-sm font-bold text-[#1D4D8F] dark:text-[#4C88C6] mt-1">
        Lũy kế: {formatVND(d.cumulative)}
      </p>
    </div>
  );
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function formatVNDShort(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}tr`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}k`;
  return String(Math.round(amount));
}

// ─── Main component ───────────────────────────────────────────────────────────

const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export default function EarningsPage() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3);

  const data = useMemo(() => buildMonthData(year, month), [year, month]);

  const worked = data.filter((d) => d.type === "worked").length;
  const totalWorked = data.filter((d) => d.type === "worked" || d.type === "future").length;
  const earnedSoFar = data.filter((d) => d.type === "worked").reduce((s, d) => s + d.earned, 0);
  const expectedTotal = data[data.length - 1]?.cumulative ?? 0;
  const todayEntry = [...data].reverse().find((d) => d.type === "worked");
  const todayEarned = todayEntry?.earned ?? 0;

  const components: SalaryComponent[] = [
    {
      label: "Lương cơ bản",
      amount: 15_000_000,
      color: "text-blue-700 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Phụ cấp ở trọ",
      amount: 600_000,
      color: "text-emerald-700 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Phụ cấp trách nhiệm",
      amount: 225_000,
      color: "text-violet-700 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      label: "BHXH (khấu trừ)",
      amount: -1_050_000,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    {
      label: "Thuế TNCN",
      amount: -375_000,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  const netMonthly = components.reduce((s, c) => s + c.amount, 0);

  // Navigate months
  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };
  const isCurrentMonth = year === 2026 && month === 3;

  // Chart: show every day but shade future differently
  const chartData = data;

  // Gradient ticks: show every 5th day label
  const tickDays = data.filter((d) => d.day % 5 === 0 || d.day === 1);

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-57px)] overflow-hidden bg-slate-50/30 dark:bg-neutral-950/30">
      <div className="flex flex-col h-full p-4 sm:p-6 gap-5 w-full">
        {/* ── Header ── */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white">Thu nhập</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Theo dõi lương theo ngày trong tháng
            </p>
          </div>

          {/* Month navigator */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 shadow-sm">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 min-w-[110px] text-center">
              {MONTHS[month - 1]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Summary cards ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0"
          >
            {/* Total earned */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className="col-span-2 sm:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6] p-4 sm:p-5 shadow-lg shadow-blue-900/20"
            >
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/5" />
              <div className="absolute -right-2 bottom-4 w-16 h-16 rounded-full bg-white/5" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-100">
                    {isCurrentMonth ? "Đã tích lũy tháng này" : `Tổng tháng ${month}/${year}`}
                  </span>
                </div>
                <p className="text-2xl font-black text-white tracking-tight">
                  {formatVND(isCurrentMonth ? earnedSoFar : expectedTotal)}
                </p>
                {isCurrentMonth && (
                  <p className="text-xs text-blue-200 mt-1">
                    Dự kiến cả tháng:{" "}
                    <span className="font-semibold text-white">{formatVND(netMonthly)}</span>
                  </p>
                )}
              </div>
            </motion.div>

            {/* Days worked */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="col-span-1 bg-white dark:bg-neutral-900/80 rounded-2xl border border-slate-200/80 dark:border-neutral-700/80 p-4 sm:p-5"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/25 flex items-center justify-center mb-3">
                <CalendarDays className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">
                {isCurrentMonth ? worked : totalWorked}
                <span className="text-sm font-medium text-neutral-400 ml-1">
                  / {totalWorked} ngày
                </span>
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {isCurrentMonth ? "Ngày đã làm" : "Ngày công"}
              </p>
            </motion.div>

            {/* Today's earning */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="col-span-1 bg-white dark:bg-neutral-900/80 rounded-2xl border border-slate-200/80 dark:border-neutral-700/80 p-4 sm:p-5"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/25 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">
                {isCurrentMonth
                  ? formatVNDShort(todayEarned)
                  : formatVNDShort(expectedTotal / totalWorked)}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {isCurrentMonth ? "Thu nhập hôm nay" : "Bình quân/ngày"}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* ── Left Column: Charts and Breakdown Grid ── */}
          <div className="xl:col-span-2 flex flex-col gap-5 min-h-0">
            {/* ── Daily chart ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-900/80 rounded-2xl border border-slate-200/80 dark:border-neutral-700/80 p-5 shrink-0 flex flex-col"
            >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Lũy kế thu nhập theo ngày
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Tổng số tiền tích lũy qua từng ngày trong tháng
              </p>
            </div>
            {isCurrentMonth && (
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4C88C6]" />
                  Đã thực hiện
                </span>
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#BCE8F5]/60 border border-[#4C88C6]/40" />
                  Dự kiến
                </span>
              </div>
            )}
          </div>

          <div className="h-[220px] w-full shrink-0">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="earnGradientSolid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1D4D8F" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4C88C6" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="earnGradientFuture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BCE8F5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#BCE8F5" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-neutral-800"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-neutral-400 dark:text-neutral-500"
                tickLine={false}
                axisLine={false}
                ticks={tickDays.map((d) => d.label)}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(v) => formatVNDShort(v as number)}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-neutral-400 dark:text-neutral-500"
                tickLine={false}
                axisLine={false}
                width={46}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Today reference line */}
              {isCurrentMonth && (
                <ReferenceLine
                  x={String(TODAY.getDate()).padStart(2, "0")}
                  stroke="#4C88C6"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  label={{ value: "Hôm nay", position: "top", fontSize: 10, fill: "#4C88C6" }}
                />
              )}

              {/* Worked area */}
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#1D4D8F"
                strokeWidth={2}
                fill="url(#earnGradientSolid)"
                dot={false}
                activeDot={{ r: 4, fill: "#1D4D8F", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Day-type legend row */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800 shrink-0">
            {[
              { color: "bg-[#4C88C6]", label: "Ngày làm việc" },
              { color: "bg-slate-300 dark:bg-neutral-600", label: "Cuối tuần" },
              { color: "bg-amber-400", label: "Ngày lễ" },
            ].map(({ color, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400"
              >
                <span className={cn("w-2 h-2 rounded-full", color)} />
                {label}
              </span>
            ))}
          </div>
        </motion.div>

            {/* ── Daily breakdown grid ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="bg-white dark:bg-neutral-900/80 rounded-2xl border border-slate-200/80 dark:border-neutral-700/80 overflow-hidden flex flex-col flex-1 min-h-0"
            >
          <div className="px-5 py-4 border-b border-slate-100 dark:border-neutral-800 flex items-center gap-2 shrink-0">
            <Clock className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Chi tiết từng ngày
            </h2>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 dark:divide-neutral-800 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[...data]
              .filter((d) => d.type === "worked" || d.type === "future")
              .reverse()
              .map((d, i) => (
                <motion.div
                  key={d.day}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.015 }}
                  className={cn(
                    "flex items-center justify-between px-5 py-3",
                    d.type === "future" && "opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                        d.type === "worked"
                          ? "bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-400"
                          : "bg-slate-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"
                      )}
                    >
                      {d.label}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        {new Date(year, month - 1, d.day).toLocaleDateString("vi-VN", {
                          weekday: "short",
                          day: "numeric",
                          month: "numeric",
                        })}
                        {d.type === "future" && (
                          <span className="ml-2 text-xs text-neutral-400 font-normal">
                            (dự kiến)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">
                        Lũy kế: {formatVND(d.cumulative)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatVND(d.earned)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            </motion.div>
          </div>

          {/* ── Right Column: Salary Components ── */}
          <div className="flex flex-col min-h-0">
            {/* ── Salary components ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white dark:bg-neutral-900/80 rounded-2xl border border-slate-200/80 dark:border-neutral-700/80 overflow-hidden flex flex-col flex-1 min-h-0"
            >
          <div className="px-5 py-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Cấu phần lương tháng
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
              <Info className="w-3.5 h-3.5" />
              Lương NET thực nhận
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 dark:divide-neutral-800 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {components.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn("w-2 h-7 rounded-full", c.bg.replace("bg-", "bg-").split(" ")[0])}
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{c.label}</span>
                </div>
                <span className={cn("text-sm font-bold tabular-nums", c.color)}>
                  {c.amount >= 0 ? "+" : ""}
                  {formatVND(c.amount)}
                </span>
              </motion.div>
            ))}

            </div>

            {/* Total row */}
            <div className="flex items-center justify-between px-5 py-4 bg-slate-50/80 dark:bg-neutral-800/50 shrink-0 border-t border-slate-100 dark:border-neutral-800 mt-auto">
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                Thực nhận / tháng
              </span>
              <span className="text-base font-black text-[#1D4D8F] dark:text-[#4C88C6]">
                {formatVND(netMonthly)}
              </span>
            </div>
        </motion.div>
        </div>
      </div>
      </div>
    </div>
  );
}
