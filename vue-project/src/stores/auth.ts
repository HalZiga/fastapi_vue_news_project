import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import type { AuthStore } from "../types/Index.ts";

export const useAuthStore = defineStore("auth", {
  state: (): AuthStore => ({
    token: localStorage.getItem("access_token") || null,
    login: localStorage.getItem("user_login") || null,
    roles: JSON.parse(localStorage.getItem("user_roles") || "[]"),
    id: localStorage.getItem("user_id")
      ? Number(localStorage.getItem("user_id"))
      : null,
  }),
  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    getToken: (state): string | null => state.token,
    getLogin: (state): string | null => state.login,
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("access_token", token);
      try {
        const decodedToken: { sub: string; id: string; roles?: string[] } =
          jwtDecode(token);
        this.login = decodedToken.sub;
        this.id = Number(decodedToken.id);
        this.roles = decodedToken.roles ?? [];
        localStorage.setItem("user_login", decodedToken.sub);
        localStorage.setItem("user_roles", JSON.stringify(this.roles));
        localStorage.setItem("user_id", String(decodedToken.id));
      } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
        this.clearToken();
      }
    },
    clearToken() {
      this.token = null;
      this.login = null;
      this.roles = [];
      this.id = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_login");
      localStorage.removeItem("user_roles");
      localStorage.removeItem("user_id");
    },
  },
});
