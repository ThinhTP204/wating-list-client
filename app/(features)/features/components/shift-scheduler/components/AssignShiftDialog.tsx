"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Shift, ShiftConfig, ShiftStatus, MockEmployee } from "@/features/shifts/types";

interface AssignShiftDialogProps {
  open: boolean;
  onClose: () => void;
  editingShift: Shift | null;
  prefillEmployeeId?: string;
  prefillDate?: string;
  employees: MockEmployee[];
  configs: ShiftConfig[];
  onSave: (payload: {
    employeeId: string;
    configId: string;
    date: string;
    status: ShiftStatus;
    note?: string;
  }) => void;
  onDelete?: (shiftId: string) => void;
  isSaving?: boolean;
}

const STATUS_OPTIONS: { value: ShiftStatus; label: string }[] = [
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã công bố" },
  { value: "absent", label: "Vắng" },
];

export default function AssignShiftDialog({
  open,
  onClose,
  editingShift,
  prefillEmployeeId,
  prefillDate,
  employees,
  configs,
  onSave,
  onDelete,
  isSaving,
}: AssignShiftDialogProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [configId, setConfigId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<ShiftStatus>("draft");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (editingShift) {
      setEmployeeId(editingShift.employeeId);
      setConfigId(editingShift.configId);
      setDate(editingShift.date);
      setStatus(editingShift.status);
      setNote(editingShift.note ?? "");
    } else {
      setEmployeeId(prefillEmployeeId ?? "");
      setConfigId(configs[0]?.id ?? "");
      setDate(prefillDate ?? "");
      setStatus("draft");
      setNote("");
    }
  }, [open, editingShift, prefillEmployeeId, prefillDate, configs]);

  const isValid = employeeId && configId && date;

  function handleSave() {
    if (!isValid) return;
    onSave({ employeeId, configId, date, status, note: note || undefined });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="p-0 overflow-hidden gap-0 max-w-md">
        <div className="bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6] px-6 py-4">
          <DialogTitle className="text-white text-base font-semibold">
            {editingShift ? "Chỉnh sửa ca làm việc" : "Phân ca làm việc"}
          </DialogTitle>
          <p className="text-blue-200 text-xs mt-0.5">
            {editingShift ? "Cập nhật thông tin ca" : "Gán ca mới cho nhân viên"}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nhân viên
            </Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                    <span className="ml-1.5 text-slate-400 text-xs">({e.role})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Loại ca
            </Label>
            <Select value={configId} onValueChange={setConfigId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại ca" />
              </SelectTrigger>
              <SelectContent>
                {configs.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.name}
                      <span className="text-slate-400 text-xs">
                        {c.startTime} – {c.endTime}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ngày
              </Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trạng thái
              </Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ShiftStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ghi chú (tùy chọn)
            </Label>
            <Input
              placeholder="Ghi chú thêm..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-3 flex-row justify-between">
          {editingShift && onDelete ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(editingShift.id)}
              disabled={isSaving}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Xóa ca
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isValid || isSaving}
              className="bg-gradient-to-r from-[#1D4D8F] to-[#4C88C6] text-white hover:brightness-110 border-0"
            >
              {isSaving ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
