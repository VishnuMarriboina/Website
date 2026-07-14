import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../grpc/clients/types';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setCredentials: (token: string, refreshToken: string, user: AuthUser) => void;
  setAccessToken: (token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setCredentials: (token, refreshToken, user) =>
        set({ token, refreshToken, user, isAuthenticated: true }),

      setAccessToken: (token, refreshToken) =>
        set({ token, refreshToken }),

      logout: () =>
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({
        token: s.token,
        refreshToken: s.refreshToken,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);
