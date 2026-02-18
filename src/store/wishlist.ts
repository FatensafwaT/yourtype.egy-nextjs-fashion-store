import { create } from "zustand";

export type WishItem = {
  id: string;
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

  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  setItems: (items: WishItem[]) => void;
  toggle: (item: Omit<WishItem, "id">) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  count: () => number;
  clear: () => void;
};

function makeId(productId: string, color: string, size: string) {
  return `${productId}_${color}_${size}`;
}

function normalizeItem(x: any): WishItem | null {
  if (!x) return null;

  const productId = String(x.productId ?? "");
  const color = String(x.color ?? "");
  const size = String(x.size ?? "");
  const slug = String(x.slug ?? "");
  const name = String(x.name ?? "");
  const image = String(x.image ?? "");
  const price = Number(x.price ?? 0);

  if (!productId || !color || !size || !slug || !name || !image) return null;

  const id = String(x.id ?? makeId(productId, color, size));

  return {
    id,
    productId,
    slug,
    name,
    price: Number.isFinite(price) ? price : 0,
    image,
    color,
    size,
  };
}

export const useWishlistStore = create<WishState>()((set, get) => ({
  items: [],

  hasHydrated: false,
  setHasHydrated: (v) => set({ hasHydrated: v }),

  setItems: (items) =>
    set({
      items: Array.isArray(items)
        ? (items.map(normalizeItem).filter(Boolean) as WishItem[])
        : [],
    }),

  toggle: (item) =>
    set((state) => {
      const id = makeId(item.productId, item.color, item.size);
      const exists = state.items.some((x) => x.id === id);

      if (exists) return { items: state.items.filter((x) => x.id !== id) };

      return { items: [{ ...item, id }, ...state.items] };
    }),

  remove: (id) => set((state) => ({ items: state.items.filter((x) => x.id !== id) })),

  has: (id) => get().items.some((x) => x.id === id),
  count: () => get().items.length,
  clear: () => set({ items: [] }),
}));
