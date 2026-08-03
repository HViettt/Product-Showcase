import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, RefreshCw, PackageX, Loader2 } from "lucide-react";
import axios from "axios";

import type { Product } from "../types/product";
import { productService } from "../services/product.service";
import { useProductFilter } from "../hooks/useProductFilter";
import { getUniqueProductOptions } from "../utils/productOptions";

import { Header } from "../components/common/Header";
import { ProductCard } from "../components/common/ProductCard";
import { Pagination } from "../components/common/Pagination";
import { FilterSidebar } from "../components/filter/FilterSidebar";
import { ProductToolbar } from "../components/product/ProductToolbar";

export function ProductListPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Không thể tải danh sách sản phẩm."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProducts();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchProducts]);

  const filterOptions = useMemo(() => getUniqueProductOptions(products), [products]);

  const {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    paginatedProducts,
    totalItems,
    totalPages,
  } = useProductFilter(products);

  const handleViewDetail = useCallback((id: string) => {
    navigate(`/product/${id}`);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bg-main text-text-primary flex flex-col font-sans animate-fade-in-up">
      <Header
        onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
        hasActiveFilters={hasActiveFilters}
      />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-text-primary tracking-tight">
            Khám Phá Sản Phẩm
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-text-secondary">
            Trải nghiệm tìm kiếm và lọc thiết bị công nghệ hàng đầu
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-brand mb-4" />
            <p className="text-sm font-semibold text-text-secondary">
              Đang tải danh sách sản phẩm...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div role="alert" className="flex flex-col items-center justify-center py-16 rounded-xl bg-bg-surface border border-danger/20 p-8 text-center shadow-sm">
            <AlertCircle className="h-12 w-12 text-danger mb-3" />
            <h3 className="text-base font-bold font-display text-text-primary mb-1">Đã có lỗi xảy ra</h3>
            <p className="text-xs text-text-secondary mb-4 max-w-md">{error}</p>
            <button
              type="button"
              onClick={fetchProducts}
              className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand/90 active:scale-[0.97] transition-all cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Thử lại</span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        {!isLoading && !error && (
          <div className="flex flex-col lg:flex-row gap-8">
            <FilterSidebar
              filters={filters}
              availableCategories={filterOptions.categories}
              availableBrands={filterOptions.brands}
              availableColors={filterOptions.colors}
              availableTags={filterOptions.tags}
              availableYears={filterOptions.years}
              onUpdateFilter={updateFilter}
              onResetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
              isOpenMobile={isMobileFilterOpen}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0">
              <ProductToolbar
                totalItems={totalItems}
                sortBy={filters.sortBy}
                order={filters.order}
                onSortByChange={(val) => updateFilter("sortBy", val)}
                onOrderChange={(val) => updateFilter("order", val)}
              />

              {paginatedProducts.length > 0 ? (
                <div aria-live="polite" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onViewDetail={handleViewDetail} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 rounded-xl bg-bg-surface border border-border-main p-8 text-center shadow-sm my-auto">
                  <PackageX className="h-12 w-12 text-text-secondary/40 mb-3" />
                  <h3 className="text-base font-bold font-display text-text-primary mb-1">Không tìm thấy sản phẩm nào</h3>
                  <p className="text-xs text-text-secondary mb-4">Thử điều chỉnh lại từ khóa hoặc xóa bộ lọc.</p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-lg bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand/90 active:scale-[0.97] transition-all cursor-pointer"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  )}
                </div>
              )}

              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={filters.limit}
                onPageChange={(page) => updateFilter("page", page)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}