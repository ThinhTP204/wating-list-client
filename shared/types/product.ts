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
