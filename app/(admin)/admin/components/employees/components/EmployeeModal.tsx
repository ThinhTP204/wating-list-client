"use client";

import { useState, useEffect } from "react";
import { Employee, DEPARTMENT_META, STATUS_META } from "./types";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  availableRoles: Array<{ value: string; label: string }>;
  employee: Employee | null;
  isEdit: boolean;
}

const emptyEmployee: Omit<Employee, "id"> = {
  name: "",
  email: "",
  phone: "",
  role: "staff",
  department: "sales",
  status: "probation",
  joinDate: new Date().toISOString().split("T")[0],
  salary: 0,
};

export default function EmployeeModal({
  isOpen,
  onClose,
  onSave,
  availableRoles,
  employee,
  isEdit,
}: EmployeeModalProps) {
  const [formData, setFormData] = useState<Omit<Employee, "id">>(emptyEmployee);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee && isEdit) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        department: employee.department,
        status: employee.status,
        joinDate: employee.joinDate,
        salary: employee.salary,
      });
    } else {
      setFormData(emptyEmployee);
    }
    setErrors({});
  }, [employee, isEdit, isOpen]);

  const handleChange = (field: keyof Omit<Employee, "id">, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
    if (formData.salary <= 0) newErrors.salary = "Lương phải lớn hơn 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...formData, id: employee?.id || Date.now().toString() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {isEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                errors.name ? "border-red-500" : "border-neutral-200 dark:border-neutral-700"
              }`}
              placeholder="Nguyễn Văn A"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                  errors.email ? "border-red-500" : "border-neutral-200 dark:border-neutral-700"
                }`}
                placeholder="email@company.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                  errors.phone ? "border-red-500" : "border-neutral-200 dark:border-neutral-700"
                }`}
                placeholder="0901234567"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Department & Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Phòng ban
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              >
                {Object.entries(DEPARTMENT_META).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Chức vụ
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              >
                {availableRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Join Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              >
                {Object.entries(STATUS_META).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Ngày vào làm
              </label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => handleChange("joinDate", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Lương (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.salary}
              onChange={(e) => handleChange("salary", parseInt(e.target.value) || 0)}
              className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                errors.salary ? "border-red-500" : "border-neutral-200 dark:border-neutral-700"
              }`}
              placeholder="10000000"
              min="0"
              step="100000"
            />
            {errors.salary && <p className="text-xs text-red-500 mt-1">{errors.salary}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-linear-to-r from-brand-800 via-brand-500 to-brand-700 hover:shadow-lg hover:shadow-blue-500/25 rounded-lg transition-all"
            >
              {isEdit ? "Lưu thay đổi" : "Thêm nhân viên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
