import { LogOut, Filter, Store } from "lucide-react";
import { useAuth } from "../../context/useAuth";

interface HeaderProps {
  onOpenMobileFilter?: () => void;
  hasActiveFilters?: boolean;
}

export function Header({ onOpenMobileFilter, hasActiveFilters = false }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Branding Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              GEEK UP
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Product Showcase
            </span>
          </div>
        </div>

        {/* Cụm Action Bên Phải */}
        <div className="flex items-center gap-3">
          {/* Nút Mở Filter trên Mobile */}
          {onOpenMobileFilter && (
            <button
              type="button"
              onClick={onOpenMobileFilter}
              className="relative flex lg:hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            >
              <Filter className="h-4 w-4 text-blue-600" />
              <span>Bộ lọc</span>
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          )}

          {/* User Info & Logout Button */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full bg-slate-100 object-cover ring-2 ring-blue-500/20"
                loading="lazy"
                decoding="async"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {user.name}
                </div>
                <div className="text-[10px] font-medium text-slate-400">
                  @{user.username}
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Đăng xuất"
                aria-label="Đăng xuất"
                className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}