"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import { useCartStore } from "@/store/cart";
import {
  loadCart,
  saveCart,
  loadGuestCart,
  saveGuestCart,
  clearGuestCart,
  mergeCartItems,
} from "@/lib/cartStorage";

import { useWishlistStore } from "@/store/wishlist";
import {
  loadWishlist,
  saveWishlist,
  loadGuestWishlist,
  saveGuestWishlist,
  clearGuestWishlist,
  mergeWishlistItems,
} from "@/lib/wishlistStorage";

function Sync() {
  const { data, status } = useSession();
  const email = data?.user?.email ?? null;

  const cartItems = useCartStore((s) => s.items);
  const cartSetItems = useCartStore((s) => s.setItems);
  const cartClear = useCartStore((s) => s.clear);

  const wishItems = useWishlistStore((s) => s.items);
  const wishSetItems = useWishlistStore((s) => s.setItems);
  const wishClear = useWishlistStore((s) => s.clear);

  const didLoadForEmailRef = useRef<string | null>(null);

  // hydration flags (زي ما عندك)
  useEffect(() => {
    useCartStore.getState().setHasHydrated(true);
    useWishlistStore.getState().setHasHydrated(true);
  }, []);

  // 1) أثناء guest: احفظ cart/wishlist في guest storage
  useEffect(() => {
    if (status !== "unauthenticated") return;
    saveGuestCart(cartItems);
    saveGuestWishlist(wishItems);
  }, [status, cartItems, wishItems]);

  // 2) عند login: load user + merge guest + set store + save user + clear guest
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!email) return;

    if (didLoadForEmailRef.current === email) return;

    const userCart = loadCart(email);
    const guestCart = loadGuestCart();
    const mergedCart = mergeCartItems(userCart, guestCart);

    const userWish = loadWishlist(email);
    const guestWish = loadGuestWishlist();
    const mergedWish = mergeWishlistItems(userWish, guestWish);

    cartSetItems(mergedCart);
    wishSetItems(mergedWish);

    saveCart(mergedCart, email);
    saveWishlist(mergedWish, email);

    clearGuestCart();
    clearGuestWishlist();

    didLoadForEmailRef.current = email;
  }, [status, email, cartSetItems, wishSetItems]);

  // 3) أثناء authenticated: احفظ لأي تغيير
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!email) return;
    saveCart(cartItems, email);
  }, [status, email, cartItems]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!email) return;
    saveWishlist(wishItems, email);
  }, [status, email, wishItems]);

  // 4) عند logout: فضّي الـ stores (لكن ما تمسحيش user storage)
  useEffect(() => {
    if (status !== "unauthenticated") return;

    didLoadForEmailRef.current = null;
    cartClear();
    wishClear();
  }, [status, cartClear, wishClear]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Sync />
      {children}
    </SessionProvider>
  );
}
