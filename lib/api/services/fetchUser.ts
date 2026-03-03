import apiService from "@/lib/api/core";
import { DeleteUserResponse, ReferralStatsResponse, UserListResponse } from "@/types/models";

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  apiKey: string;
}

export async function fetchUsers({
  page = 1,
  limit = 10,
  apiKey,
}: FetchUsersParams): Promise<UserListResponse> {
  const response = await apiService.request<UserListResponse>({
    method: "GET",
    url: "/api/v1/users",
    params: { page, limit },
    headers: {
      "x-api-key": apiKey,
    },
  });
  return response.data;
}

export interface DeleteUserParams {
  userId: string;
  apiKey: string;
}

export interface FetchReferralStatsParams {
  apiKey: string;
}

export async function fetchReferralStats({
  apiKey,
}: FetchReferralStatsParams): Promise<ReferralStatsResponse> {
  const response = await apiService.request<ReferralStatsResponse>({
    method: "GET",
    url: "/api/v1/users/referral-stats",
    headers: {
      "x-api-key": apiKey,
    },
  });
  return response.data;
}

export async function deleteUser({
  userId,
  apiKey,
}: DeleteUserParams): Promise<DeleteUserResponse> {
  const response = await apiService.request<DeleteUserResponse>({
    method: "DELETE",
    url: `/api/v1/users/${userId}`,
    headers: {
      "x-api-key": apiKey,
    },
  });
  return response.data;
}
