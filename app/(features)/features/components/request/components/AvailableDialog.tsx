"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, MessageSquare, UserCheck, Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { AvailableEmployee, ShiftType, SHIFT_TYPE_META } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (emp: AvailableEmployee) => void;
}

const BRANCHES   = ["Chi nhánh Quận 1", "Chi nhánh Quận 3", "Chi nhánh Quận 7", "Trụ sở chính"];
const ALL_SHIFTS: ShiftType[] = ["morning", "afternoon", "evening", "night"];

const SHIFT_ICONS: Record<ShiftType, React.ElementType> = {
  morning:   Sunrise,
  afternoon: Sun,
  evening:   Sunset,
  night:     Moon,
};

export default function AvailableDialog({ open, onClose, onSave }: Props) {
  const [date, setDate]                   = useState("");
  const [selectedShifts, setSelectedShifts] = useState<ShiftType[]>([]);
  const [branch, setBranch]               = useState("");
  const [note, setNote]                   = useState("");

  const toggleShift = (type: ShiftType) =>
    setSelectedShifts((prev) =>
      prev.includes(type) ? prev.filter((s) => s !== type) : [...prev, type]
    );

  const isValid = date && selectedShifts.length > 0 && branch;

  const handleSubmit = () => {
    if (!isValid) return;
    onSave({
      id: Date.now().toString(),
      name: "Bạn",
      position: "Nhân viên",
      department: "Của tôi",
      isOnline: true,
      availableDate: date,
      availableShifts: selectedShifts,
      branch,
      note: note || undefined,
      createdAt: new Date().toISOString(),
      isOwn: true,
    });
    onClose();
    setDate(""); setSelectedShifts([]); setBranch(""); setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Đăng sẵn sàng nhận ca</DialogTitle>

        {/* Gradient header */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-emerald-500 px-6 py-5">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <UserCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Đăng sẵn sàng nhận ca</span>
            </div>
            <p className="text-emerald-50/80 text-sm">Cho đồng nghiệp biết bạn có thể nhận ca</p>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">

          {/* Ngày sẵn sàng */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Ngày sẵn sàng
              </Label>
            </div>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm w-full focus-visible:ring-emerald-500"
            />
          </div>

          {/* Ca có thể nhận */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Sun className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Ca có thể nhận
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ALL_SHIFTS.map((type) => {
                const active = selectedShifts.includes(type);
                const Icon   = SHIFT_ICONS[type];
                const meta   = SHIFT_TYPE_META[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleShift(type)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                      active
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 border-transparent text-white shadow-sm"
                        : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-emerald-300 dark:hover:border-emerald-700"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5 shrink-0", active ? "text-white" : meta.color)} />
                    <span className="text-xs">{meta.label}</span>
                    {active && (
                      <span className="ml-auto w-4 h-4 rounded-full bg-white/25 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chi nhánh */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <Label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Chi nhánh
              </Label>
            </div>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="text-sm w-full focus:ring-emerald-500">
                <SelectValue placeholder="Chọn chi nhánh..." />
              </SelectTrigger>
              <SelectContent>
                {BRANCHES.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ghi chú */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
              </div>
              <Label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Ghi chú <span className="normal-case font-normal text-neutral-400">(tùy chọn)</span>
              </Label>
            </div>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Chỉ nhận ca sáng, không làm cuối tuần..."
              className="text-sm focus-visible:ring-emerald-500"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 gap-2">
          <Button variant="outline" onClick={onClose} className="text-sm">Hủy</Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="text-sm bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white hover:shadow-md hover:shadow-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            Đăng lên Sàn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
