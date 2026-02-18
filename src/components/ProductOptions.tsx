"use client";

import { useWishlistStore } from "@/store/wishlist";
import { useMemo, useState } from "react";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProductOptions({
  colors,
  sizes,
  product,
}: {
  colors: string[];
  sizes: string[];
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
  };
}) {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wishId = `${product.id}_${selectedColor}_${selectedSize}`;
  const isWished = useWishlistStore((s) => s.has(wishId));

  const selectedColorLabel = useMemo(() => selectedColor, [selectedColor]);

  const toast = useToastStore((s) => s.push);
  const router = useRouter();
  const { status } = useSession();

  function addCurrentVariantToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: selectedColor,
      size: selectedSize,
      qty,
    });
  }

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      {/* Colors */}
      <div>
        <p className="text-sm font-medium text-gray-500">Color</p>

        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((c) => {
            const isActive = c === selectedColor;
            return (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={[
                  "h-10 w-10 rounded-full border transition",
                  "ring-offset-2 hover:ring-2 hover:ring-pink-200",
                  isActive ? "ring-2 ring-pink-300" : "",
                ].join(" ")}
                style={{ backgroundColor: c }}
                aria-label="color"
                title={selectedColorLabel}
              />
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="mt-5">
        <p className="text-sm font-medium text-gray-500">Size</p>

        <div className="mt-2 flex flex-wrap gap-2 text-gray-500">
          {sizes.map((s) => {
            const isActive = s === selectedSize;
            return (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={[
                  "rounded-full border px-4 py-2 text-sm transition",
                  isActive
                    ? "border-pink-300 bg-pink-50"
                    : "bg-white hover:bg-pink-50",
                ].join(" ")}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity */}
      <div className="mt-5 flex items-center justify-between text-gray-500">
        <p className="text-sm font-medium text-gray-500">Quantity</p>
        <div className="flex items-center gap-2 rounded-full border px-2 py-1">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            −
          </button>
          <span className="w-6 text-center text-sm">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <button
        type="button"
        onClick={() => {
          addCurrentVariantToCart();
          toast("Added to cart");
        }}
        className="mt-5 w-full rounded-full bg-pink-400 py-3 font-medium text-white hover:bg-pink-500"
      >
        Add to cart
      </button>

      {/* Buy it now */}
      <button
        type="button"
        onClick={() => {
         
          addCurrentVariantToCart();


          if (status !== "authenticated") {
            router.push(
              `/auth/login?callbackUrl=${encodeURIComponent(
                "/checkout",
              )}&reason=login_required`,
            );
            return;
          }

      
          router.push("/checkout");
        }}
        className="mt-3 w-full rounded-full bg-pink-400 py-3 font-medium text-white hover:bg-pink-500"
      >
        Buy it now
      </button>

      {/* Wishlist */}
      <button
        type="button"
        onClick={() => {
          const willRemove = isWished;
          toggleWish({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
            color: selectedColor,
            size: selectedSize,
          });

          toast(
            willRemove ? "Removed from wishlist" : "Added to wishlist",
            "info",
          );
        }}
        className="mt-4 w-full rounded-full border bg-white py-3 font-medium text-gray-500 hover:bg-purple-50"
      >
        {isWished ? "♥ In wishlist" : "♡ Add to wishlist"}
      </button>
    </div>
  );
}
