import { Search, RotateCcw, Filter, X } from "lucide-react";
import type { ProductCategory, ProductStatus, ProductFilterState } from "../../types/product";

interface FilterSidebarProps {
  filters: ProductFilterState;
  // Dynamic Options được sinh trực tiếp từ data của API
  availableCategories: (ProductCategory | "All")[];
  availableBrands: string[];
  availableColors: string[];
  availableTags: string[];
  availableYears: number[];
  onUpdateFilter: <K extends keyof ProductFilterState>(
    key: K,
    value: ProductFilterState[K]
  ) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

// Map nhãn trực quan, dễ bảo trì và dễ đọc hơn ba ngôi lồng nhau
const STATUS_LABEL_MAP: Record<ProductStatus | "All", string> = {
  All: "Tất cả trạng thái",
  Available: "Còn hàng",
  "Out of Stock": "Hết hàng",
  "Coming Soon": "Sắp về",
};

export function FilterSidebar({
  filters,
  availableCategories,
  availableBrands,
  availableColors,
  availableTags,
  availableYears,
  onUpdateFilter,
  onResetFilters,
  hasActiveFilters,
  isOpenMobile = false,
  onCloseMobile,
}: FilterSidebarProps) {
  // Toggle phần tử trong mảng multi-select (Brand, Color, Tags)
  const handleToggleArrayItem = (key: "brand" | "color" | "tags", item: string) => {
    const currentArray = filters[key];
    const exists = currentArray.includes(item);
    const updatedArray = exists
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];

    onUpdateFilter(key, updatedArray);
  };

  const sidebarContent = (
    <div className="flex flex-col gap-6 p-5">
      {/* Header Sidebar & Nút Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <Filter className="h-5 w-5 text-blue-600" />
          <span>Bộ Lọc Sản Phẩm</span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>

      {/* 1. Tìm kiếm sản phẩm */}
      <div>
        <label
          htmlFor="search-input"
          className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2"
        >
          Tìm kiếm
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="search-input"
            type="text"
            value={filters.search}
            onChange={(e) => onUpdateFilter("search", e.target.value)}
            placeholder="Tên sản phẩm..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500"
          />
        </div>
      </div>

      {/* 2. Danh mục sản phẩm (Dynamic từ API) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Danh Mục
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableCategories.map((cat) => {
            const isActive = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onUpdateFilter("category", cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                {cat === "All" ? "Tất cả" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Thương hiệu (Dynamic Multi-select) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Thương Hiệu
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
          {availableBrands.map((brand) => {
            const isChecked = filters.brand.includes(brand);
            const brandInputId = `brand-${brand}`;
            return (
              <label
                key={brand}
                htmlFor={brandInputId}
                className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none"
              >
                <input
                  id={brandInputId}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleArrayItem("brand", brand)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Trạng thái hàng (Mapping Label) */}
      <div>
        <label
          htmlFor="status-select"
          className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2"
        >
          Trạng Thái
        </label>
        <select
          id="status-select"
          value={filters.status}
          onChange={(e) =>
            onUpdateFilter("status", e.target.value as ProductStatus | "All")
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        >
          {(Object.keys(STATUS_LABEL_MAP) as (ProductStatus | "All")[]).map((st) => (
            <option key={st} value={st}>
              {STATUS_LABEL_MAP[st]}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Khoảng giá (Price Range) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="price-range-input"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Khoảng Giá Tối Đa
          </label>
          <span className="text-xs font-bold text-blue-600">
            {(filters.maxPrice / 1000000).toFixed(0)} triệu ₫
          </span>
        </div>
        <input
          id="price-range-input"
          type="range"
          min={1000000}
          max={100000000}
          step={1000000}
          value={filters.maxPrice}
          onChange={(e) => onUpdateFilter("maxPrice", Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>1 tr</span>
          <span>100 tr</span>
        </div>
      </div>

      {/* 6. Tồn kho */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Tình Trạng Tồn Kho
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStock === true}
            onChange={() => onUpdateFilter("inStock", filters.inStock === true ? null : true)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700"
          />
          <span>Chỉ hiển thị sản phẩm còn hàng</span>
        </label>
      </div>

      {/* 7. Số lượng tồn kho tối thiểu */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="stock-range-input"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Số Lượng Tồn Kho Tối Thiểu
          </label>
          <span className="text-xs font-bold text-blue-600">{filters.minStockQuantity}</span>
        </div>
        <input
          id="stock-range-input"
          type="range"
          min={0}
          max={100}
          step={1}
          value={filters.minStockQuantity}
          onChange={(e) => onUpdateFilter("minStockQuantity", Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>

      {/* 8. Đánh giá tối thiểu */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="rating-range-input"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Đánh Giá Tối Thiểu
          </label>
          <span className="text-xs font-bold text-blue-600">{filters.minRating.toFixed(1)}★</span>
        </div>
        <input
          id="rating-range-input"
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={filters.minRating}
          onChange={(e) => onUpdateFilter("minRating", Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>

      {/* 9. Năm ra mắt */}
      <div>
        <label
          htmlFor="release-year-select"
          className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2"
        >
          Năm Ra Mắt
        </label>
        <select
          id="release-year-select"
          value={filters.releaseYear ?? "All"}
          onChange={(e) => onUpdateFilter("releaseYear", e.target.value === "All" ? null : Number(e.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="All">Tất cả</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* 10. Ngày tạo sản phẩm */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Thời Gian Tạo Sản Phẩm
        </label>
        <div className="space-y-2">
          <input
            type="date"
            value={filters.createdAtFrom}
            onChange={(e) => onUpdateFilter("createdAtFrom", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            type="date"
            value={filters.createdAtTo}
            onChange={(e) => onUpdateFilter("createdAtTo", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* 11. Màu sắc (Dynamic Multi-select) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Màu Sắc
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableColors.map((color) => {
            const isSelected = filters.color.includes(color);
            return (
              <button
                key={color}
                type="button"
                onClick={() => handleToggleArrayItem("color", color)}
                className={`rounded-md px-2 py-1 text-[11px] font-medium transition-all border ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-bold dark:bg-blue-950 dark:text-blue-300"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* 12. Tags */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableTags.map((tag) => {
            const isSelected = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleToggleArrayItem("tags", tag)}
                className={`rounded-md px-2 py-1 text-[11px] font-medium transition-all border ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-bold dark:bg-blue-950 dark:text-blue-300"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* View Desktop */}
      <aside className="hidden lg:block w-72 shrink-0 rounded-2xl bg-white border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800 h-fit sticky top-20">
        {sidebarContent}
      </aside>

      {/* View Mobile (Drawer Modal) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop cách ly accessible */}
          <div
            role="presentation"
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl overflow-y-auto">
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Đóng bộ lọc"
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}