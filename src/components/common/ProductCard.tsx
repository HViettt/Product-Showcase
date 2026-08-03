import { memo } from "react";
import { Eye } from "lucide-react";
import type { Product, ProductStatus } from "../../types/product";
import { formatCurrency } from "../../utils/currency";

interface ProductCardProps {
  product: Product;
  onViewDetail: (id: string) => void;
}

function getShortCategory(category: string) {
  const cat = category.toLowerCase().trim();
  if (cat.includes("laptop")) return "LTP";
  if (cat.includes("phone") || cat.includes("mobile")) return "PHN";
  if (cat.includes("watch")) return "WCH";
  if (cat.includes("headphone") || cat.includes("audio")) return "AUD";
  if (cat.includes("accessory") || cat.includes("accessories")) return "ACC";
  return category.slice(0, 3).toUpperCase();
}

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
        <span className="flex flex-col items-center justify-center text-center px-2.5 py-1 min-w-[76px] text-[9px] font-mono font-bold rounded bg-success/10 text-success border border-success/20 uppercase tracking-wide leading-tight">
          <span>Còn hàng</span>
          <span>({stockQuantity})</span>
        </span>
      );
    case "Out of Stock":
      return (
        <span className="flex flex-col items-center justify-center text-center px-2.5 py-1 min-w-[76px] text-[9px] font-mono font-bold rounded bg-danger/10 text-danger border border-danger/20 uppercase tracking-wide leading-tight">
          <span>Hết hàng</span>
        </span>
      );
    case "Coming Soon":
      return (
        <span className="flex flex-col items-center justify-center text-center px-2.5 py-1 min-w-[76px] text-[9px] font-mono font-bold rounded bg-warning/10 text-warning border border-warning/20 uppercase tracking-wide leading-tight">
          <span>Sắp về</span>
        </span>
      );
    default:
      return null;
  }
}

function ProductCardComponent({ product, onViewDetail }: ProductCardProps) {
  const isOutOfStock = product.status === "Out of Stock";

  return (
    <div className={`group flex flex-col justify-between rounded-xl bg-bg-surface p-3.5 shadow-sm border border-border-main hover:shadow-md hover:border-brand -translate-y-0 hover:-translate-y-1.5 transition-all duration-300 ${isOutOfStock ? "opacity-90" : ""}`}>
      <div>
        {/* Container Hình ảnh & Badges */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-bg-main mb-3 border border-border-main/50">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ${isOutOfStock ? "grayscale opacity-50" : ""}`}
          />

          {/* Badge Giảm giá */}
          {product.discountPercent > 0 && (
            <span className="absolute top-2 left-2 rounded bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm z-10 font-mono">
              -{product.discountPercent}%
            </span>
          )}

          {/* Hết hàng overlay trên ảnh */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-xs">
              <span className="px-3 py-1 border border-danger/40 bg-black/75 rounded text-[11px] font-mono font-bold text-danger uppercase tracking-widest shadow-md">
                SOLD OUT // HẾT HÀNG
              </span>
            </div>
          )}

          {/* Spec Row (Đáy ảnh) */}
          <div className="absolute bottom-0 left-0 right-0 bg-bg-surface/90 dark:bg-bg-surface/80 border-t border-border-main py-1.5 px-2.5 flex justify-between items-center font-mono text-[9px] font-bold text-text-primary tracking-wider uppercase z-10">
            <span>#{product.id.replace("prod-", "")}</span>
            <span className="text-warning">★ {product.rating}</span>
            <span>{getShortCategory(product.category)}</span>
          </div>
        </div>

        {/* Thương hiệu & Rating info */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-text-secondary font-mono">
            <span>({product.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Tên sản phẩm */}
        <h3 className="line-clamp-1 text-sm font-bold font-display text-text-primary group-hover:text-brand transition-colors mb-1">
          {product.name}
        </h3>

        {/* Mô tả ngắn (rút gọn 1 dòng) */}
        <p className="line-clamp-1 text-xs text-text-secondary mb-2.5 leading-relaxed">
          {product.description}
        </p>

        {/* Tags (tối đa 1 tag) & Màu sắc */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {product.tags.slice(0, 1).map((tag) => (
            <span
              key={tag}
              className="rounded bg-bg-main border border-border-main px-2 py-0.5 text-[9px] font-mono font-bold text-text-secondary uppercase"
            >
              #{tag}
            </span>
          ))}
          <span className="rounded bg-bg-main border border-border-main px-2 py-0.5 text-[9px] font-mono font-bold text-text-secondary uppercase">
            Màu: {product.color}
          </span>
        </div>
      </div>

      {/* Footer Card: Giá & Button Action */}
      <div className="pt-2.5 border-t border-border-main">
        <div className="flex items-center justify-between gap-1 mb-2.5">
          <div>
            <div className="text-base font-bold font-display text-text-primary leading-tight">
              {formatCurrency(product.price)}
            </div>
            {product.discountPercent > 0 && (
              <div className="text-[10px] text-text-secondary line-through font-mono leading-none mt-0.5">
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
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand py-2 text-xs font-bold text-white shadow-sm hover:bg-brand/90 active:scale-[0.97] transition-all cursor-pointer min-h-[40px]"
        >
          <Eye className="h-4 w-4" />
          <span>Xem chi tiết</span>
        </button>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);