import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, fetchReferralStats, fetchUsers } from "@/lib/api/services/fetchUser";
import { DeleteUserResponse, ReferralStatsResponse, UserListResponse } from "@/types/models";
import { ApiError } from "@/lib/api/core";
import { QUERY_KEYS } from "@/lib/constants";

interface UseUsersOptions {
  page?: number;
  limit?: number;
  apiKey: string;
  enabled?: boolean;
}

export function useUsers({ page = 1, limit = 10, apiKey, enabled = true }: UseUsersOptions) {
  return useQuery<UserListResponse, ApiError>({
    queryKey: [QUERY_KEYS.USERS, page, limit, apiKey],
    queryFn: () => fetchUsers({ page, limit, apiKey }),
    enabled: enabled && !!apiKey,
  });
}

export function useReferralStats({ apiKey, enabled = true }: { apiKey: string; enabled?: boolean }) {
  return useQuery<ReferralStatsResponse, ApiError>({
    queryKey: [QUERY_KEYS.REFERRAL_STATS, apiKey],
    queryFn: () => fetchReferralStats({ apiKey }),
    enabled: enabled && !!apiKey,
  });
}

export function useDeleteUser(apiKey: string) {
  const queryClient = useQueryClient();
  return useMutation<DeleteUserResponse, ApiError, string>({
    mutationFn: (userId: string) => deleteUser({ userId, apiKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });
}
