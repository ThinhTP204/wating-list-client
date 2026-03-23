"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { SalaryScaleEntry } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (entry: SalaryScaleEntry) => void;
  editing: SalaryScaleEntry | null;
  existingPositions: string[];
}

const EMPTY = { position: "", code: "", rank: 1, priority: 1, minSalary: 0, maxSalary: 0 };
type FormState = typeof EMPTY;
type FormErrors = Partial<Record<keyof FormState, string>>;

export default function SalaryScaleDialog({
  open, onClose, onSave, editing, existingPositions,
}: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      setForm(editing ? { ...editing } : EMPTY);
      setErrors({});
    }
  }, [open, editing]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: FormErrors = {};
    if (!form.position.trim()) e.position = "Vui lòng nhập chức danh";
    if (!form.code.trim()) e.code = "Vui lòng nhập mã loại";
    if (form.rank < 1) e.rank = "Tối thiểu là 1";
    if (form.priority < 1) e.priority = "Tối thiểu là 1";
    if (form.minSalary <= 0) e.minSalary = "Phải lớn hơn 0";
    if (form.maxSalary <= form.minSalary) e.maxSalary = "Phải lớn hơn lương tối thiểu";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ ...form, id: editing?.id ?? `sc-${Date.now()}` });
    onClose();
  };

  const inputCls = (err?: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
      err
        ? "border-red-400 focus:ring-red-400/30 focus:border-red-400"
        : "border-neutral-200 dark:border-neutral-700 focus:ring-purple-500/30 focus:border-purple-500"
    }`;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white text-base">
                  {editing ? "Chỉnh sửa mức lương" : "Thêm mức lương"}
                </h2>
                <p className="text-purple-200 text-xs mt-0.5">
                  Cấu hình khung lương theo chức danh
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Position */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Chức danh <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.position}
                  onChange={(e) => set("position", e.target.value)}
                  placeholder="VD: Quản lý, Nhân viên..."
                  list="scale-positions"
                  className={inputCls(errors.position)}
                />
                <datalist id="scale-positions">
                  {existingPositions.map((p) => <option key={p} value={p} />)}
                </datalist>
                {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position}</p>}
              </div>

              {/* Code */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Mã loại <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  placeholder="VD: M1, P2, T3..."
                  className={inputCls(errors.code)}
                />
                {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
              </div>

              {/* Rank + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Cấp bậc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" min={1}
                    value={form.rank}
                    onChange={(e) => set("rank", Number(e.target.value))}
                    className={inputCls(errors.rank)}
                  />
                  {errors.rank && <p className="mt-1 text-xs text-red-500">{errors.rank}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Ưu tiên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" min={1}
                    value={form.priority}
                    onChange={(e) => set("priority", Number(e.target.value))}
                    className={inputCls(errors.priority)}
                  />
                  {errors.priority && <p className="mt-1 text-xs text-red-500">{errors.priority}</p>}
                </div>
              </div>

              {/* Salary range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Lương tối thiểu (₫) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" min={0} step={500000}
                    value={form.minSalary || ""}
                    onChange={(e) => set("minSalary", Number(e.target.value))}
                    placeholder="0"
                    className={inputCls(errors.minSalary)}
                  />
                  {errors.minSalary && <p className="mt-1 text-xs text-red-500">{errors.minSalary}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Lương tối đa (₫) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" min={0} step={500000}
                    value={form.maxSalary || ""}
                    onChange={(e) => set("maxSalary", Number(e.target.value))}
                    placeholder="0"
                    className={inputCls(errors.maxSalary)}
                  />
                  {errors.maxSalary && <p className="mt-1 text-xs text-red-500">{errors.maxSalary}</p>}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-shadow"
              >
                {editing ? "Lưu thay đổi" : "Thêm mục"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
