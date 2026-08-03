import { ArrowUpDown } from "lucide-react";
import type { SortByOption, SortOrder } from "../../types/product";

interface ProductToolbarProps {
  totalItems: number;
  sortBy: SortByOption;
  order: SortOrder;
  onSortByChange: (sortBy: SortByOption) => void;
  onOrderChange: (order: SortOrder) => void;
}

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-bg-surface p-4 rounded-xl border border-border-main shadow-sm animate-fade-in-up">
      <div className="text-xs font-semibold text-text-secondary">
        Tìm thấy{" "}
        <span className="font-bold text-brand font-mono">
          {totalItems}
        </span>{" "}
        sản phẩm phù hợp
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <ArrowUpDown className="h-4 w-4 text-text-secondary/60" />
        <label
          htmlFor="sort-select"
          className="text-xs font-medium text-text-secondary"
        >
          Sắp xếp:
        </label>

        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortByOption)}
          className="rounded-lg border border-border-main bg-bg-main py-1.5 px-3 text-xs font-semibold text-text-primary focus:border-brand focus:bg-bg-surface focus:outline-none transition-all cursor-pointer"
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
          className="rounded-lg border border-border-main bg-bg-main px-3 py-1.5 text-xs font-bold text-text-primary hover:text-text-primary hover:border-text-secondary/40 active:scale-[0.97] transition-all cursor-pointer min-h-[32px] flex items-center justify-center"
        >
          {order === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
        </button>
      </div>
    </div>
  );
}