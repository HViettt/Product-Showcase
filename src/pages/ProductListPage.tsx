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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      <Header
        onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
        hasActiveFilters={hasActiveFilters}
      />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Khám Phá Sản Phẩm
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Trải nghiệm tìm kiếm và lọc thiết bị công nghệ hàng đầu
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Đang tải danh sách sản phẩm...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div role="alert" className="flex flex-col items-center justify-center py-16 rounded-3xl bg-white border border-rose-100 p-8 text-center shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <AlertCircle className="h-12 w-12 text-rose-500 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Đã có lỗi xảy ra</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-md">{error}</p>
            <button type="button" onClick={fetchProducts} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-600 transition-all dark:bg-blue-600 dark:hover:bg-blue-500">
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
                <div aria-live="polite" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onViewDetail={handleViewDetail} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 rounded-3xl bg-white border border-slate-100 p-8 text-center shadow-sm dark:bg-slate-900 dark:border-slate-800 my-auto">
                  <PackageX className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Không tìm thấy sản phẩm nào</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Thử điều chỉnh lại từ khóa hoặc xóa bộ lọc.</p>
                  {hasActiveFilters && (
                    <button type="button" onClick={resetFilters} className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition-all">
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