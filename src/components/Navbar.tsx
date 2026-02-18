"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useSession, signOut } from "next-auth/react";
import NavDrawer from "./NavDrawer";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(currentQ);

  const { data, status } = useSession();
  const isAuthed = status === "authenticated";

  // ✅ hydration flags
  const cartHydrated = useCartStore((s) => s.hasHydrated);
  const wishHydrated = useWishlistStore((s) => s.hasHydrated);

  // ✅ counts
  const cartCountRaw = useCartStore((s) => s.totalItems());
  const wishCountRaw = useWishlistStore((s) => s.count());

  // ✅ prevent any SSR/CSR mismatch: show 0 until hydrated
  const cartCount = cartHydrated ? cartCountRaw : 0;
  const wishCount = wishHydrated ? wishCountRaw : 0;

  useEffect(() => {
    setQ(currentQ);
  }, [currentQ]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const value = q.trim();

    if (!value) {
      router.push("/products");
      return;
    }
    router.push(`/products?q=${encodeURIComponent(value)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <NavDrawer />

        <Link href="/" className="text-lg font-semibold">
          <span className="text-pink-500">YourType</span>
          <span className="text-purple-400">.egy</span>
        </Link>

        <div className="flex-1">
          <form
            onSubmit={submitSearch}
            className="flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-gray-500"
          >
            <span className="text-gray-400">⌕</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cute items..."
              className="w-full bg-transparent text-sm text-gray-500 outline-none"
            />
          </form>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative rounded-full border bg-white px-3 py-2 text-sm text-gray-500 hover:bg-pink-50"
          >
            🛒 Cart
            {cartCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-400 px-1 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/wishlist"
            className="relative rounded-full border bg-white px-3 py-2 text-sm text-gray-500 hover:bg-pink-50"
          >
            💖 Wishlist
            {wishCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-400 px-1 text-xs font-semibold text-white">
                {wishCount}
              </span>
            )}
          </Link>

          {status === "loading" ? (
            <div className="rounded-full border bg-white px-4 py-2 text-sm text-gray-500">
              Loading...
            </div>
          ) : isAuthed ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="rounded-full border bg-white px-4 py-2 text-sm text-gray-500 hover:bg-pink-50"
              >
                👤 {data?.user?.name ?? "Account"}
              </Link>

              <button
                onClick={async () => {
                  await signOut({ callbackUrl: "/" });
                }}
                className="rounded-full border bg-white px-4 py-2 text-sm text-gray-500 hover:bg-pink-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-full border bg-white px-4 py-2 text-sm text-gray-500 hover:bg-pink-50"
            >
              👤 Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
