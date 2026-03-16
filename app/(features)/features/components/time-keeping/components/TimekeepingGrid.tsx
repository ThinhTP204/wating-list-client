"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2 } from "lucide-react";
import ShiftDetailDialog from "./ShiftDetailDialog";

interface Shift {
  id: string;
  name: string;
  time: string;
}

interface Employee {
  id: string;
  name: string;
  phone: string;
  role: string;
  shifts: Record<number, Shift[]>;
}

interface DayData {
  date: number;
  dayName: string;
  isToday: boolean;
}

interface TimekeepingGridProps {
  days: DayData[];
  employees: Employee[];
  onAddShift: (employeeId: string, dayIndex: number) => void;
  onAddEmployee: () => void;
  onRemoveEmployee: (employeeId: string) => void;
}

export default function TimekeepingGrid({
  days,
  employees,
  onAddShift,
  onAddEmployee,
  onRemoveEmployee,
}: TimekeepingGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [selectedShiftInfo, setSelectedShiftInfo] = useState<{
    employee: Employee;
    dayIndex: number;
    dayLabel: string;
  } | null>(null);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      {/* Title Row */}
      <div className="grid bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800" style={{ gridTemplateColumns: "200px repeat(7, 1fr)" }}>
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
          </div>
        </div>
        {days.map((day, index) => (
          <div
            key={index}
            className={`p-3 text-center border-l border-neutral-200 dark:border-neutral-800 ${
              day.isToday ? "bg-[#8f58e4]/8 dark:bg-[#8f58e4]/15" : ""
            }`}
          >
            <p className={`text-xs font-medium uppercase ${day.isToday ? "text-[#8f58e4]" : "text-neutral-500"}`}>
              {day.dayName}
            </p>
            <p className={`text-sm font-semibold ${day.isToday ? "text-[#8f58e4]" : "text-neutral-900 dark:text-white"}`}>
              {day.date}
            </p>
          </div>
        ))}
      </div>

      {/* Ca mở Row */}
      <div className="grid border-b border-neutral-200 dark:border-neutral-800" style={{ gridTemplateColumns: "200px repeat(7, 1fr)" }}>
        <div className="p-3 flex items-center">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Ca mở
          </span>
        </div>
        {days.map((day, index) => (
          <div
            key={index}
            className={`p-2 border-l border-neutral-200 dark:border-neutral-800 flex justify-center ${
              day.isToday ? "bg-[#8f58e4]/8 dark:bg-[#8f58e4]/15" : ""
            }`}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-dashed border-2 hover:border-[#8f58e4] hover:bg-[#8f58e4]/5"
            >
              <Plus className="h-4 w-4 text-neutral-400" />
            </Button>
          </div>
        ))}
      </div>

      {/* Employee Rows */}
      {filteredEmployees.map((employee) => (
        <div
          key={employee.id}
          className="grid border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
          style={{ gridTemplateColumns: "200px repeat(7, 1fr)" }}
        >
          <div className="p-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {employee.name}
              </span>
              <span className="text-xs text-neutral-500">{employee.phone}</span>
              <span className="text-xs text-[#8f58e4]">{employee.role}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-neutral-400 hover:text-red-500"
              onClick={() => onRemoveEmployee(employee.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          {days.map((day, index) => {
            const dayShifts = employee.shifts[index] ?? [];
            const isMultipleShifts = dayShifts.length > 1;
            const isSingleShift = dayShifts.length === 1;

            return (
            <div
              key={index}
              className={`p-2 border-l border-neutral-200 dark:border-neutral-800 flex justify-center items-center ${
                day.isToday ? "bg-[#8f58e4]/8 dark:bg-[#8f58e4]/15" : ""
              }`}
            >
              {(isMultipleShifts || isSingleShift) ? (
                <button
                  className={`w-full h-full min-h-[44px] flex flex-col items-center justify-center rounded-md transition-colors ${
                    isMultipleShifts
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                      : "bg-[#8f58e4]/10 text-[#8f58e4] hover:bg-[#8f58e4]/20"
                  }`}
                  onClick={() => {
                    setSelectedShiftInfo({ employee, dayIndex: index, dayLabel: `${day.dayName} ${day.date}` });
                    setShiftDialogOpen(true);
                  }}
                >
                  {isMultipleShifts ? (
                    <span className="text-sm font-semibold">{dayShifts.length} ca</span>
                  ) : (
                    <>
                      <span className="text-xs font-medium truncate w-full px-1">{dayShifts[0].name}</span>
                      <span className="text-[10px] text-neutral-500">{dayShifts[0].time}</span>
                    </>
                  )}
                </button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-[#8f58e4]/10"
                  onClick={() => onAddShift(employee.id, index)}
                >
                  <Plus className="h-3 w-3 text-neutral-400" />
                </Button>
              )}
            </div>
            );
          })}
        </div>
      ))}

      {/* Add Employee Button */}
      <div className="p-3 flex justify-center">
        <Button
          variant="outline"
          className="border-dashed border-2 border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-[#8f58e4] hover:border-[#8f58e4] hover:bg-[#8f58e4]/5"
          onClick={onAddEmployee}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm nhân viên
        </Button>
      </div>

      {selectedShiftInfo && (
        <ShiftDetailDialog
          open={shiftDialogOpen}
          onOpenChange={setShiftDialogOpen}
          employeeName={selectedShiftInfo.employee.name}
          dayLabel={selectedShiftInfo.dayLabel}
          shifts={selectedShiftInfo.employee.shifts[selectedShiftInfo.dayIndex] ?? []}
        />
      )}
    </div>
  );
}
