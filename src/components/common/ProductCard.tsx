import { memo } from "react";
import { Star, Eye } from "lucide-react";
import type { Product, ProductStatus } from "../../types/product";
import { formatCurrency } from "../../utils/currency";

interface ProductCardProps {
  product: Product;
  onViewDetail: (id: string) => void;
}

// Sub-component nhỏ gọn, đúng trách nhiệm (Single Responsibility)
function ProductStatusBadge({
  status,
  stockQuantity,
}: {
  status: ProductStatus;
  stockQuantity: number;
}) {
  switch (status) {
    case "Available":
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Còn hàng ({stockQuantity})
        </span>
      );
    case "Out of Stock":
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
          Hết hàng
        </span>
      );
    case "Coming Soon":
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Sắp về
        </span>
      );
    default:
      return null;
  }
}

function ProductCardComponent({ product, onViewDetail }: ProductCardProps) {
  return (
    <div className="group flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800">
      <div>
        {/* Container Hình ảnh & Badges */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 mb-4 dark:bg-slate-800">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badge Giảm giá */}
          {product.discountPercent > 0 && (
            <span className="absolute top-2 left-2 rounded-lg bg-rose-600 px-2 py-1 text-xs font-bold text-white shadow-md">
              -{product.discountPercent}%
            </span>
          )}

          {/* Badge Category */}
          <span className="absolute top-2 right-2 rounded-lg bg-slate-900/70 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white">
            {product.category}
          </span>
        </div>

        {/* Thương hiệu & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {product.rating}
            </span>
            <span className="text-[10px] text-slate-400">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Tên sản phẩm */}
        <h3 className="line-clamp-2 text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors mb-2">
          {product.name}
        </h3>

        {/* Mô tả ngắn */}
        <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Tags - Dùng tag làm key duy nhất thay vì index */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Card: Giá & Button Action */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(product.price)}
            </div>
            {product.discountPercent > 0 && (
              <div className="text-xs text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </div>
            )}
          </div>
          <ProductStatusBadge
            status={product.status}
            stockQuantity={product.stockQuantity}
          />
        </div>

        <button
          type="button"
          onClick={() => onViewDetail(product.id)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-600 active:scale-[0.98] transition-all dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Eye className="h-4 w-4" />
          <span>Xem chi tiết</span>
        </button>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);