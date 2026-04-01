"use client";

import { useState } from "react";
import { EmployeeStatus, EmployeeDepartment, DEPARTMENT_META, STATUS_META } from "./types";

interface EmployeeFiltersProps {
  onSearchChange: (query: string) => void;
  onStatusChange: (status: EmployeeStatus | "all") => void;
  onDepartmentChange: (department: EmployeeDepartment | "all") => void;
  onRoleChange: (role: string | "all") => void;
  roleOptions: Array<{ value: string; label: string }>;
  currentStatus: EmployeeStatus | "all";
  currentDepartment: EmployeeDepartment | "all";
  currentRole: string | "all";
}

export default function EmployeeFilters({
  onSearchChange,
  onStatusChange,
  onDepartmentChange,
  onRoleChange,
  roleOptions,
  currentStatus,
  currentDepartment,
  currentRole,
}: EmployeeFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Status Filter */}
        <select
          value={currentStatus}
          onChange={(e) => onStatusChange(e.target.value as EmployeeStatus | "all")}
          className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
        >
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.name}
            </option>
          ))}
        </select>

        {/* Department Filter */}
        <select
          value={currentDepartment}
          onChange={(e) => onDepartmentChange(e.target.value as EmployeeDepartment | "all")}
          className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
        >
          <option value="all">Tất cả phòng ban</option>
          {Object.entries(DEPARTMENT_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.name}
            </option>
          ))}
        </select>

        {/* Role Filter */}
        <select
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value as string | "all")}
          className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
        >
          <option value="all">Tất cả chức vụ</option>
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
