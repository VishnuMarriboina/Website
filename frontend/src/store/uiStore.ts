import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  message: string;
  type: ToastType;
}

interface UIState {
  toast: Toast | null;
  isLoading: boolean;
  showToast: (toast: Toast) => void;
  clearToast: () => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  toast: null,
  isLoading: false,
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
  setGlobalLoading: (isLoading) => set({ isLoading }),
}));
