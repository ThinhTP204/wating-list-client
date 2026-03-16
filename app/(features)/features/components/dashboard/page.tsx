"use client";

import WorkScheduleCard from "./components/WorkScheduleCard";
import AttendanceChartCard from "./components/AttendanceChartCard";
import PendingRequestsCard from "./components/PendingRequestsCard";
import TimekeepingInfoCard from "./components/TimekeepingInfoCard";
import WorkHoursCard from "./components/WorkHoursCard";
import TaskCompletionCard from "./components/TaskCompletionCard";
import StaffWorkingCard from "./components/StaffWorkingCard";
import SalaryChartCard from "./components/SalaryChartCard";
import EmployeeCountCard from "./components/EmployeeCountCard";
import LeaveCountCard from "./components/LeaveCountCard";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Tổng quan hoạt động và thống kê
        </p>
      </div>

      {/*
        xl (6 cols):
          Row 1: Schedule(2) | Attendance(2) | Pending(2)
          Row 2: Timekeeping(3) | StaffWorking(3)
          Row 3: WorkHours(2) | TaskCompletion(2) | Employee(2)
          Row 4: Salary(4) | Leave(2)

        lg (4 cols):
          Row 1: Schedule(2) | Attendance(2)
          Row 2: Pending(2) | Timekeeping(2)
          Row 3: StaffWorking(2) | WorkHours(2)
          Row 4: TaskCompletion(2) | Employee(2)
          Row 5: Salary(4)
          Row 6: Leave(4)
      */}
      {/*
        xl (6 cols) — mỗi row lấp đầy 6 cột:
          Row 1: Schedule(3) | Attendance(3)
          Row 2: Pending(2) | Timekeeping(2) | StaffWorking(2)
          Row 3: WorkHours(2) | TaskCompletion(2) | Employee(2)
          Row 4: Salary(4) | Leave(2)

        lg (4 cols) — mỗi row lấp đầy 4 cột:
          Row 1: Schedule(2) | Attendance(2)
          Row 2: Pending(2) | Timekeeping(2)
          Row 3: StaffWorking(2) | WorkHours(2)
          Row 4: TaskCompletion(2) | Employee(2)
          Row 5: Salary(4)
          Row 6: Leave(4)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Row 1 */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col">
          <WorkScheduleCard />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col">
          <AttendanceChartCard />
        </div>

        {/* Row 2 */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col">
          <PendingRequestsCard />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col">
          <TimekeepingInfoCard />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 flex flex-col">
          <StaffWorkingCard />
        </div>

        {/* Row 3 */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col">
          <WorkHoursCard />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col">
          <TaskCompletionCard />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 flex flex-col">
          <EmployeeCountCard />
        </div>

        {/* Row 4 - Salary and Leave as horizontal rectangles */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3 flex flex-col">
          <SalaryChartCard />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3 flex flex-col">
          <LeaveCountCard />
        </div>
      </div>
    </div>
  );
}
