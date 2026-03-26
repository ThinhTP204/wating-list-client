"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { AVAILABLE_SHIFTS } from "../page";
import { Clock } from "lucide-react";

interface AddShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (shift: { name: string; time: string }) => void;
}

const SHIFT_GRADIENTS = [
  "from-[#102854] to-[#4C88C6]",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-sky-500 to-blue-500",
  "from-rose-500 to-pink-500",
];

export default function AddShiftDialog({
  open,
  onOpenChange,
  onSelect,
}: AddShiftDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">Chọn ca làm việc</DialogTitle>

        {/* ── Gradient header ── */}
        <div className="bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6] px-5 pt-5 pb-4">
          <p className="text-xs text-white/60 uppercase tracking-widest font-medium mb-0.5">Xếp ca</p>
          <h2 className="text-base font-bold text-white">Chọn ca làm việc</h2>
          <p className="text-xs text-white/60 mt-0.5">Chọn khung giờ phù hợp cho nhân viên</p>
        </div>

        {/* ── Shift list ── */}
        <div className="px-4 py-3 space-y-2">
          {AVAILABLE_SHIFTS.map((shift, i) => (
            <motion.button
              key={shift.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-[#4C88C6]/50 hover:bg-[#4C88C6]/5 dark:hover:bg-[#4C88C6]/10 transition-all duration-200 text-left group"
              onClick={() => onSelect({ name: shift.name, time: shift.time })}
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${SHIFT_GRADIENTS[i % SHIFT_GRADIENTS.length]} flex items-center justify-center shrink-0 shadow-sm`}>
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-[#4C88C6] transition-colors leading-tight">
                  {shift.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{shift.time}</p>
              </div>
              <span className="text-xs font-medium text-neutral-300 group-hover:text-[#4C88C6] transition-colors shrink-0">
                →
              </span>
            </motion.button>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="px-4 pb-4 flex justify-end border-t border-neutral-100 dark:border-neutral-800 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Hủy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
