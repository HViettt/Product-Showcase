import { ChevronLeft, ChevronRight } from "lucide-react";

// 1. Định nghĩa Type rõ ràng cho item phân trang
export type PaginationItem = number | "...";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// 2. Helper độc lập ngoài component - Chuẩn SRP, tránh re-create function mỗi lần render
function buildPageNumbers(currentPage: number, totalPages: number): PaginationItem[] {
  const pages: PaginationItem[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Luôn hiện trang đầu
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Các trang xung quanh currentPage
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Luôn hiện trang cuối
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  // Guard clause: Không hiển thị nếu không có dữ liệu hoặc chỉ có 1 trang
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const pageItems = buildPageNumbers(currentPage, totalPages);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-200 dark:border-slate-800">
      {/* Thông tin số lượng hiển thị */}
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Hiển thị <span className="font-semibold text-slate-900 dark:text-slate-200">{startItem}</span> -{" "}
        <span className="font-semibold text-slate-900 dark:text-slate-200">{endItem}</span> trên tổng số{" "}
        <span className="font-semibold text-slate-900 dark:text-slate-200">{totalItems}</span> sản phẩm
      </div>

      {/* Cụm điều hướng trang */}
      <div className="flex items-center gap-1">
        {/* Nút Trang Trước */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Trang trước"
          className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Danh sách các nút số trang */}
        {pageItems.map((page, index) => {
          // 3. Type Narrowing tự động của TypeScript, không cần 'as number'
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center h-9 w-9 text-xs text-slate-400 select-none"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              // 4. Accessibility chuẩn ARIA cho trang đang active
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center justify-center h-9 min-w-9 px-3 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm dark:bg-blue-600"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Nút Trang Sau */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Trang sau"
          className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}