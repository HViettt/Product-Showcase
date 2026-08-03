import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Store, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/useAuth";

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("geekup_tester");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Nếu đã đăng nhập trước đó, điều hướng ngay về trang danh sách sản phẩm
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      await login(username, password);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error && "response" in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        setError(response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900">
        {/* Header Form */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
            <Store className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            GEEK UP Showcase
          </h1>
          <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            Đăng nhập hệ thống quản lý sản phẩm
          </p>
        </div>

        {/* Thông báo Lỗi nếu có */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-xs font-semibold text-rose-600 border border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Đăng nhập */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5"
            >
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập username..."
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50 transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50 transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <span>Đăng Nhập</span>
            )}
          </button>
        </form>

        {/* Gợi ý tài khoản cho người chấm bài test */}
        <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100 text-xs dark:bg-slate-800/60 dark:border-slate-800">
          <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">
            💡 Tài khoản đăng nhập Mock API:
          </p>
          <div className="space-y-0.5 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
            <div>Username: <span className="font-bold text-slate-800 dark:text-slate-200">geekup_tester</span></div>
            <div>Password: <span className="font-bold text-slate-800 dark:text-slate-200">123456</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}