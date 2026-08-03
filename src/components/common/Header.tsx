import { LogOut, Filter, Store } from "lucide-react";
import { useAuth } from "../../context/useAuth";

interface HeaderProps {
  onOpenMobileFilter?: () => void;
  hasActiveFilters?: boolean;
}

export function Header({ onOpenMobileFilter, hasActiveFilters = false }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-main bg-bg-surface shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/10">
            <Store className="h-5 w-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-display tracking-tight text-text-primary">
              GEEK UP
            </span>
            <span className="hidden sm:inline-block font-mono text-[9px] font-semibold px-2 py-0.5 rounded border border-border-main bg-bg-main text-text-secondary">
              GEEK_UP.SHOWCASE
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
              className="relative flex lg:hidden items-center gap-1.5 rounded-xl border border-border-main bg-bg-main px-3 py-2.5 text-xs font-bold text-text-primary hover:bg-bg-surface active:scale-[0.97] transition-all cursor-pointer min-h-[44px]"
            >
              <Filter className="h-4 w-4 text-accent" />
              <span>Bộ lọc</span>
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-danger ring-2 ring-bg-surface" />
              )}
            </button>
          )}

          {/* User Info & Logout Button */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-border-main">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full bg-bg-main object-cover ring-2 ring-brand/25"
                loading="lazy"
                decoding="async"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-text-primary leading-none mb-1">
                  {user.name}
                </div>
                <div className="text-[10px] font-mono text-text-secondary leading-none">
                  @{user.username}
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Đăng xuất"
                aria-label="Đăng xuất"
                className="flex items-center justify-center h-9 w-9 rounded-xl border border-border-main bg-bg-main text-text-secondary hover:border-danger/30 hover:bg-danger/5 hover:text-danger active:scale-[0.97] transition-all cursor-pointer min-w-[36px]"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}