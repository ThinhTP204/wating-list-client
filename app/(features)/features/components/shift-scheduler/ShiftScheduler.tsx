"use client";

import { useState, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Shift, ShiftStatus, AIDraftConflict } from "@/features/shifts/types";
import {
  useShifts,
  useShiftConfigs,
  useMockEmployees,
  useGenerateAIDraft,
  useApplyAIDraft,
  useCreateShift,
  useUpdateShift,
  useDeleteShift,
  usePublishShifts,
  useCopyWeekShifts,
  useCreateShiftConfig,
  useUpdateShiftConfig,
  useDeleteShiftConfig,
} from "@/features/shifts/hooks/useShifts";
import ShiftSchedulerToolbar from "./components/ShiftSchedulerToolbar";
import ShiftSchedulerGrid from "./components/ShiftSchedulerGrid";
import ShiftConfigPanel from "./components/ShiftConfigPanel";
import AssignShiftDialog from "./components/AssignShiftDialog";
import AISchedulePreviewPanel from "./components/AISchedulePreviewPanel";

// ── Date helpers ─────────────────────────────────────────────────────────────

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ShiftScheduler() {
  const [baseDate, setBaseDate] = useState<Date>(() => getMonday(new Date()));
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [prefillEmployeeId, setPrefillEmployeeId] = useState<string | undefined>();
  const [prefillDate, setPrefillDate] = useState<string | undefined>();
  const [aiConflicts, setAiConflicts] = useState<AIDraftConflict[]>([]);
  const [aiDraftShifts, setAiDraftShifts] = useState<Shift[]>([]);
  const [isAIPreviewOpen, setIsAIPreviewOpen] = useState(false);

  const viewDays = useMemo(() => {
    if (viewMode === "week") {
      const monday = getMonday(baseDate);
      return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
    } else {
      const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
      const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
      return Array.from({ length: end.getDate() }, (_, i) => addDays(start, i));
    }
  }, [baseDate, viewMode]);

  const fetchStartStr = toISODate(viewDays[0]);
  const fetchEndStr = toISODate(viewDays[viewDays.length - 1]);

  const prevWeekMonday = getMonday(addDays(baseDate, -7));
  const prevWeekStartStr = toISODate(prevWeekMonday);

  // Data
  const { data: shifts = [], isLoading: shiftsLoading } = useShifts({
    weekStart: fetchStartStr,
    weekEnd: fetchEndStr,
  });
  const { data: configs = [], isLoading: configsLoading } = useShiftConfigs();
  const { data: employees = [], isLoading: employeesLoading } = useMockEmployees();

  // Shift mutations
  const createShift = useCreateShift();
  const updateShift = useUpdateShift();
  const deleteShift = useDeleteShift();
  const publishShifts = usePublishShifts();
  const copyWeekShifts = useCopyWeekShifts();
  const generateAIDraft = useGenerateAIDraft();
  const applyAIDraft = useApplyAIDraft();

  // Config mutations
  const createConfig = useCreateShiftConfig();
  const updateConfig = useUpdateShiftConfig();
  const deleteConfig = useDeleteShiftConfig();

  const draftCount = shifts.filter((s) => s.status === "draft").length;
  const isLoading = shiftsLoading || configsLoading || employeesLoading;

  const stats = useMemo(
    () => ({
      total: shifts.length,
      published: shifts.filter((s) => s.status === "published").length,
      draft: shifts.filter((s) => s.status === "draft").length,
      absent: shifts.filter((s) => s.status === "absent").length,
    }),
    [shifts]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  function openAddDialog(employeeId: string, date: string) {
    setEditingShift(null);
    setPrefillEmployeeId(employeeId);
    setPrefillDate(date);
    setDialogOpen(true);
  }

  function openEditDialog(shift: Shift) {
    setEditingShift(shift);
    setPrefillEmployeeId(undefined);
    setPrefillDate(undefined);
    setDialogOpen(true);
  }

  function handleSaveShift(payload: {
    employeeId: string;
    configId: string;
    date: string;
    status: ShiftStatus;
    note?: string;
  }) {
    if (editingShift) {
      updateShift.mutate(
        { id: editingShift.id, ...payload },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      createShift.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  }

  function handleDeleteShift(shiftId: string) {
    deleteShift.mutate(shiftId, { onSuccess: () => setDialogOpen(false) });
  }

  function handleMoveShift(shiftId: string, newEmployeeId: string, newDate: string) {
    updateShift.mutate({ id: shiftId, employeeId: newEmployeeId, date: newDate });
  }

  function handlePublish() {
    publishShifts.mutate({ weekStart: fetchStartStr, weekEnd: fetchEndStr });
  }

  function handleCopyPrevWeek() {
    // Only valid in week mode, copies previous week exactly
    const currentMonday = getMonday(baseDate);
    copyWeekShifts.mutate({
      sourceWeekStart: prevWeekStartStr,
      targetWeekStart: toISODate(currentMonday),
    });
  }

  function handleGenerateAISchedule() {
    setAiConflicts([]);
    setAiDraftShifts([]);
    setIsAIPreviewOpen(true);
    generateAIDraft.mutate(
      { weekStart: fetchStartStr, weekEnd: fetchEndStr },
      {
        onSuccess: (result) => {
          setAiDraftShifts(result.createdShifts);
          setAiConflicts(result.conflicts);
          setIsAIPreviewOpen(true);
        },
        onError: () => {
          setIsAIPreviewOpen(false);
        },
      }
    );
  }

  function handleMoveAIDraftShift(shiftId: string, newEmployeeId: string, newDate: string) {
    setAiDraftShifts((prev) =>
      prev.map((shift) => {
        if (shift.id !== shiftId) {
          return shift;
        }
        const employee = employees.find((item) => item.id === newEmployeeId);
        if (!employee) {
          return shift;
        }
        return {
          ...shift,
          employeeId: employee.id,
          employeeName: employee.name,
          employeeRole: employee.role,
          date: newDate,
          note: "AI draft da duoc admin chinh tay truoc khi ap dung",
        };
      })
    );
  }

  function handleApplyAIDraft() {
    if (aiDraftShifts.length === 0) {
      return;
    }

    applyAIDraft.mutate(
      {
        weekStart: fetchStartStr,
        weekEnd: fetchEndStr,
        shifts: aiDraftShifts,
      },
      {
        onSuccess: () => {
          setAiDraftShifts([]);
          setAiConflicts([]);
          setIsAIPreviewOpen(false);
        },
      }
    );
  }

  function handleDiscardAIDraft() {
    setAiDraftShifts([]);
    setAiConflicts([]);
  }

  function handlePrev() {
    if (viewMode === "week") {
      setBaseDate((d) => addDays(d, -7));
    } else {
      setBaseDate((d) => {
        const nd = new Date(d);
        nd.setMonth(nd.getMonth() - 1);
        return nd;
      });
    }
  }

  function handleNext() {
    if (viewMode === "week") {
      setBaseDate((d) => addDays(d, 7));
    } else {
      setBaseDate((d) => {
        const nd = new Date(d);
        nd.setMonth(nd.getMonth() + 1);
        return nd;
      });
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        <Skeleton className="h-12 w-full rounded-xl" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 h-full bg-slate-50/50 dark:bg-black/20">
      <div className="flex flex-col h-full overflow-hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white dark:border-neutral-800">
        <ShiftSchedulerToolbar
          baseDate={viewMode === "week" ? getMonday(baseDate) : baseDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          draftCount={draftCount}
          stats={stats}
          configs={configs}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={() => setBaseDate(new Date())}
          onPublish={handlePublish}
          onCopyPrevWeek={handleCopyPrevWeek}
          onGenerateAI={handleGenerateAISchedule}
          onToggleConfigPanel={() => setIsConfigPanelOpen((v) => !v)}
          isConfigPanelOpen={isConfigPanelOpen}
          isPublishing={publishShifts.isPending}
          isCopying={copyWeekShifts.isPending}
          isGeneratingAI={generateAIDraft.isPending}
        />

        <AISchedulePreviewPanel
          draftShifts={aiDraftShifts}
          conflicts={aiConflicts}
          configs={configs}
          employees={employees}
          viewDays={viewDays}
          isSaving={applyAIDraft.isPending}
          onMoveDraftShift={handleMoveAIDraftShift}
          onApplyDraft={handleApplyAIDraft}
          onDiscardDraft={() => {
            handleDiscardAIDraft();
            setIsAIPreviewOpen(false);
          }}
          open={isAIPreviewOpen}
          onOpenChange={setIsAIPreviewOpen}
        />

        <div className="flex-1 overflow-y-auto">
          <ShiftSchedulerGrid
            viewDays={viewDays}
            viewMode={viewMode}
            shifts={shifts}
            configs={configs}
            employees={employees}
            onAddShift={openAddDialog}
            onEditShift={openEditDialog}
            onMoveShift={handleMoveShift}
          />
        </div>

        {/* Config panel overlay */}
        <AnimatePresence>
          {isConfigPanelOpen && (
            <ShiftConfigPanel
              configs={configs}
              onClose={() => setIsConfigPanelOpen(false)}
              onCreate={(data) => createConfig.mutate(data)}
              onUpdate={(id, data) => updateConfig.mutate({ id, data })}
              onDelete={(id) => deleteConfig.mutate(id)}
              isMutating={
                createConfig.isPending || updateConfig.isPending || deleteConfig.isPending
              }
            />
          )}
        </AnimatePresence>

        {/* Assign/edit dialog */}
        <AssignShiftDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          editingShift={editingShift}
          prefillEmployeeId={prefillEmployeeId}
          prefillDate={prefillDate}
          employees={employees}
          configs={configs}
          onSave={handleSaveShift}
          onDelete={handleDeleteShift}
          isSaving={createShift.isPending || updateShift.isPending || deleteShift.isPending}
        />
      </div>
    </div>
  );
}
