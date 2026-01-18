import { create } from "zustand";

export type ToastType = "success" | "info";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastState = {
  toasts: Toast[];
  push: (message: string, type?: ToastType) => void;
  remove: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, type = "success") =>
    set((state) => {
      const id = crypto.randomUUID?.() ?? `${Date.now()}_${Math.random()}`;
      const toast: Toast = { id, message, type };

      // auto-dismiss after 2.5s
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      }, 2500);

      return { toasts: [toast, ...state.toasts].slice(0, 3) };
    }),
  remove: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
