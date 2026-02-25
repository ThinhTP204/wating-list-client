import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api/services/fetchUser";
import { UserListResponse } from "@/types/models";
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
