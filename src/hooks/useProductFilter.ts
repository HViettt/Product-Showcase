import { useState, useMemo } from "react";
import type { Product, ProductFilterState } from "../types/product";

// 1. Freeze initial state để chống mutation ngầm ngoài ý muốn
export const initialFilterState = Object.freeze<ProductFilterState>({
  search: "",
  category: "All",
  brand: [],
  color: [],
  tags: [],
  status: "All",
  minPrice: 0,
  maxPrice: 100000000,
  inStock: null,
  minStockQuantity: 0,
  minRating: 0,
  releaseYear: null,
  createdAtFrom: "",
  createdAtTo: "",
  sortBy: "createdAt",
  order: "desc",
  page: 1,
  limit: 12,
});

// Helper: Tách logic so sánh Sort thành hàm riêng cho dễ đọc & mở rộng
const compareProducts = (a: Product, b: Product, sortBy: ProductFilterState["sortBy"]): number => {
  switch (sortBy) {
    case "name":
      return a.name.localeCompare(b.name);
    case "price":
      return a.price - b.price;
    case "rating":
      return a.rating - b.rating;
    case "createdAt":
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    case "updatedAt":
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    default:
      return 0;
  }
};

export const useProductFilter = (products: Product[]) => {
  const [filters, setFilters] = useState<ProductFilterState>(initialFilterState);

  // 2. Syntax updateFilter ngắn gọn, tự nhiên hơn
  const updateFilter = <K extends keyof ProductFilterState>(
    key: K,
    value: ProductFilterState[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" && { page: 1 }), // Tự động reset về trang 1 nếu đổi bộ lọc
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  // 3. Tính toán nhanh biến Flag báo hiệu trạng thái lọc cho UI
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.trim() !== "" ||
      filters.category !== "All" ||
      filters.brand.length > 0 ||
      filters.color.length > 0 ||
      filters.tags.length > 0 ||
      filters.status !== "All" ||
      filters.minPrice > initialFilterState.minPrice ||
      filters.maxPrice < initialFilterState.maxPrice ||
      filters.inStock !== null ||
      filters.minStockQuantity > 0 ||
      filters.minRating > 0 ||
      filters.releaseYear !== null ||
      filters.createdAtFrom !== "" ||
      filters.createdAtTo !== ""
    );
  }, [filters]);

  // 4. Data Processing Pipeline (Filter -> Sort -> Paginate)
  const { filteredProducts, totalItems, totalPages, paginatedProducts } = useMemo(() => {
    // Tối ưu hóa: Tính keyword 1 lần duy nhất ở ngoài loop
    const keyword = filters.search.trim().toLowerCase();

    // STEP 1: FILTER
    const result = products.filter((product) => {
      const matchesSearch = !keyword || product.name.toLowerCase().includes(keyword);
      const matchesCategory = filters.category === "All" || product.category === filters.category;
      const matchesBrand = filters.brand.length === 0 || filters.brand.includes(product.brand);
      const matchesColor = filters.color.length === 0 || filters.color.includes(product.color);
      const matchesTags =
        filters.tags.length === 0 || filters.tags.some((tag) => product.tags.includes(tag));
      const matchesStatus = filters.status === "All" || product.status === filters.status;
      const matchesPrice =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;
      const matchesInStock = filters.inStock === null || product.inStock === filters.inStock;
      const matchesStockQuantity = product.stockQuantity >= filters.minStockQuantity;
      const matchesRating = product.rating >= filters.minRating;
      const matchesReleaseYear =
        filters.releaseYear === null || product.releaseYear === filters.releaseYear;
      const createdAtTimestamp = new Date(product.createdAt).getTime();
      const createdAtFrom = filters.createdAtFrom ? new Date(filters.createdAtFrom).getTime() : null;
      const createdAtTo = filters.createdAtTo ? new Date(filters.createdAtTo).getTime() : null;
      const matchesCreatedAtFrom = createdAtFrom === null || createdAtTimestamp >= createdAtFrom;
      const matchesCreatedAtTo = createdAtTo === null || createdAtTimestamp <= createdAtTo;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesColor &&
        matchesTags &&
        matchesStatus &&
        matchesPrice &&
        matchesInStock &&
        matchesStockQuantity &&
        matchesRating &&
        matchesReleaseYear &&
        matchesCreatedAtFrom &&
        matchesCreatedAtTo
      );
    });

    // STEP 2: SORT
    const sortMultiplier = filters.order === "asc" ? 1 : -1;
    result.sort((a, b) => compareProducts(a, b, filters.sortBy) * sortMultiplier);

    // STEP 3: PAGINATION
    const totalItems = result.length;
    const safeLimit = Math.max(filters.limit, 1); // Chống Infinity nếu limit = 0
    const totalPages = Math.ceil(totalItems / safeLimit) || 1;

    const safePage = Math.min(Math.max(filters.page, 1), totalPages);
    const startIndex = (safePage - 1) * safeLimit;
    const paginatedProducts = result.slice(startIndex, startIndex + safeLimit);

    return {
      filteredProducts: result,
      totalItems,
      totalPages,
      paginatedProducts,
    };
  }, [products, filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    filteredProducts,
    paginatedProducts,
    totalItems,
    totalPages,
  };
};