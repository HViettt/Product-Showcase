import { ArrowUpDown } from "lucide-react";
import type { SortByOption, SortOrder } from "../../types/product";

interface ProductToolbarProps {
  totalItems: number;
  sortBy: SortByOption;
  order: SortOrder;
  onSortByChange: (sortBy: SortByOption) => void;
  onOrderChange: (order: SortOrder) => void;
}

// Config-driven cho Dropdown Sort
const SORT_OPTIONS: { value: SortByOption; label: string }[] = [
  { value: "createdAt", label: "Mới nhất" },
  { value: "price", label: "Giá bán" },
  { value: "rating", label: "Đánh giá" },
  { value: "name", label: "Tên A-Z" },
  { value: "updatedAt", label: "Cập nhật" },
];

export function ProductToolbar({
  totalItems,
  sortBy,
  order,
  onSortByChange,
  onOrderChange,
}: ProductToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
        Tìm thấy{" "}
        <span className="font-bold text-blue-600 dark:text-blue-400">
          {totalItems}
        </span>{" "}
        sản phẩm phù hợp
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <ArrowUpDown className="h-4 w-4 text-slate-400" />
        <label
          htmlFor="sort-select"
          className="text-xs font-medium text-slate-500"
        >
          Sắp xếp:
        </label>

        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortByOption)}
          className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onOrderChange(order === "asc" ? "desc" : "asc")}
          aria-label="Đổi thứ tự sắp xếp tăng hoặc giảm dần"
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
        >
          {order === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
        </button>
      </div>
    </div>
  );
}