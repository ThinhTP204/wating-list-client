"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Users } from "lucide-react";

type EmployeeStatus = "all" | "active" | "no-attendance";

interface TimekeepingFiltersProps {
  onWeekChange: (weekOffset: number) => void;
  onStatusChange: (status: EmployeeStatus) => void;
}

export default function TimekeepingFilters({
  onWeekChange,
  onStatusChange,
}: TimekeepingFiltersProps) {
  const [currentWeek, setCurrentWeek] = useState(0);

  const handlePrevWeek = () => {
    const newWeek = currentWeek - 1;
    setCurrentWeek(newWeek);
    onWeekChange(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = currentWeek + 1;
    setCurrentWeek(newWeek);
    onWeekChange(newWeek);
  };

  const handleStatusChange = (value: string) => {
    onStatusChange(value as EmployeeStatus);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#8f58e4]" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Tuần
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handlePrevWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm px-3 min-w-[100px] text-center">
            {currentWeek === 0
              ? "Tuần này"
              : currentWeek > 0
              ? `${currentWeek} tuần sau`
              : `${Math.abs(currentWeek)} tuần trước`}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleNextWeek}
            disabled={currentWeek >= 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-neutral-500" />
          <Select defaultValue="all" onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
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
    </div>
  );
}
