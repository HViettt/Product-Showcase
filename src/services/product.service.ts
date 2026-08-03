import axios from "axios";
import type { Product, ProductDetail, ProductDetailResponse, ProductListResponse } from "../types/product";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  timeout: 10000,
});

export const productService = {
  async getProducts(): Promise<Product[]> {
    const response = await api.get<ProductListResponse>("/product");
    return response.data.data;
  },

  async getProductById(id: string): Promise<ProductDetail> {
    const response = await api.get<ProductDetailResponse>(`/product/${id}`);
    return response.data.data;
  },
};
