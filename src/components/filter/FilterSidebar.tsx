import { Search, RotateCcw, Filter, X } from "lucide-react";
import type { ProductCategory, ProductStatus, ProductFilterState } from "../../types/product";

interface FilterSidebarProps {
  filters: ProductFilterState;
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
  const handleToggleArrayItem = (key: "brand" | "color" | "tags", item: string) => {
    const currentArray = filters[key];
    const exists = currentArray.includes(item);
    const updatedArray = exists
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];

    onUpdateFilter(key, updatedArray);
  };

  const sidebarContent = (
    <div className="flex flex-col gap-5 p-5">
      {/* Header Sidebar & Nút Reset / Mobile Close */}
      <div className="flex items-center justify-between pb-4 border-b border-border-main">
        <div className="flex items-center gap-2 font-bold font-display text-text-primary">
          <Filter className="h-5 w-5 text-brand" />
          <span>Bộ Lọc Sản Phẩm</span>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs font-bold text-danger hover:text-danger/90 active:scale-[0.97] transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Xóa lọc</span>
            </button>
          )}

          {/* Close button for mobile inside the header flow to prevent overlapping */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Đóng bộ lọc"
              className="lg:hidden p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-main active:scale-[0.97] transition-all cursor-pointer rounded-lg flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Tìm kiếm sản phẩm */}
      <div>
        <label
          htmlFor="search-input"
          className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2"
        >
          Tìm kiếm
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-text-secondary/60" />
          <input
            id="search-input"
            type="text"
            value={filters.search}
            onChange={(e) => onUpdateFilter("search", e.target.value)}
            placeholder="Tên sản phẩm..."
            className="w-full rounded-xl border border-border-main bg-bg-main py-2.5 pl-10 pr-3 text-xs font-medium text-text-primary placeholder-text-secondary/50 focus:border-brand focus:bg-bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all"
          />
        </div>
      </div>

      {/* 2. Danh mục sản phẩm (Pills) */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
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
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold active:scale-[0.97] transition-all cursor-pointer border ${
                  isActive
                    ? "bg-brand border-brand text-white shadow-sm"
                    : "bg-bg-main border-border-main text-text-secondary hover:text-text-primary hover:border-text-secondary/35"
                }`}
              >
                {cat === "All" ? "Tất cả" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Thương hiệu (Checkbox Brand) */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
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
                className="flex items-center gap-2 text-xs text-text-primary cursor-pointer select-none font-medium hover:text-brand transition-colors"
              >
                <input
                  id={brandInputId}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleArrayItem("brand", brand)}
                  className="h-4 w-4 rounded border-border-main text-brand bg-bg-main focus:ring-brand cursor-pointer"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Trạng thái hàng */}
      <div>
        <label
          htmlFor="status-select"
          className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2"
        >
          Trạng Thái
        </label>
        <select
          id="status-select"
          value={filters.status}
          onChange={(e) =>
            onUpdateFilter("status", e.target.value as ProductStatus | "All")
          }
          className="w-full rounded-xl border border-border-main bg-bg-main py-2.5 px-3 text-xs font-semibold text-text-primary focus:border-brand focus:outline-none focus:bg-bg-surface transition-all"
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
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="price-range-input"
            className="text-[10px] font-bold uppercase tracking-wider text-text-secondary"
          >
            Khoảng Giá Tối Đa
          </label>
          <span className="text-xs font-bold text-accent">
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
          className="w-full accent-brand cursor-pointer bg-border-main h-1 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-text-secondary/70 mt-1 font-mono">
          <span>1 tr</span>
          <span>100 tr</span>
        </div>
      </div>

      {/* 6. Tồn kho */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
          Tình Trạng Tồn Kho
        </label>
        <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer select-none font-medium hover:text-brand transition-colors">
          <input
            type="checkbox"
            checked={filters.inStock === true}
            onChange={() => onUpdateFilter("inStock", filters.inStock === true ? null : true)}
            className="h-4 w-4 rounded border-border-main text-brand bg-bg-main focus:ring-brand cursor-pointer"
          />
          <span>Chỉ hiển thị sản phẩm còn hàng</span>
        </label>
      </div>

      {/* 7. Số lượng tồn kho tối thiểu */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="stock-range-input"
            className="text-[10px] font-bold uppercase tracking-wider text-text-secondary"
          >
            Số Lượng Tồn Kho Tối Thiểu
          </label>
          <span className="text-xs font-bold text-accent">{filters.minStockQuantity}</span>
        </div>
        <input
          id="stock-range-input"
          type="range"
          min={0}
          max={100}
          step={1}
          value={filters.minStockQuantity}
          onChange={(e) => onUpdateFilter("minStockQuantity", Number(e.target.value))}
          className="w-full accent-brand cursor-pointer bg-border-main h-1 rounded-lg"
        />
      </div>

      {/* 8. Đánh giá tối thiểu */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="rating-range-input"
            className="text-[10px] font-bold uppercase tracking-wider text-text-secondary"
          >
            Đánh Giá Tối Thiểu
          </label>
          <span className="text-xs font-bold text-accent">{filters.minRating.toFixed(1)}★</span>
        </div>
        <input
          id="rating-range-input"
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={filters.minRating}
          onChange={(e) => onUpdateFilter("minRating", Number(e.target.value))}
          className="w-full accent-brand cursor-pointer bg-border-main h-1 rounded-lg"
        />
      </div>

      {/* 9. Năm ra mắt */}
      <div>
        <label
          htmlFor="release-year-select"
          className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2"
        >
          Năm Ra Mắt
        </label>
        <select
          id="release-year-select"
          value={filters.releaseYear ?? "All"}
          onChange={(e) => onUpdateFilter("releaseYear", e.target.value === "All" ? null : Number(e.target.value))}
          className="w-full rounded-xl border border-border-main bg-bg-main py-2.5 px-3 text-xs font-semibold text-text-primary focus:border-brand focus:outline-none focus:bg-bg-surface transition-all"
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
        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
          Thời Gian Tạo Sản Phẩm
        </label>
        <div className="space-y-2">
          <input
            type="date"
            value={filters.createdAtFrom}
            onChange={(e) => onUpdateFilter("createdAtFrom", e.target.value)}
            className="w-full rounded-xl border border-border-main bg-bg-main py-2 px-3 text-xs font-semibold text-text-primary focus:border-brand focus:outline-none focus:bg-bg-surface transition-all"
          />
          <input
            type="date"
            value={filters.createdAtTo}
            onChange={(e) => onUpdateFilter("createdAtTo", e.target.value)}
            className="w-full rounded-xl border border-border-main bg-bg-main py-2 px-3 text-xs font-semibold text-text-primary focus:border-brand focus:outline-none focus:bg-bg-surface transition-all"
          />
        </div>
      </div>

      {/* 11. Màu sắc */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
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
                className={`rounded px-2 py-1 text-[11px] font-semibold transition-all border active:scale-[0.97] cursor-pointer ${
                  isSelected
                    ? "border-accent bg-accent/10 text-accent font-bold"
                    : "border-border-main bg-bg-surface text-text-secondary hover:text-text-primary hover:border-text-secondary/35"
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
        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
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
                className={`rounded px-2 py-1 text-[11px] font-semibold transition-all border active:scale-[0.97] cursor-pointer ${
                  isSelected
                    ? "border-accent bg-accent/10 text-accent font-bold"
                    : "border-border-main bg-bg-surface text-text-secondary hover:text-text-primary hover:border-text-secondary/35"
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
      <aside className="hidden lg:block w-72 shrink-0 rounded-xl bg-bg-surface border border-border-main shadow-sm h-fit sticky top-20">
        {sidebarContent}
      </aside>

      {/* View Mobile (Drawer Modal) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            role="presentation"
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs bg-bg-surface h-full shadow-2xl overflow-y-auto border-l border-border-main animate-[slideInRight_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}