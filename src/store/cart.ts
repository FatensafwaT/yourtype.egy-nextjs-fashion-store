import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string; // unique per variant (product+color+size)
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  incQty: (id: string) => void;
  decQty: (id: string) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

function makeId(productId: string, color: string, size: string) {
  return `${productId}_${color}_${size}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const id = makeId(item.productId, item.color, item.size);
          const existing = state.items.find((x) => x.id === id);

          if (existing) {
            return {
              items: state.items.map((x) =>
                x.id === id ? { ...x, qty: x.qty + item.qty } : x
              ),
            };
          }

          return {
            items: [...state.items, { ...item, id }],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((x) => x.id !== id),
        })),

      incQty: (id) =>
        set((state) => ({
          items: state.items.map((x) =>
            x.id === id ? { ...x, qty: x.qty + 1 } : x
          ),
        })),

      decQty: (id) =>
        set((state) => ({
          items: state.items
            .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
            .filter((x) => x.qty > 0),
        })),

      clear: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, x) => sum + x.qty, 0),
      totalPrice: () => get().items.reduce((sum, x) => sum + x.price * x.qty, 0),
    }),
    {
      name: "yourtype_cart_v1",
    }
  )
);
