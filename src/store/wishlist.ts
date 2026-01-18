import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
};

type WishState = {
  items: WishItem[];
  toggle: (item: WishItem) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  count: () => number;
  clear: () => void;
};

export const useWishlistStore = create<WishState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (item) =>
        set((state) => {
          const exists = state.items.some(
            (x) => x.productId === item.productId,
          );
          if (exists) {
            return {
              items: state.items.filter((x) => x.productId !== item.productId),
            };
          }
          return { items: [item, ...state.items] };
        }),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((x) => x.productId !== productId),
        })),

      has: (productId) => get().items.some((x) => x.productId === productId),

      count: () => get().items.length,

      clear: () => set({ items: [] }),
    }),
    { name: "yourtype_wishlist_v1" },
  ),
);
