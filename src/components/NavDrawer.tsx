"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

function Item({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "block rounded-2xl border px-4 py-3 text-sm transition",
        active
          ? "border-pink-300 bg-pink-50 text-gray-800"
          : "bg-white text-gray-600 hover:bg-pink-50",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function NavDrawer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);


  useEffect(() => {
    setOpen(false);
  }, [pathname]);


  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);


  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const DrawerUI = open ? (
    <div className="fixed inset-0 z-[99999]">
      {/* Overlay */}
      <button
        aria-label="Close overlay"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/40"
      />

      {/* Panel */}
      <div className="fixed left-0 top-0 h-full w-[85%] max-w-sm overflow-auto rounded-r-3xl border bg-white p-5 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">Menu</p>
            <p className="mt-1 text-xs text-gray-500">Quick navigation</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-full border bg-white px-3 py-1 text-sm text-gray-600 hover:bg-pink-50"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Links */}
        <div className="mt-6 space-y-2">
          <Item
            href="/"
            label="Home"
            active={pathname === "/"}
            onClick={() => setOpen(false)}
          />

          <Item
            href="/products?page=1&limit=12"
            label="Shop"
            active={pathname === "/products"}
            onClick={() => setOpen(false)}
          />

          <Item
            href="/cart"
            label="Cart"
            active={pathname === "/cart"}
            onClick={() => setOpen(false)}
          />

          <Item
            href="/wishlist"
            label="Wishlist"
            active={pathname === "/wishlist"}
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="my-6 h-px bg-gray-100" />

        {/* Categories */}
        <p className="text-sm font-semibold text-gray-700">Categories</p>
        <div className="mt-3 space-y-2">
          {["Tops", "Dresses", "Pants", "Accessories"].map((c) => (
            <Link
              key={c}
              href={`/products?page=1&limit=12&category=${encodeURIComponent(
                c,
              )}`}
              onClick={() => setOpen(false)}
              className="block rounded-2xl border bg-white px-4 py-3 text-sm text-gray-600 hover:bg-pink-50"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border bg-white px-3 py-2 text-sm text-gray-700 hover:bg-pink-50"
        aria-label="Open menu"
      >
        ☰
      </button>

     
      {mounted && DrawerUI ? createPortal(DrawerUI, document.body) : null}
    </>
  );
}
