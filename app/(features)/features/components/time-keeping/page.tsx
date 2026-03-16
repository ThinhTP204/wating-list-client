"use client";

import { useState } from "react";
import TimekeepingFilters from "./components/TimekeepingFilters";
import TimekeepingGrid from "./components/TimekeepingGrid";
import AddEmployeeDialog from "./components/AddEmployeeDialog";

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
  shifts: Record<number, Shift[]>; // dayIndex -> shifts
}

interface EmployeeFormData {
  name: string;
  phone: string;
  role: string;
}

interface DayData {
  date: number;
  dayName: string;
  isToday: boolean;
}

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "1", name: "Nguyễn Văn A", phone: "0123456789", role: "Nhân viên", shifts: { 0: [{ id: "s1", name: "Ca hành chính", time: "08:00 - 17:00" }, { id: "s2", name: "Ca tối", time: "18:00 - 22:00" }], 1: [{ id: "s3", name: "Ca hành chính", time: "08:00 - 17:00" }] } },
    { id: "2", name: "Trần Thị B", phone: "0987654321", role: "Quản lý", shifts: { 0: [{ id: "s4", name: "Ca sáng", time: "06:00 - 14:00" }], 2: [{ id: "s5", name: "Ca hành chính", time: "08:00 - 17:00" }] } },
  ]);

  // Generate days for current week (Mon-Sun)
  const getDaysOfWeek = (weekOffset: number = 0): DayData[] => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1) + weekOffset * 7);

    const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const days: DayData[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push({
        date: date.getDate(),
        dayName: dayNames[i],
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
      });
    }

    return days;
  };

  const [days] = useState<DayData[]>(getDaysOfWeek(0));

  const handleAddEmployee = (
    employeeData: EmployeeFormData[],
    _branchId: string
  ) => {
    const newEmployees = employeeData.map((data, index) => ({
      id: `emp-${Date.now()}-${index}`,
      name: data.name,
      phone: data.phone,
      role: data.role,
      shifts: {} as Record<number, Shift[]>,
    }));
    setEmployees([...employees, ...newEmployees]);
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId));
  };

  const handleAddShift = (employeeId: string, dayIndex: number) => {
    // Handle add shift logic
    console.log("Add shift for employee", employeeId, "on day", dayIndex);
  };

  const handleWeekChange = (weekOffset: number) => {
    // Handle week change - in real app would fetch new data
    console.log("Week offset:", weekOffset);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Chấm công
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Quản lý lịch làm việc và chấm công nhân viên
        </p>
      </div>

      <TimekeepingFilters
        onWeekChange={handleWeekChange}
        onStatusChange={(status) => console.log("Status:", status)}
      />

      <TimekeepingGrid
        days={days}
        employees={employees}
        onAddShift={handleAddShift}
        onAddEmployee={() => setIsDialogOpen(true)}
        onRemoveEmployee={handleRemoveEmployee}
      />

      <AddEmployeeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddEmployee}
      />
    </div>
  );
}
