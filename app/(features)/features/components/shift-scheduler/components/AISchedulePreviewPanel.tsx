"use client";

import { AlertTriangle, Check, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { AIDraftConflict, MockEmployee, Shift, ShiftConfig } from "@/features/shifts/types";
import ShiftSchedulerGrid from "./ShiftSchedulerGrid";

interface AISchedulePreviewPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftShifts: Shift[];
  conflicts: AIDraftConflict[];
  configs: ShiftConfig[];
  employees: MockEmployee[];
  viewDays: Date[];
  isSaving?: boolean;
  onMoveDraftShift: (shiftId: string, employeeId: string, date: string) => void;
  onApplyDraft: () => void;
  onDiscardDraft: () => void;
}

function formatDateLabel(date: string): string {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function AISchedulePreviewPanel({
  open,
  onOpenChange,
  draftShifts,
  conflicts,
  configs,
  employees,
  viewDays,
  isSaving,
  onMoveDraftShift,
  onApplyDraft,
  onDiscardDraft,
}: AISchedulePreviewPanelProps) {
  if (!open && draftShifts.length === 0 && conflicts.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[92vh] w-[98vw] max-w-screen-2xl p-0 gap-0 overflow-hidden border-violet-200 dark:border-violet-900 bg-violet-50/95 dark:bg-neutral-950 [&>button]:hidden">
        <DialogTitle className="sr-only">Bang mau xep lich AI</DialogTitle>
        <div className="flex h-full min-h-0 flex-col rounded-xl p-3">
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                Bảng mẫu xếp lịch AI đề xuất cho tuần này
              </p>
              <Badge
                variant="outline"
                className="border-violet-300 bg-white text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-200"
              >
                {draftShifts.length} ca đề xuất
              </Badge>
              {conflicts.length > 0 && (
                <Badge
                  variant="outline"
                  className="border-red-300 bg-white text-red-600 dark:border-red-700 dark:bg-red-950 dark:text-red-300"
                >
                  {conflicts.length} xung đột
                </Badge>
              )}
            </div>

            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={onDiscardDraft}
                className="h-9 rounded-xl border-slate-300 bg-red-500 px-4 text-xs text-white font-semibold whitespace-nowrap dark:border-neutral-700 dark:bg-neutral-900"
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Hủy bỏ
              </Button>
              <Button
                size="sm"
                onClick={onApplyDraft}
                disabled={draftShifts.length === 0 || isSaving}
                className="h-9 rounded-xl border-0 bg-linear-to-r from-emerald-600 to-teal-600 px-4 text-xs font-semibold text-white whitespace-nowrap hover:brightness-110"
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                {isSaving ? "Đang lưu..." : "Lưu và áp dụng lịch AI"}
              </Button>
            </div>
          </div>

          <p className="mt-2 text-xs text-violet-700/90 dark:text-violet-300/90">
            Kéo thả để điều chỉnh vị trí ca đề xuất. Các ca có viền tím là do AI đề xuất, các ca có
            viền đỏ là những ca đang thiếu người so với yêu cầu.
          </p>

          <div className="mt-3 flex-1 min-h-0 overflow-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {draftShifts.length > 0 && (
              <div className="rounded-lg border border-violet-200 bg-white dark:border-violet-800 dark:bg-neutral-950/60">
                <ShiftSchedulerGrid
                  viewDays={viewDays}
                  viewMode="week"
                  shifts={draftShifts}
                  configs={configs}
                  employees={employees}
                  disableAddShift
                  onAddShift={() => {}}
                  onEditShift={() => {}}
                  onMoveShift={onMoveDraftShift}
                />
              </div>
            )}

            {conflicts.length > 0 && (
              <div className="mt-3 space-y-2">
                {conflicts.map((conflict) => {
                  const cfg = configs.find((item) => item.id === conflict.shiftConfigId);
                  return (
                    <div
                      key={`${conflict.date}-${conflict.shiftConfigId}`}
                      className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 dark:border-red-800 dark:bg-red-950/30"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600" />
                        <div>
                          <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                            {formatDateLabel(conflict.date)} · {cfg?.name ?? "Ca"} · thiếu{" "}
                            {Math.max(0, conflict.required - conflict.assigned)} ngưởi
                          </p>
                          <p className="mt-0.5 text-xs text-red-600/90 dark:text-red-300/90">
                            {conflict.reason}
                          </p>
                          <p className="mt-0.5 text-xs text-red-600/80 dark:text-red-300/80">
                            {conflict.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
