"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";

export default function Navbar() {
  const cartCount = useCartStore((s) => s.totalItems());
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(currentQ);

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
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold">
          <span className="text-pink-500">YourType</span>
          <span className="text-purple-400">.egy</span>
        </Link>

        {/* Search */}
        <div className="flex-1">
          <form
            onSubmit={submitSearch}
            className="flex items-center gap-2 rounded-full border bg-white px-3 py-2"
          >
            <span className="text-gray-400">⌕</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cute items..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
        </div>

        {/* Actions */}
        <nav className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative rounded-full border bg-white px-3 py-2 text-sm hover:bg-pink-50"
          >
            🛒 Cart
            {cartCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-400 px-1 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/account"
            className="rounded-full border bg-white px-3 py-2 text-sm hover:bg-pink-50"
          >
            👤 Account
          </Link>
        </nav>
      </div>
    </header>
  );
}
