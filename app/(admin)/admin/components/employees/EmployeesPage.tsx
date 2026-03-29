"use client";

import { useState, useMemo } from "react";
import {
  Employee,
  EmployeeStatus,
  EmployeeDepartment,
  EmployeeRole,
  MOCK_EMPLOYEES,
} from "./components/types";
import EmployeeStats from "./components/EmployeeStats";
import EmployeeFilters from "./components/EmployeeFilters";
import EmployeeList from "./components/EmployeeList";
import EmployeeModal from "./components/EmployeeModal";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<EmployeeDepartment | "all">("all");
  const [roleFilter, setRoleFilter] = useState<EmployeeRole | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        !searchQuery ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone.includes(searchQuery);
      const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter;
      const matchesRole = roleFilter === "all" || emp.role === roleFilter;
      return matchesSearch && matchesStatus && matchesDepartment && matchesRole;
    });
  }, [employees, searchQuery, statusFilter, departmentFilter, roleFilter]);

  const handleSave = (employee: Employee) => {
    setEmployees((prev) => {
      const exists = prev.find((e) => e.id === employee.id);
      if (exists) return prev.map((e) => (e.id === employee.id ? employee : e));
      return [...prev, employee];
    });
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setDeleteTarget(employee);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-57px)] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Quản lý nhân sự</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Quản lý thông tin và trạng thái nhân viên
            </p>
          </div>
          <button
            onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }}
            className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-[#102854] via-[#4C88C6] to-[#1D4D8F] rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            + Thêm nhân viên
          </button>
        </div>

        {/* Stats */}
        <EmployeeStats employees={employees} />

        {/* Filters */}
        <EmployeeFilters
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onDepartmentChange={setDepartmentFilter}
          onRoleChange={setRoleFilter}
          currentStatus={statusFilter}
          currentDepartment={departmentFilter}
          currentRole={roleFilter}
        />

        {/* List */}
        <EmployeeList
          employees={filteredEmployees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add/Edit Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEmployee(null); }}
        onSave={handleSave}
        employee={editingEmployee}
        isEdit={!!editingEmployee}
      />

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-sm mx-4 w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Xác nhận xóa</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Bạn có chắc muốn xóa <span className="font-medium text-neutral-700 dark:text-neutral-300">{deleteTarget.name}</span>?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
