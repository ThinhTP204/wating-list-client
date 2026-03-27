"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Upload,
  Users,
} from "lucide-react";

type EmployeeStatus = "all" | "active" | "no-attendance";

const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3",  "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7",  "Tháng 8",
  "Tháng 9", "Tháng 10","Tháng 11", "Tháng 12",
];

interface TimekeepingFiltersProps {
  month: number;        // 1-12
  year: number;
  currentMonth: number; // offset from current month
  onMonthChange: (monthOffset: number) => void;
  onStatusChange: (status: EmployeeStatus) => void;
  viewMode: "employee" | "shift";
  onViewModeChange: (mode: "employee" | "shift") => void;
  onExport: () => void;
  onImport: () => void;
}

export default function TimekeepingFilters({
  month,
  year,
  currentMonth,
  onMonthChange,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onExport,
  onImport,
}: TimekeepingFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
      {/* Left */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Month navigator */}
        <div className="flex items-center gap-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1.5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <Calendar className="w-4 h-4 text-[#4C88C6] mr-1 shrink-0" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#4C88C6]/10 hover:text-[#4C88C6] transition-colors"
            onClick={() => onMonthChange(currentMonth - 1)}
            aria-label="Tháng trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold min-w-[140px] text-center text-neutral-800 dark:text-neutral-200 select-none">
            {MONTH_NAMES[month - 1]} — {year}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#4C88C6]/10 hover:text-[#4C88C6] transition-colors"
            onClick={() => onMonthChange(currentMonth + 1)}
            aria-label="Tháng sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5 border border-neutral-200 dark:border-neutral-700">
          <button
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              viewMode === "employee"
                ? "bg-white dark:bg-neutral-700 text-[#4C88C6] shadow-sm ring-1 ring-[#4C88C6]/20"
                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
            onClick={() => onViewModeChange("employee")}
          >
            Theo nhân viên
          </button>
          <button
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              viewMode === "shift"
                ? "bg-white dark:bg-neutral-700 text-[#4C88C6] shadow-sm ring-1 ring-[#4C88C6]/20"
                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
            onClick={() => onViewModeChange("shift")}
          >
            Theo ca
          </button>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-neutral-400 shrink-0" />
          <Select defaultValue="all" onValueChange={(v) => onStatusChange(v as EmployeeStatus)}>
            <SelectTrigger className="w-[180px] h-8 text-sm">
              <SelectValue placeholder="Trạng thái nhân viên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nhân viên</SelectItem>
              <SelectItem value="active">Nhân viên hoạt động</SelectItem>
              <SelectItem value="no-attendance">Không chấm công</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 group hover:border-[#4C88C6]/50 hover:text-[#4C88C6] transition-colors"
          onClick={() => onMonthChange(0)}
          title="Về tháng hiện tại"
        >
          <RefreshCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
          Tháng này
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:shadow-sm dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/20 transition-all"
          onClick={onExport}
        >
          <Download className="w-3.5 h-3.5" />
          Xuất file
        </Button>
        <Button
          size="sm"
          className="h-8 text-xs gap-1.5 bg-[#4C88C6] hover:bg-[#7a47cc] hover:shadow-md text-white transition-all"
          onClick={onImport}
        >
          <Upload className="w-3.5 h-3.5" />
          Nhập dữ liệu
        </Button>
      </div>
    </div>
  );
}
