import { create } from "zustand";

export type CartItem = {
  id: string;
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

  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  setItems: (items: CartItem[]) => void;
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

function normalizeItem(x: any): CartItem | null {
  if (!x) return null;

  const productId = String(x.productId ?? "");
  const color = String(x.color ?? "");
  const size = String(x.size ?? "");
  const name = String(x.name ?? "");
  const image = String(x.image ?? "");
  const price = Number(x.price ?? 0);
  const qty = Number(x.qty ?? 1);

  if (!productId || !color || !size || !name || !image) return null;

  const id = String(x.id ?? makeId(productId, color, size));

  return {
    id,
    productId,
    name,
    price: Number.isFinite(price) ? price : 0,
    image,
    color,
    size,
    qty: Number.isFinite(qty) ? Math.max(1, Math.floor(qty)) : 1,
  };
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],

  hasHydrated: false,
  setHasHydrated: (v) => set({ hasHydrated: v }),

  setItems: (items) =>
    set({
      items: Array.isArray(items)
        ? (items.map(normalizeItem).filter(Boolean) as CartItem[])
        : [],
    }),

  addItem: (item) =>
    set((state) => {
      const id = makeId(item.productId, item.color, item.size);
      const existing = state.items.find((x) => x.id === id);
      const safeQty = Math.max(1, Math.floor(Number(item.qty ?? 1)));

      if (existing) {
        return {
          items: state.items.map((x) =>
            x.id === id ? { ...x, qty: x.qty + safeQty } : x,
          ),
        };
      }

      return { items: [...state.items, { ...item, qty: safeQty, id }] };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((x) => x.id !== id) })),

  incQty: (id) =>
    set((state) => ({
      items: state.items.map((x) =>
        x.id === id ? { ...x, qty: x.qty + 1 } : x,
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
}));
