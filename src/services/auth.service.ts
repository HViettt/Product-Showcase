import axios from "axios";
import type { LoginResponse, LogoutResponse } from "../types/product";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  timeout: 10000,
});

export const authService = {
  async login(username: string, password: string) {
    const response = await api.post<LoginResponse>("/login", { username, password });
    return response.data;
  },

  async logout() {
    const response = await api.post<LogoutResponse>("/logout");
    return response.data;
  },
};
