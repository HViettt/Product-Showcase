import { ChevronLeft, ChevronRight } from "lucide-react";

export type PaginationItem = number | "...";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

function buildPageNumbers(currentPage: number, totalPages: number): PaginationItem[] {
  const pages: PaginationItem[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

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
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const pageItems = buildPageNumbers(currentPage, totalPages);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5 px-2 border-t border-border-main">
      {/* Thông tin số lượng hiển thị */}
      <div className="text-xs text-text-secondary">
        Hiển thị <span className="font-semibold text-text-primary">{startItem}</span> -{" "}
        <span className="font-semibold text-text-primary">{endItem}</span> trên tổng số{" "}
        <span className="font-semibold text-text-primary">{totalItems}</span> sản phẩm
      </div>

      {/* Cụm điều hướng trang */}
      <div className="flex items-center gap-1.5">
        {/* Nút Trang Trước */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Trang trước"
          className="flex items-center justify-center h-9 w-9 rounded-lg border border-border-main bg-bg-surface text-text-primary hover:border-text-secondary/40 disabled:opacity-40 disabled:hover:bg-bg-surface disabled:hover:border-border-main transition-all active:scale-[0.97] cursor-pointer"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>

        {/* Danh sách các nút số trang */}
        {pageItems.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center h-9 w-9 text-xs text-text-secondary/60 select-none font-mono"
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
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center justify-center h-9 min-w-9 px-3 rounded-lg text-xs font-semibold transition-all active:scale-[0.97] cursor-pointer ${
                isActive
                  ? "bg-brand text-white border border-brand shadow-sm"
                  : "border border-border-main bg-bg-surface text-text-primary hover:border-text-secondary/40"
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
          className="flex items-center justify-center h-9 w-9 rounded-lg border border-border-main bg-bg-surface text-text-primary hover:border-text-secondary/40 disabled:opacity-40 disabled:hover:bg-bg-surface disabled:hover:border-border-main transition-all active:scale-[0.97] cursor-pointer"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}