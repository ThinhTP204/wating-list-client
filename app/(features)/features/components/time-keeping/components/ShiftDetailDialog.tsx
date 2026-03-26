"use client";

import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ATTENDANCE_COLORS } from "../page";
import type { Shift, AttendanceStatus } from "../page";
import { Clock, LogIn, LogOut, Trash2 } from "lucide-react";

const EDITABLE_STATUSES: { value: AttendanceStatus; label: string }[] = [
  { value: "on-time",       label: "Chấm công đúng giờ" },
  { value: "late-early",    label: "Vào trễ, ra sớm" },
  { value: "no-checkin",    label: "Chưa vào/ra ca" },
  { value: "paid-leave",    label: "Nghỉ phép có lương" },
  { value: "unpaid-leave",  label: "Nghỉ phép không lương" },
  { value: "business-trip", label: "Công tác ra ngoài" },
  { value: "day-off",       label: "Ngày nghỉ" },
  { value: "not-yet",       label: "Chưa tới" },
];

interface ShiftDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName: string;
  dayLabel: string;
  shifts: Shift[];
  onRemoveShift: (shiftId: string) => void;
  onUpdateShift: (shiftId: string, updates: Partial<Shift>) => void;
}

export default function ShiftDetailDialog({
  open,
  onOpenChange,
  employeeName,
  dayLabel,
  shifts,
  onRemoveShift,
  onUpdateShift,
}: ShiftDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden max-h-[85vh] flex flex-col gap-0">
        <DialogTitle className="sr-only">Chi tiết ca làm việc</DialogTitle>

        {/* ── Gradient header ── */}
        <div className="bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6] px-5 pt-5 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-base font-bold shrink-0 shadow-inner">
              {employeeName.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-widest font-medium mb-0.5">
                Chi tiết ca làm việc
              </p>
              <h2 className="text-sm font-bold text-white leading-tight">{employeeName}</h2>
              <p className="text-xs text-white/70 mt-0.5">{dayLabel}</p>
            </div>
            {shifts.length > 0 && (
              <div className="ml-auto bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {shifts.length} ca
              </div>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {shifts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Không có ca nào</p>
              <p className="text-xs text-neutral-400 mt-1">Ngày này chưa được xếp ca</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {shifts.map((shift, i) => (
                <motion.div
                  key={shift.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, delay: i * 0.07 }}
                >
                  <ShiftEditCard
                    shift={shift}
                    onRemove={() => onRemoveShift(shift.id)}
                    onUpdate={(updates) => onUpdateShift(shift.id, updates)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end shrink-0 bg-neutral-50/50 dark:bg-neutral-900/30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs hover:border-neutral-400 transition-colors"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShiftEditCard({
  shift,
  onRemove,
  onUpdate,
}: {
  shift: Shift;
  onRemove: () => void;
  onUpdate: (updates: Partial<Shift>) => void;
}) {
  const colors = ATTENDANCE_COLORS[shift.status];

  return (
    <div className={`rounded-xl ${colors.bg} border border-black/5 dark:border-white/5 overflow-hidden`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} ring-2 ring-white/60 dark:ring-black/20`} />
          <span className={`text-sm font-semibold ${colors.text}`}>{shift.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-full">
            <Clock className="w-2.5 h-2.5" />
            {shift.time}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
            onClick={onRemove}
            aria-label="Xóa ca"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="px-3 pb-3 space-y-2.5">
        {/* Status selector */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Trạng thái
          </p>
          <Select
            value={shift.status}
            onValueChange={(val) => onUpdate({ status: val as AttendanceStatus })}
          >
            <SelectTrigger className="h-8 text-xs bg-white/60 dark:bg-black/20 border-black/10 dark:border-white/10 focus:ring-[#4C88C6]/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EDITABLE_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value} className="text-xs">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check-in / Check-out */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
              <LogIn className="w-3 h-3 text-emerald-500" />
              Giờ vào
            </p>
            <Input
              type="time"
              className="h-8 text-xs bg-white/60 dark:bg-black/20 border-black/10 dark:border-white/10 focus-visible:ring-[#4C88C6]/30"
              value={shift.checkIn ?? ""}
              onChange={(e) => onUpdate({ checkIn: e.target.value || undefined })}
            />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
              <LogOut className="w-3 h-3 text-rose-400" />
              Giờ ra
            </p>
            <Input
              type="time"
              className="h-8 text-xs bg-white/60 dark:bg-black/20 border-black/10 dark:border-white/10 focus-visible:ring-[#4C88C6]/30"
              value={shift.checkOut ?? ""}
              onChange={(e) => onUpdate({ checkOut: e.target.value || undefined })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
