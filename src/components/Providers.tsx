"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import { useCartStore } from "@/store/cart";
import { loadCart, saveCart } from "@/lib/cartStorage";

import { useWishlistStore } from "@/store/wishlist";
import { loadWishlist, saveWishlist } from "@/lib/wishlistStorage";

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

  // hydrate flags (بنبعته true أول ما المكون يركب)
  useEffect(() => {
    useCartStore.getState().setHasHydrated(true);
    useWishlistStore.getState().setHasHydrated(true);
  }, []);

  // load on login (مرة واحدة لكل ايميل)
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!email) return;

    if (didLoadForEmailRef.current === email) return;

    cartSetItems(loadCart(email));
    wishSetItems(loadWishlist(email));

    didLoadForEmailRef.current = email;
  }, [status, email, cartSetItems, wishSetItems]);

  // save while authed
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

  // clear on logout
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
