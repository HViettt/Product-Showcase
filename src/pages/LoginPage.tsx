import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Store, Lock, User, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/useAuth";

const floatingProducts = [
  {
    name: "MacBook Pro M4",
    price: "49.990.000 ₫",
    brand: "Apple",
    category: "Laptop",
    rating: "4.9",
    className: "absolute top-[10%] left-[8%] w-52 opacity-25 dark:opacity-20 rotate-[-8deg] animate-float-1 hidden sm:block",
  },
  {
    name: "iPhone 16 Pro Max",
    price: "34.990.000 ₫",
    brand: "Apple",
    category: "Smartphone",
    rating: "4.8",
    className: "absolute bottom-[12%] left-[10%] w-48 opacity-30 dark:opacity-15 rotate-[6deg] animate-float-2 hidden md:block",
  },
  {
    name: "Sony WH-1000XM5",
    price: "6.490.000 ₫",
    brand: "Sony",
    category: "Headphone",
    rating: "4.7",
    className: "absolute top-[15%] right-[10%] w-48 opacity-30 dark:opacity-15 rotate-[12deg] animate-float-3 hidden sm:block",
  },
  {
    name: "Apple Watch Ultra 2",
    price: "22.990.000 ₫",
    brand: "Apple",
    category: "Smartwatch",
    rating: "4.8",
    className: "absolute bottom-[15%] right-[12%] w-44 opacity-25 dark:opacity-20 rotate-[-10deg] animate-float-4 hidden md:block",
  },
  {
    name: "Keychron Q1 Max",
    price: "4.290.000 ₫",
    brand: "Keychron",
    category: "Keyboard",
    rating: "4.6",
    className: "absolute top-[45%] left-[4%] w-44 opacity-15 dark:opacity-10 rotate-[15deg] animate-float-3 hidden xl:block",
  },
  {
    name: "Logitech MX Master 3S",
    price: "2.490.000 ₫",
    brand: "Logitech",
    category: "Mouse",
    rating: "4.5",
    className: "absolute top-[48%] right-[5%] w-44 opacity-15 dark:opacity-10 rotate-[-15deg] animate-float-2 hidden xl:block",
  },
];

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("geekup_tester");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="relative min-h-screen flex items-center justify-center bg-bg-main overflow-hidden p-4 sm:p-6 md:p-8 font-sans animate-fade-in-up">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-bg-main via-bg-main/90 to-brand/5 dark:to-brand/10 z-0 pointer-events-none" />
      
      {/* Glow ambient background spheres */}
      <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-brand/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Floating background product cards */}
      {floatingProducts.map((p, index) => (
        <div
          key={index}
          className={`rounded-xl border border-border-main/50 bg-bg-surface/50 dark:bg-bg-surface/20 backdrop-blur-xs p-3.5 shadow-md select-none pointer-events-none ${p.className}`}
        >
          <div className="flex items-center justify-between gap-3 mb-1.5 font-mono text-[8px] text-text-secondary uppercase font-bold">
            <span>{p.brand}</span>
            <span className="text-warning">★ {p.rating}</span>
          </div>
          <h4 className="font-bold text-xs truncate text-text-primary mb-1">{p.name}</h4>
          <div className="text-xs font-bold text-brand">{p.price}</div>
        </div>
      ))}

      {/* Main Login Card - Centered container */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border-main bg-bg-surface/90 backdrop-blur-md p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Header Form - Centered logo & texts */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/20 mb-1">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-text-primary">
              GEEK UP
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mt-0.5">
              Product Showcase
            </p>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xs">
            Đăng nhập hệ thống quản trị danh mục sản phẩm công nghệ.
          </p>
        </div>

        {/* Lỗi cảnh báo nếu có */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-danger/5 p-4 text-xs font-semibold text-danger border border-danger/20">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-danger" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Đăng nhập */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5"
            >
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-text-secondary/60" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập username..."
                disabled={isLoading}
                className="w-full rounded-xl border border-border-main bg-bg-main py-2.5 pl-11 pr-3 text-xs font-medium text-text-primary placeholder-text-secondary/50 focus:border-brand focus:bg-bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10 disabled:opacity-50 transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-text-secondary/60" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                disabled={isLoading}
                className="w-full rounded-xl border border-border-main bg-bg-main py-2.5 pl-11 pr-3 text-xs font-medium text-text-primary placeholder-text-secondary/50 focus:border-brand focus:bg-bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10 disabled:opacity-50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-xs font-bold text-white shadow-lg shadow-brand/20 hover:bg-brand/90 active:scale-[0.97] transition-all cursor-pointer min-h-[44px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>ĐANG ĐĂNG NHẬP...</span>
              </>
            ) : (
              <span>ĐĂNG NHẬP</span>
            )}
          </button>
        </form>

        {/* Gợi ý tài khoản */}
        <div className="rounded-2xl bg-bg-main p-4 border border-border-main text-xs">
          <p className="font-bold text-text-primary mb-2 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Tài khoản đăng nhập Mock API:</span>
          </p>
          <div className="space-y-1 text-text-secondary font-mono text-[11px]">
            <div className="flex justify-between border-b border-border-main/50 pb-1">
              <span>Username:</span>
              <span className="font-bold text-text-primary">geekup_tester</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>Password:</span>
              <span className="font-bold text-text-primary">123456</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}