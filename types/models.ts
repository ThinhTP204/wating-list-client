
// User List Item (from GET /api/v1/users)
export interface UserItem {
  id: string;
  email: string;
  phone_number: string;
  full_name: string;
  referral_code: string;
  status: string;
  created_at: string;
  is_active: boolean;
}

export interface UserListPagination {
  page: number;
  limit: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: UserItem[];
  pagination: UserListPagination;
  metadata?: Record<string, object>;
}

// Referral Stats Response
export interface ReferralStat {
  referral_code: string;
  total_users: number;
}

export interface ReferralStatsResponse {
  success: boolean;
  message: string;
  data: ReferralStat[];
  metadata?: Record<string, object>;
}

// Delete User Response
export interface DeleteUserErrorDetail {
  loc: [string, number];
  msg: string;
  type: string;
  input: string;
  ctx: Record<string, unknown>;
}

export interface DeleteUserResponse {
  detail: DeleteUserErrorDetail[];
}

// User Model
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Product Model
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
}

// Order Model
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
