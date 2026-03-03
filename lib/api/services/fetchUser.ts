import apiService from "@/lib/api/core";
import { DeleteUserResponse, UserListResponse } from "@/types/models";

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
