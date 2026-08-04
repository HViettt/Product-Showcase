import { api } from "./apiClient";
import type { Product, ProductDetail, ProductDetailResponse, ProductListResponse } from "../types/product";

export const productService = {
  async getProducts(): Promise<Product[]> {
    const response = await api.get<ProductListResponse>("product");
    return response.data.data;
  },

  async getProductById(id: string): Promise<ProductDetail> {
    const response = await api.get<ProductDetailResponse>(`product/${id}`);
    return response.data.data;
  },
};
