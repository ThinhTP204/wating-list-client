"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ShiftConfig } from "@/features/shifts/types";

const PRESET_COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#6b7280"];

interface ShiftConfigPanelProps {
  configs: ShiftConfig[];
  onClose: () => void;
  onCreate: (data: Omit<ShiftConfig, "id">) => void;
  onUpdate: (id: string, data: Partial<Omit<ShiftConfig, "id">>) => void;
  onDelete: (id: string) => void;
  isMutating?: boolean;
}

interface FormState {
  name: string;
  startTime: string;
  endTime: string;
  color: string;
  isBreak: boolean;
}

const emptyForm = (): FormState => ({
  name: "",
  startTime: "08:00",
  endTime: "17:00",
  color: "#3b82f6",
  isBreak: false,
});

export default function ShiftConfigPanel({
  configs,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  isMutating,
}: ShiftConfigPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());

  function startEdit(config: ShiftConfig) {
    setEditingId(config.id);
    setShowAddForm(false);
    setForm({ name: config.name, startTime: config.startTime, endTime: config.endTime, color: config.color, isBreak: config.isBreak });
  }

  function startAdd() {
    setEditingId(null);
    setShowAddForm(true);
    setForm(emptyForm());
  }

  function cancelForm() {
    setEditingId(null);
    setShowAddForm(false);
  }

  function handleSave() {
    if (!form.name.trim() || !form.startTime || !form.endTime) return;
    if (editingId) {
      onUpdate(editingId, form);
    } else {
      onCreate(form);
    }
    cancelForm();
  }

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed right-0 top-0 h-full w-80 z-50 flex flex-col shadow-2xl bg-white dark:bg-neutral-900 border-l border-slate-200 dark:border-neutral-700"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6] px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-white text-sm font-semibold">Cấu hình ca làm việc</h2>
          <p className="text-blue-200 text-xs mt-0.5">{configs.length} loại ca</p>
        </div>
        <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Config list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {configs.map((config) => (
          <div key={config.id}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700",
                editingId === config.id && "ring-2 ring-blue-400"
              )}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {config.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {config.startTime} – {config.endTime}
                  {config.isBreak && " · có nghỉ"}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => startEdit(config)}
                  className="p-1 rounded-md text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(config.id)}
                  disabled={isMutating}
                  className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Inline edit form */}
            <AnimatePresence>
              {editingId === config.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <ConfigForm
                    form={form}
                    setForm={setForm}
                    onSave={handleSave}
                    onCancel={cancelForm}
                    isMutating={isMutating}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Add new form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700 p-3">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">Thêm loại ca mới</p>
                <ConfigForm
                  form={form}
                  setForm={setForm}
                  onSave={handleSave}
                  onCancel={cancelForm}
                  isMutating={isMutating}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-neutral-700 p-4">
        <Button
          onClick={startAdd}
          disabled={showAddForm || !!editingId || isMutating}
          className="w-full bg-gradient-to-r from-[#1D4D8F] to-[#4C88C6] text-white border-0 hover:brightness-110"
          size="sm"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Thêm loại ca
        </Button>
      </div>
    </motion.div>
  );
}

// ── Internal form component ────────────────────────────────────────────────

interface ConfigFormProps {
  form: FormState;
  setForm: (f: FormState) => void;
  onSave: () => void;
  onCancel: () => void;
  isMutating?: boolean;
}

function ConfigForm({ form, setForm, onSave, onCancel, isMutating }: ConfigFormProps) {
  const set = (key: keyof FormState, value: string | boolean) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="space-y-3 pt-1">
      <div className="space-y-1">
        <Label className="text-xs text-slate-500">Tên ca</Label>
        <Input
          placeholder="VD: Ca sáng"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className="h-8 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Giờ bắt đầu</Label>
          <Input
            type="time"
            value={form.startTime}
            onChange={(e) => set("startTime", e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Giờ kết thúc</Label>
          <Input
            type="time"
            value={form.endTime}
            onChange={(e) => set("endTime", e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-500">Màu nhận diện</Label>
        <div className="flex gap-1.5 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => set("color", c)}
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-transform",
                form.color === c ? "border-slate-700 scale-110" : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isBreak}
          onChange={(e) => set("isBreak", e.target.checked)}
          className="rounded"
        />
        <span className="text-xs text-slate-600 dark:text-slate-400">Tính giờ nghỉ</span>
      </label>
      <div className="flex gap-2 pt-1">
        <Button size="sm" variant="outline" onClick={onCancel} className="flex-1 h-7 text-xs">
          <X className="w-3 h-3 mr-1" /> Hủy
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          disabled={!form.name.trim() || isMutating}
          className="flex-1 h-7 text-xs bg-gradient-to-r from-[#1D4D8F] to-[#4C88C6] text-white border-0"
        >
          <Check className="w-3 h-3 mr-1" /> Lưu
        </Button>
      </div>
    </div>
  );
}
