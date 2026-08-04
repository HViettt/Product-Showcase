import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  PackageCheck,
  AlertCircle,
  Loader2,
  Tag,
} from "lucide-react";
import axios from "axios";

import type { ProductDetail } from "../types/product";
import { productService } from "../services/product.service";
import { formatCurrency } from "../utils/currency";
import { Header } from "../components/common/Header";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getProductById(id);
      setProduct(data);
      setSelectedImage(data.image || (data.images && data.images[0]) || "");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.status === 404
            ? "Sản phẩm không tồn tại hoặc đã bị xóa."
            : err.response?.data?.message || "Không thể tải thông tin sản phẩm."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchDetail();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchDetail]);

  const isOutOfStock = product?.status === "Out of Stock";

  return (
    <div className="min-h-screen bg-bg-main text-text-primary flex flex-col font-sans animate-fade-in-up">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Nút quay lại */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 mb-6 rounded-xl border border-border-main bg-bg-surface px-4 py-2.5 text-xs font-bold text-text-primary hover:border-text-secondary/40 active:scale-[0.97] transition-all cursor-pointer min-h-[40px]"
        >
          <ArrowLeft className="h-4 w-4 text-brand" />
          <span>Quay lại danh sách</span>
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-brand mb-4" />
            <p className="text-sm font-semibold text-text-secondary">
              Đang tải chi tiết sản phẩm...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div
            role="alert"
            className="flex flex-col items-center justify-center py-16 rounded-xl bg-bg-surface border border-danger/20 p-8 text-center shadow-sm"
          >
            <AlertCircle className="h-12 w-12 text-danger mb-3" />
            <h3 className="text-base font-bold font-display text-text-primary mb-1">
              {error}
            </h3>
            <p className="text-xs text-text-secondary mb-4">
              Vui lòng kiểm tra lại đường dẫn hoặc chọn sản phẩm khác.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand/90 active:scale-[0.97] transition-all cursor-pointer"
            >
              Về trang chủ
            </button>
          </div>
        )}

        {/* Product Detail View */}
        {!isLoading && !error && product && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-xl bg-bg-surface p-6 sm:p-8 border border-border-main shadow-sm">
              {/* Gallery Ảnh */}
              <div className="space-y-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-bg-main border border-border-main/50 flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className={`h-full w-full object-cover object-center ${isOutOfStock ? "grayscale opacity-50" : ""}`}
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-xs">
                      <span className="px-4 py-1.5 border border-danger/40 bg-black/75 rounded text-xs font-mono font-bold text-danger uppercase tracking-widest shadow-md">
                        SOLD OUT // HẾT HÀNG
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnail list */}
                {product.images && product.images.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`relative aspect-square h-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all active:scale-[0.95] cursor-pointer ${
                          selectedImage === img
                            ? "border-brand ring-2 ring-brand/10"
                            : "border-border-main hover:border-text-secondary/40"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} - ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Thông tin chính */}
              <div className="flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                        {product.brand}
                      </span>
                      <span className="rounded font-mono text-[10px] font-bold px-2 py-0.5 border border-border-main bg-bg-main text-text-primary uppercase tracking-wider">
                        Màu sắc: {product.color}
                      </span>
                    </div>
                    
                    {/* Monospace Spec Badge style for Category */}
                    <span className="rounded font-mono text-[10px] font-bold px-2 py-0.5 border border-border-main bg-bg-main text-text-primary uppercase tracking-wider">
                      [CAT: {product.category}]
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold font-display text-text-primary tracking-tight mb-3">
                    {product.name}
                  </h1>

                  {/* Rating & ID Spec Plate Tag */}
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <div className="flex items-center gap-1.5 text-warning font-mono text-xs font-bold">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="text-xs text-text-secondary">
                      ({product.reviewCount} reviews)
                    </span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-border-main bg-bg-main text-text-secondary uppercase">
                      ID: {product.id}
                    </span>
                  </div>

                  {/* Khối Giá Nổi Bật */}
                  <div className="rounded-xl bg-bg-main p-5 mb-5 border border-border-main">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="text-3xl font-bold font-display text-brand leading-none">
                        {formatCurrency(product.price)}
                      </span>
                      {product.discountPercent > 0 && (
                        <span className="text-sm text-text-secondary line-through font-mono leading-none">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                      {product.discountPercent > 0 && (
                        <span className="rounded bg-danger/10 px-2 py-0.5 text-[10px] font-mono font-bold text-danger uppercase tracking-wider border border-danger/10">
                          SAVE {product.discountPercent}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Highlight Trạng Thái & Bảo Hành */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="flex items-center gap-3 rounded-xl border border-border-main p-3 bg-bg-surface">
                      <PackageCheck className={`h-5 w-5 ${isOutOfStock ? "text-danger" : "text-success"}`} />
                      <div>
                        <div className="text-[9px] uppercase font-mono font-bold text-text-secondary tracking-wider">Tình trạng</div>
                        <div className="text-xs font-bold text-text-primary">
                          {product.status === "Available" ? `Còn hàng (${product.stockQuantity})` : isOutOfStock ? "Hết hàng" : "Sắp về"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-border-main p-3 bg-bg-surface">
                      <ShieldCheck className="h-5 w-5 text-accent" />
                      <div>
                        <div className="text-[9px] uppercase font-mono font-bold text-text-secondary tracking-wider">Bảo hành</div>
                        <div className="text-xs font-bold text-text-primary">
                          {product.warranty || "12 tháng"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <Tag className="h-3.5 w-3.5 text-text-secondary/60" />
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded font-mono text-[9px] font-bold px-2 py-0.5 border border-border-main bg-bg-main text-text-secondary uppercase tracking-wider"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mô tả chi tiết */}
                {product.fullDescription && (
                  <div className="border-t border-border-main pt-4 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                      Mô Tả Chi Tiết
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                      {product.fullDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Khối Thông Số Kỹ Thuật */}
            <div className="rounded-xl border border-border-main bg-bg-surface p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold font-display text-text-primary mb-5 border-b border-border-main pb-2">
                Thông Số Kỹ Thuật Chi Tiết
              </h2>
              
              {product.specifications ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-mono text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="py-2.5 flex justify-between gap-4 border-b border-border-main/50">
                      <span className="font-bold text-text-secondary uppercase tracking-wider shrink-0">{key}</span>
                      <span className="font-semibold font-sans text-text-primary text-right">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-secondary/60 font-mono">[NO_DATA_AVAILABLE]</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}