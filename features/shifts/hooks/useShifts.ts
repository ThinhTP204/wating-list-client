import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import type { ApiError } from "@/shared/lib/api/client";
import type { ShiftConfig, Shift, MockEmployee } from "@/features/shifts/types";
import {
  fetchMockEmployees,
  fetchShiftConfigs,
  createShiftConfig,
  updateShiftConfig,
  deleteShiftConfig,
  fetchShifts,
  fetchShiftsByEmployee,
  createShift,
  updateShift,
  deleteShift,
  publishShifts,
  copyWeekShifts,
  type FetchShiftsParams,
  type CreateShiftPayload,
  type UpdateShiftPayload,
} from "@/features/shifts/services/shiftApi";

// ── Employees ──────────────────────────────────────────────────────────────

export function useMockEmployees() {
  return useQuery<MockEmployee[], ApiError>({
    queryKey: [QUERY_KEYS.MOCK_EMPLOYEES],
    queryFn: fetchMockEmployees,
    staleTime: Infinity,
  });
}

// ── ShiftConfig queries & mutations ────────────────────────────────────────

export function useShiftConfigs() {
  return useQuery<ShiftConfig[], ApiError>({
    queryKey: [QUERY_KEYS.SHIFT_CONFIGS],
    queryFn: fetchShiftConfigs,
    staleTime: Infinity,
  });
}

export function useCreateShiftConfig() {
  const qc = useQueryClient();
  return useMutation<ShiftConfig, ApiError, Omit<ShiftConfig, "id">>({
    mutationFn: createShiftConfig,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.SHIFT_CONFIGS] });
      toast.success("Đã thêm cấu hình ca");
    },
    onError: () => toast.error("Không thể thêm cấu hình ca. Vui lòng thử lại."),
  });
}

export function useUpdateShiftConfig() {
  const qc = useQueryClient();
  return useMutation<ShiftConfig, ApiError, { id: string; data: Partial<Omit<ShiftConfig, "id">> }>({
    mutationFn: ({ id, data }) => updateShiftConfig(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.SHIFT_CONFIGS] });
      toast.success("Đã cập nhật cấu hình ca");
    },
    onError: () => toast.error("Không thể cập nhật cấu hình ca. Vui lòng thử lại."),
  });
}

export function useDeleteShiftConfig() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: deleteShiftConfig,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.SHIFT_CONFIGS] });
      toast.success("Đã xóa cấu hình ca");
    },
    onError: () => toast.error("Không thể xóa cấu hình ca. Vui lòng thử lại."),
  });
}

// ── Shift queries & mutations ──────────────────────────────────────────────

export function useShifts({ weekStart, weekEnd }: FetchShiftsParams, enabled = true) {
  return useQuery<Shift[], ApiError>({
    queryKey: [QUERY_KEYS.SHIFTS, weekStart, weekEnd],
    queryFn: () => fetchShifts({ weekStart, weekEnd }),
    enabled: enabled && !!weekStart && !!weekEnd,
  });
}

export function useShiftsByEmployee(
  employeeId: string,
  monthStart: string,
  monthEnd: string,
  enabled = true
) {
  return useQuery<Shift[], ApiError>({
    queryKey: [QUERY_KEYS.SHIFTS, employeeId, monthStart, monthEnd],
    queryFn: () => fetchShiftsByEmployee(employeeId, monthStart, monthEnd),
    enabled: enabled && !!employeeId,
  });
}

export function useCreateShift() {
  const qc = useQueryClient();
  return useMutation<Shift, ApiError, CreateShiftPayload>({
    mutationFn: createShift,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.SHIFTS] });
      toast.success("Đã phân ca thành công");
    },
    onError: () => toast.error("Không thể phân ca. Vui lòng thử lại."),
  });
}

export function useUpdateShift() {
  const qc = useQueryClient();
  return useMutation<Shift, ApiError, UpdateShiftPayload>({
    mutationFn: updateShift,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.SHIFTS] });
    },
    onError: () => toast.error("Không thể cập nhật ca. Vui lòng thử lại."),
  });
}

export function useDeleteShift() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: deleteShift,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.SHIFTS] });
      toast.success("Đã xóa ca làm việc");
    },
    onError: () => toast.error("Không thể xóa ca. Vui lòng thử lại."),
  });
}

export function usePublishShifts() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { weekStart: string; weekEnd: string }>({
    mutationFn: ({ weekStart, weekEnd }) => publishShifts(weekStart, weekEnd),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.SHIFTS] });
      toast.success("Đã công bố lịch làm việc");
    },
    onError: () => toast.error("Không thể công bố lịch. Vui lòng thử lại."),
  });
}

export function useCopyWeekShifts() {
  const qc = useQueryClient();
  return useMutation<Shift[], ApiError, { sourceWeekStart: string; targetWeekStart: string }>({
    mutationFn: ({ sourceWeekStart, targetWeekStart }) =>
      copyWeekShifts(sourceWeekStart, targetWeekStart),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.SHIFTS] });
      toast.success(`Đã sao chép ${data.length} ca từ tuần trước`);
    },
    onError: () => toast.error("Không thể sao chép lịch. Vui lòng thử lại."),
  });
}
