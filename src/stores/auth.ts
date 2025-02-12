import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') || null
  }),
  actions: {
    login(username: string, password: string): boolean {
      if (username === 'admin' && password === 'admin') {
        this.user = username;
        localStorage.setItem('user', username);
        return true;
      }
      return false;
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    }
  }
});
