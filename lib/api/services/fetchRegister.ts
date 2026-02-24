import apiService from "@/lib/api/core";

export interface RegisterRequest {
  email: string;
  phone_number: string;
  full_name: string;
  referral_code?: string;
}

export interface RegisterData {
  id: string;
  email: string;
  phone_number: string;
  full_name: string;
  referral_code: string;
  status: string;
  created_at: string;
  is_active: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: RegisterData;
  metadata?: Record<string, object>;
}


export async function fetchRegister(payload: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiService.post<RegisterResponse, RegisterRequest>(
    "/api/v1/users",
    payload
  );
  return response.data;
}
