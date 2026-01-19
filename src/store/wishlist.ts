import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishItem = {
  id: string; // unique per variant (product+color+size)
  productId: string;
  slug: string; 
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
};


type WishState = {
  items: WishItem[];
  toggle: (item: Omit<WishItem, "id">) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  count: () => number;
  clear: () => void;
};

function makeId(productId: string, color: string, size: string) {
  return `${productId}_${color}_${size}`;
}

export const useWishlistStore = create<WishState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (item) =>
        set((state) => {
          const id = makeId(item.productId, item.color, item.size);
          const exists = state.items.some((x) => x.id === id);

          if (exists) {
            return { items: state.items.filter((x) => x.id !== id) };
          }

          return { items: [{ ...item, id }, ...state.items] };
        }),

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((x) => x.id !== id),
        })),

      has: (id) => get().items.some((x) => x.id === id),

      count: () => get().items.length,

      clear: () => set({ items: [] }),
    }),
    { name: "yourtype_wishlist_v1" },
  ),
);
