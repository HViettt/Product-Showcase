import { useMemo, useState, type ReactNode } from "react";
import type { AuthUser, LoginResponse } from "../types/product";
import { authService } from "../services/auth.service";
import { AuthContext } from "./AuthContext";

const AUTH_STORAGE_KEY = "product-showcase-auth";

const getInitialAuthState = () => {
  try {
    const persisted = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!persisted) {
      return { accessToken: null, user: null } as const;
    }

    const parsed = JSON.parse(persisted) as { accessToken: string; user: AuthUser };
    return { accessToken: parsed.accessToken, user: parsed.user } as const;
  } catch {
    return { accessToken: null, user: null } as const;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialAuthState = getInitialAuthState();
  const [user, setUser] = useState<AuthUser | null>(initialAuthState.user);
  const [accessToken, setAccessToken] = useState<string | null>(initialAuthState.accessToken);

  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    const payload = response.data as LoginResponse["data"];

    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ accessToken: payload.accessToken, user: payload.user })
    );

    setAccessToken(payload.accessToken);
    setUser(payload.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(accessToken && user),
      user,
      login,
      logout,
    }),
    [accessToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
