"use client";

import { useState } from "react";
import { Employee, STATUS_META, ROLE_META, DEPARTMENT_META } from "./types";

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

type SortField = "name" | "email" | "department" | "role" | "status" | "joinDate";
type SortOrder = "asc" | "desc";

export default function EmployeeList({ employees, onEdit, onDelete }: EmployeeListProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 inline-flex flex-col">
      <svg
        className={`w-3 h-3 ${sortField === field && sortOrder === "asc" ? "text-blue-500" : "text-neutral-300"}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 5l-8 8h16z" />
      </svg>
      <svg
        className={`w-3 h-3 -mt-1 ${sortField === field && sortOrder === "desc" ? "text-blue-500" : "text-neutral-300"}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 19l-8-8h16z" />
      </svg>
    </span>
  );

  if (employees.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Không tìm thấy nhân viên</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-500">Thử thay đổi bộ lọc hoặc thêm nhân viên mới</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center hover:text-blue-500 transition-colors"
                >
                  Nhân viên <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("department")}
                  className="flex items-center hover:text-blue-500 transition-colors"
                >
                  Phòng ban <SortIcon field="department" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("role")}
                  className="flex items-center hover:text-blue-500 transition-colors"
                >
                  Chức vụ <SortIcon field="role" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center hover:text-blue-500 transition-colors"
                >
                  Trạng thái <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("joinDate")}
                  className="flex items-center hover:text-blue-500 transition-colors"
                >
                  Ngày vào <SortIcon field="joinDate" />
                </button>
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {paginatedEmployees.map((employee) => {
              const statusMeta = STATUS_META[employee.status];
              return (
                <tr
                  key={employee.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#102854] via-[#4C88C6] to-[#1D4D8F] flex items-center justify-center text-white font-semibold text-sm">
                        {employee.name.split(" ").pop()?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900 dark:text-white">{employee.name}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300">
                    {DEPARTMENT_META[employee.department].name}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300">
                    {ROLE_META[employee.role].name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusMeta.bg} ${statusMeta.text}`}>
                      {statusMeta.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300">
                    {new Date(employee.joinDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(employee)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-blue-600 dark:text-blue-400"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(employee)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400"
                        title="Xóa"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, employees.length)} của {employees.length} nhân viên
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-gradient-to-r from-[#102854] via-[#4C88C6] to-[#1D4D8F] text-white"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
