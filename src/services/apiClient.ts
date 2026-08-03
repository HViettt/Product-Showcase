import axios from "axios";

export const AUTH_STORAGE_KEY = "product-showcase-auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  timeout: 10000,
});

export const getAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const persisted = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!persisted) {
      return null;
    }

    const parsed = JSON.parse(persisted) as { accessToken?: string };
    return parsed.accessToken ?? null;
  } catch {
    return null;
  }
};

export const clearAuthAndRedirect = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.assign("/login");
  }
};

api.interceptors.request.use((config) => {
  const isLoginRequest = config.url?.includes("/login");

  if (!isLoginRequest) {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthAndRedirect();
    }

    return Promise.reject(error);
  }
);
