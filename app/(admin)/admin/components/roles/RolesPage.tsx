"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEPARTMENT_META,
  MOCK_EMPLOYEES,
  STATUS_META,
  type Employee,
} from "@/app/(admin)/admin/components/employees/components/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createRole,
  deleteRole,
  loadRoles,
  subscribeRoles,
  updateRole,
  type SystemRole,
} from "@/features/roles/services/roleStore";

interface RoleFormState {
  name: string;
  description: string;
}

const EMPTY_FORM: RoleFormState = {
  name: "",
  description: "",
};

export default function RolesPage() {
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [form, setForm] = useState<RoleFormState>(EMPTY_FORM);
  const [editingRole, setEditingRole] = useState<SystemRole | null>(null);
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const refresh = () => setRoles(loadRoles());
    refresh();

    return subscribeRoles(refresh);
  }, []);

  const stats = useMemo(() => {
    const headCountByRole = new Map<string, number>();
    MOCK_EMPLOYEES.forEach((employee) => {
      headCountByRole.set(employee.role, (headCountByRole.get(employee.role) ?? 0) + 1);
    });

    return {
      total: roles.length,
      system: roles.filter((role) => role.isSystem).length,
      custom: roles.filter((role) => !role.isSystem).length,
      assignedEmployees: roles.reduce((sum, role) => sum + (headCountByRole.get(role.key) ?? 0), 0),
    };
  }, [roles]);

  const headCountByRole = useMemo(() => {
    const counts = new Map<string, number>();

    MOCK_EMPLOYEES.forEach((employee) => {
      counts.set(employee.role, (counts.get(employee.role) ?? 0) + 1);
    });

    return counts;
  }, []);

  const employeesByRole = useMemo(() => {
    const grouped = new Map<string, Employee[]>();

    for (const employee of MOCK_EMPLOYEES) {
      const existing = grouped.get(employee.role) ?? [];
      grouped.set(employee.role, [...existing, employee]);
    }

    return grouped;
  }, []);

  const selectedRoleEmployees = selectedRole
    ? employeesByRole.get(selectedRole.key) ?? []
    : [];

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingRole(null);
    setError("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (editingRole) {
        updateRole(editingRole.id, {
          name: form.name,
          description: form.description,
        });
      } else {
        createRole(form.name, form.description);
      }

      resetForm();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Không thể lưu role");
    }
  };

  const handleEdit = (role: SystemRole) => {
    setEditingRole(role);
    setForm({
      name: role.name,
      description: role.description,
    });
    setError("");
  };

  const handleDelete = (role: SystemRole) => {
    try {
      deleteRole(role.id);
      if (editingRole?.id === role.id) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Không thể xóa role");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-57px)] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Quản lý vai trò</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Xem tất cả role trong hệ thống và CRUD role trước khi gán cho nhân viên.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Tổng role</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {stats.total}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Role hệ thống</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {stats.system}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Role tùy chỉnh</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {stats.custom}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Nhân sự đã gán role</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {stats.assignedEmployees}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Danh sách role
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Role
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Mô tả
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Loại
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Số nhân viên
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {roles.map((role) => (
                    <tr
                      key={role.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedRole(role)}
                          className="font-medium text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {role.name}
                        </button>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {role.key}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300">
                        {role.description}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            role.isSystem
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}
                        >
                          {role.isSystem ? "Hệ thống" : "Tùy chỉnh"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                        <button
                          type="button"
                          onClick={() => setSelectedRole(role)}
                          className="inline-flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700 px-2.5 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          {headCountByRole.get(role.key) ?? 0}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(role)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(role)}
                            disabled={role.isSystem}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              {editingRole ? "Cập nhật role" : "Tạo role mới"}
            </h2>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                  Tên role
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="Ví dụ: Trưởng nhóm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
                  Mô tả
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                  placeholder="Mô tả phạm vi quyền của role"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-linear-to-r from-brand-800 via-brand-500 to-brand-700 hover:shadow-md transition-all"
                >
                  {editingRole ? "Lưu role" : "Tạo role"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedRole} onOpenChange={(open) => !open && setSelectedRole(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0 [&>button]:hidden">
          <div className="px-6 py-4 bg-linear-to-r from-brand-800 via-brand-500 to-brand-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-white">
                Danh sách nhân viên thuộc role: {selectedRole?.name}
              </DialogTitle>
              <DialogDescription className="text-white/80">
                Có {selectedRoleEmployees.length} nhân viên thuộc role này.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4">
            {selectedRoleEmployees.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-6 text-center">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Chưa có nhân viên nào thuộc role này
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Bạn có thể gán role này ở trang Nhân sự.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedRoleEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                        {employee.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {employee.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {DEPARTMENT_META[employee.department].name}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_META[employee.status].bg} ${STATUS_META[employee.status].text}`}
                      >
                        {STATUS_META[employee.status].name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
