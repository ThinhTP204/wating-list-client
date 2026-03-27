"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, DollarSign } from "lucide-react";
import { SalaryBoard, SalaryType, TimeCalcType } from "./types";
import { cn } from "@/lib/utils";

interface SalaryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (board: SalaryBoard) => void;
  editing?: SalaryBoard | null;
}

const SALARY_TYPE_OPTIONS: { value: SalaryType; label: string }[] = [
  { value: "gross_to_net", label: "Gross sang Net" },
  { value: "net_to_gross", label: "Net sang Gross" },
  { value: "fixed", label: "Lương cố định" },
];

const TIME_CALC_OPTIONS: { value: TimeCalcType; label: string }[] = [
  { value: "calendar_day", label: "Ngày dương lịch" },
  { value: "working_day", label: "Ngày làm việc" },
  { value: "shift", label: "Ca làm việc" },
];

const EMPTY_FORM = {
  name: "",
  keyword: "",
  month: "",
  type: "" as SalaryType | "",
  timeCalcType: "" as TimeCalcType | "",
  hiddenFromEmployee: false,
};

export default function SalaryDialog({ open, onClose, onSave, editing }: SalaryDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        keyword: editing.keyword,
        month: editing.month,
        type: editing.type,
        timeCalcType: editing.timeCalcType,
        hiddenFromEmployee: editing.hiddenFromEmployee,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editing, open]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên bảng lương";
    if (!form.keyword.trim()) e.keyword = "Vui lòng nhập từ khóa";
    if (!form.month) e.month = "Vui lòng chọn tháng";
    if (!form.type) e.type = "Vui lòng chọn loại bảng lương";
    if (!form.timeCalcType) e.timeCalcType = "Vui lòng chọn loại thời gian";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const board: SalaryBoard = {
      id: editing?.id ?? Date.now().toString(),
      name: form.name.trim(),
      keyword: form.keyword.trim().toUpperCase(),
      month: form.month,
      type: form.type as SalaryType,
      timeCalcType: form.timeCalcType as TimeCalcType,
      hiddenFromEmployee: form.hiddenFromEmployee,
      status: editing?.status ?? "draft",
      departments: editing?.departments ?? [],
      positions: editing?.positions ?? [],
      employeeCount: editing?.employeeCount ?? 0,
      createdAt: editing?.createdAt ?? new Date().toISOString().split("T")[0],
    };
    onSave(board);
    onClose();
  };

  const field = (key: string) => ({
    className: cn(
      "w-full px-3 py-2.5 text-sm rounded-lg border bg-neutral-50 dark:bg-neutral-900 transition-colors outline-none",
      "focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500",
      errors[key]
        ? "border-red-400 dark:border-red-500"
        : "border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
    ),
  });

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            className="relative w-full max-w-lg bg-white dark:bg-neutral-950 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Gradient header */}
            <div className="bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {editing ? "Chỉnh sửa bảng lương" : "Tạo bảng lương"}
                  </h2>
                  <p className="text-xs text-white/70">
                    {editing ? "Cập nhật thông tin bảng lương" : "Điền thông tin để tạo bảng lương mới"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Form body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto [scrollbar-width:thin]">
              {/* Tên bảng lương */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Tên bảng lương <span className="text-red-500">*</span>
                </label>
                <input
                  {...field("name")}
                  placeholder="Tên bảng lương"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Từ khóa */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Từ khóa bảng lương <span className="text-red-500">*</span>
                </label>
                <input
                  {...field("keyword")}
                  placeholder="Từ khóa bảng lương"
                  value={form.keyword}
                  onChange={(e) => setForm((f) => ({ ...f, keyword: e.target.value }))}
                />
                {errors.keyword && <p className="mt-1 text-xs text-red-500">{errors.keyword}</p>}
              </div>

              {/* Tháng */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Tháng <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  {...field("month")}
                  value={form.month}
                  onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}
                />
                {errors.month && <p className="mt-1 text-xs text-red-500">{errors.month}</p>}
              </div>

              {/* Loại bảng lương */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Loại bảng lương <span className="text-red-500">*</span>
                </label>
                <select
                  {...field("type")}
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as SalaryType }))}
                >
                  <option value="">Loại bảng lương</option>
                  {SALARY_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
              </div>

              {/* Loại thời gian tính lương */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Loại thời gian tính lương <span className="text-red-500">*</span>
                </label>
                <select
                  {...field("timeCalcType")}
                  value={form.timeCalcType}
                  onChange={(e) => setForm((f) => ({ ...f, timeCalcType: e.target.value as TimeCalcType }))}
                >
                  <option value="">Loại thời gian tính lương</option>
                  {TIME_CALC_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {errors.timeCalcType && <p className="mt-1 text-xs text-red-500">{errors.timeCalcType}</p>}
              </div>

              {/* Toggle: Ẩn bảng lương */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Ẩn bảng lương với nhân viên
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">Nhân viên sẽ không thấy bảng lương này</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, hiddenFromEmployee: !f.hiddenFromEmployee }))}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none",
                    form.hiddenFromEmployee
                      ? "bg-gradient-to-r from-[#1D4D8F] to-[#4C88C6]"
                      : "bg-neutral-200 dark:bg-neutral-700"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                      form.hiddenFromEmployee ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#102854] via-[#1D4D8F] to-[#4C88C6] rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-shadow"
              >
                {editing ? "Lưu thay đổi" : "Tạo mới"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
