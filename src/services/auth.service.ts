import { api } from "./apiClient";
import type { LoginResponse, LogoutResponse } from "../types/product";

export const authService = {
  async login(username: string, password: string) {
    const response = await api.post<LoginResponse>("login", { username, password });
    return response.data;
  },

  async logout() {
    const response = await api.post<LogoutResponse>("logout");
    return response.data;
  },
};
