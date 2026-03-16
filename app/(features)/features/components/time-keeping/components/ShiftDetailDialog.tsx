"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock } from "lucide-react";

interface Shift {
  id: string;
  name: string;
  time: string;
}

interface ShiftDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName: string;
  dayLabel: string;
  shifts: Shift[];
}

export default function ShiftDetailDialog({
  open,
  onOpenChange,
  employeeName,
  dayLabel,
  shifts,
}: ShiftDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base">
            Ca làm việc — {dayLabel}
          </DialogTitle>
          <p className="text-sm text-neutral-500">{employeeName}</p>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#8f58e4]" />
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {shift.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <Clock className="w-3 h-3" />
                {shift.time}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
