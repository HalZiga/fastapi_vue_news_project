import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || null,
    login: localStorage.getItem('user_login') || null,
    roles: JSON.parse(localStorage.getItem('user_roles') || '[]'),
    id: localStorage.getItem('user_id') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token, //есть ли токен
    getToken: (state) => state.token,
    getLogin: (state) => state.login
  },
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('access_token', token);
      try {
        const decodedToken = jwtDecode(token);
        this.login = decodedToken.sub;
        this.id = decodedToken.id;
        this.roles = decodedToken.roles || [];
        localStorage.setItem('user_login', decodedToken.sub);
        localStorage.setItem('user_roles', JSON.stringify(this.roles));
        localStorage.setItem('user_id', decodedToken.id);
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
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_login');
      localStorage.removeItem('user_roles');
      localStorage.removeItem('user_id');
    },
  },
});
