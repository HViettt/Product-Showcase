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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Nút quay lại */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 mb-6 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách</span>
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Đang tải chi tiết sản phẩm...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div
            role="alert"
            className="flex flex-col items-center justify-center py-16 rounded-3xl bg-white border border-rose-100 p-8 text-center shadow-sm dark:bg-slate-900 dark:border-slate-800"
          >
            <AlertCircle className="h-12 w-12 text-rose-500 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {error}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Vui lòng kiểm tra lại đường dẫn hoặc chọn sản phẩm khác.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition-all"
            >
              Về trang chủ
            </button>
          </div>
        )}

        {/* Product Detail View */}
        {!isLoading && !error && product && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              {/* Gallery Ảnh */}
              <div className="space-y-4">
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Thumbnail list */}
                {product.images && product.images.length > 0 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`relative aspect-square h-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                          selectedImage === img
                            ? "border-blue-600 ring-2 ring-blue-100"
                            : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
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
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {product.brand}
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {product.category}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      ({product.reviewCount} đánh giá từ khách hàng)
                    </span>
                  </div>

                  {/* Khối Giá */}
                  <div className="rounded-2xl bg-slate-50 p-4 mb-6 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                        {formatCurrency(product.price)}
                      </span>
                      {product.discountPercent > 0 && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                      {product.discountPercent > 0 && (
                        <span className="rounded-lg bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-600">
                          Tiết kiệm {product.discountPercent}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Highlight Trạng Thái & Bảo Hành */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                      <PackageCheck className="h-5 w-5 text-emerald-600" />
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Tình trạng</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {product.status === "Available" ? `Còn hàng (${product.stockQuantity})` : product.status}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Bảo hành</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {product.warranty || "12 tháng"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Khối Mô Tả Chi Tiết & Thông Số Kỹ Thuật */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bài viết chi tiết */}
              <div className="lg:col-span-2 rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Mô Tả Chi Tiết Sản Phẩm
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {product.fullDescription}
                </p>
              </div>

              {/* Thông số kỹ thuật */}
              <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800 h-fit">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Thông Số Kỹ Thuật
                </h2>
                {product.specifications ? (
                  <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="py-2.5 flex justify-between gap-4">
                        <dt className="font-semibold text-slate-500">{key}</dt>
                        <dd className="font-bold text-slate-800 dark:text-slate-200 text-right">
                          {val}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-xs text-slate-400">Không có thông số cụ thể.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}