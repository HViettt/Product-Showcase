export type ProductCategory =
  | "Laptop"
  | "Smartphone"
  | "Tablet"
  | "Smartwatch"
  | "Headphone"
  | "Camera"
  | "Accessory";

export type ProductStatus = "Available" | "Out of Stock" | "Coming Soon";
export type Currency = "VND";
export type SortByOption = "price" | "rating" | "createdAt" | "updatedAt" | "name";
export type SortOrder = "asc" | "desc";

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  image: string;
  description: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  currency: Currency;
  inStock: boolean;
  stockQuantity: number;
  status: ProductStatus;
  rating: number;
  reviewCount: number;
  releaseYear: number;
  color: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail extends Product {
  fullDescription: string;
  specifications: Record<string, string>;
  images: string[];
  warranty: string;
}

export interface ProductFilterState {
  search: string;
  category: ProductCategory | "All";
  brand: string[];
  color: string[];
  tags: string[];
  status: ProductStatus | "All";
  minPrice: number;
  maxPrice: number;
  inStock: boolean | null;
  minStockQuantity: number;
  minRating: number;
  releaseYear: number | null;
  createdAtFrom: string;
  createdAtTo: string;
  sortBy: SortByOption;
  order: SortOrder;
  page: number;
  limit: number;
}

export interface ProductListResponse {
  success: boolean;
  message?: string;
  data: Product[];
}

export interface ProductDetailResponse {
  success: boolean;
  message?: string;
  data: ProductDetail;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  avatar: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}