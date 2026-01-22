"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

type ServerCartItem = {
  productId: string;
  slug?: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  qty: number;
};

type ServerWishItem = {
  productId: string;
  slug?: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
};

function makeVariantId(productId: string, color: string, size: string) {
  return `${productId}_${color}_${size}`;
}

function readPersistedItems<T = any>(storageKey: string): T[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    const items = parsed?.state?.items;
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function mergeCart(localItems: any[], serverItems: ServerCartItem[]) {
  const map = new Map<string, any>();

  
  for (const it of serverItems) {
    const id = makeVariantId(it.productId, it.color, it.size);
    map.set(id, { ...it, id });
  }


  for (const it of localItems) {
    const id = it.id ?? makeVariantId(it.productId, it.color, it.size);
    const prev = map.get(id);

    const qty = Math.max(1, Number(it.qty ?? 1));

    if (prev) {
      map.set(id, { ...prev, qty: (prev.qty ?? 0) + qty });
    } else {
      map.set(id, { ...it, id, qty });
    }
  }

  return Array.from(map.values());
}

function mergeWishlist(localItems: any[], serverItems: ServerWishItem[]) {
  const map = new Map<string, any>();

  for (const it of serverItems) {
    const id = makeVariantId(it.productId, it.color, it.size);
    map.set(id, { ...it, id });
  }

  for (const it of localItems) {
    const id = it.id ?? makeVariantId(it.productId, it.color, it.size);
    map.set(id, { ...it, id });
  }

  return Array.from(map.values());
}

export default function CartWishlistSync() {
  const { status, data } = useSession();
  const email = data?.user?.email ?? null;

  const setCartItems = useCartStore((s) => s.setItems);
  const setWishItems = useWishlistStore((s) => s.setItems);

  
  const mergedForEmailRef = useRef<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !email) return;

    const normalizedEmail = email.toLowerCase().trim();

    
    if (mergedForEmailRef.current === normalizedEmail) return;

    const mergeKey = `yourtype_merged_once_${normalizedEmail}`;
    const alreadyMerged = localStorage.getItem(mergeKey) === "1";

    (async () => {
      try {
        const cartRes = await fetch("/api/cart", { cache: "no-store" });
        const cartJson = await cartRes.json().catch(() => ({}));
        const serverCart: ServerCartItem[] = Array.isArray(cartJson?.items)
          ? cartJson.items
          : [];

        const wishRes = await fetch("/api/wishlist", { cache: "no-store" });
        const wishJson = await wishRes.json().catch(() => ({}));
        const serverWish: ServerWishItem[] = Array.isArray(wishJson?.items)
          ? wishJson.items
          : [];

       
        const localCart = alreadyMerged ? [] : readPersistedItems("yourtype_cart_v1");
        const localWish = alreadyMerged ? [] : readPersistedItems("yourtype_wishlist_v1");

       
        const mergedCart = mergeCart(localCart, serverCart);
        const mergedWish = mergeWishlist(localWish, serverWish);

      
        setCartItems(mergedCart);
        setWishItems(mergedWish);

     
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: mergedCart.map((x: any) => ({
              productId: x.productId,
              slug: x.slug,
              name: x.name,
              price: x.price,
              image: x.image,
              color: x.color,
              size: x.size,
              qty: x.qty,
            })),
          }),
        });

        await fetch("/api/wishlist", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: mergedWish.map((x: any) => ({
              productId: x.productId,
              slug: x.slug,
              name: x.name,
              price: x.price,
              image: x.image,
              color: x.color,
              size: x.size,
            })),
          }),
        });

        localStorage.setItem(mergeKey, "1");
        mergedForEmailRef.current = normalizedEmail;
      } catch (e) {
        console.error("Cart/Wishlist sync error:", e);
      }
    })();
  }, [status, email, setCartItems, setWishItems]);

  return null;
}
