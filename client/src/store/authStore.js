import { create } from 'zustand';
import api from '../api/axios';

// Zustand store — think of it as a global useState accessible anywhere
const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  // ── Register ──────────────────────────────────────────
  register: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { username, password });
      localStorage.setItem('token', data.token); // Persist token
      set({ user: data, token: data.token, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
    }
  },

  // ── Login ─────────────────────────────────────────────
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      set({ user: data, token: data.token, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Login failed',
        isLoading: false,
      });
    }
  },

  // ── Logout ────────────────────────────────────────────
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  // ── Load user on app start ────────────────────────────
  // Called once when app mounts — restores session if token exists
  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data });
    } catch {
      // Token expired or invalid — clear everything
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;