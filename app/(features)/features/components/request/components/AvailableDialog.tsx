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
import { Separator } from "@/components/ui/separator";
import { AvailableEmployee, ShiftType, SHIFT_TYPE_META } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (emp: AvailableEmployee) => void;
}

const BRANCHES = ["Chi nhánh Quận 1", "Chi nhánh Quận 3", "Chi nhánh Quận 7", "Trụ sở chính"];
const ALL_SHIFTS: ShiftType[] = ["morning", "afternoon", "evening", "night"];

export default function AvailableDialog({ open, onClose, onSave }: Props) {
  const [date, setDate] = useState("");
  const [selectedShifts, setSelectedShifts] = useState<ShiftType[]>([]);
  const [branch, setBranch] = useState("");
  const [note, setNote] = useState("");

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
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">Đăng sẵn sàng nhận ca</DialogTitle>
            <p className="text-emerald-50 text-sm mt-0.5">Cho đồng nghiệp biết bạn có thể nhận ca</p>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
              Ngày sẵn sàng
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm w-full"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
              Ca có thể nhận
            </Label>
            <div className="flex flex-wrap gap-2">
              {ALL_SHIFTS.map((type) => {
                const active = selectedShifts.includes(type);
                return (
                  <Button
                    key={type}
                    type="button"
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleShift(type)}
                    className={cn(
                      "text-xs transition-all",
                      active
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white hover:shadow-sm"
                        : "hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                    )}
                  >
                    {SHIFT_TYPE_META[type].label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
              Chi nhánh
            </Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="text-sm w-full">
                <SelectValue placeholder="Chọn chi nhánh..." />
              </SelectTrigger>
              <SelectContent>
                {BRANCHES.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
              Ghi chú <span className="normal-case font-normal text-neutral-400">(tùy chọn)</span>
            </Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Chỉ nhận ca sáng, không làm cuối tuần..."
              className="text-sm"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
          <Button variant="outline" onClick={onClose} className="text-sm">Hủy</Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="text-sm bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white hover:shadow-md hover:shadow-emerald-500/20 disabled:opacity-50"
          >
            Đăng lên Sàn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
