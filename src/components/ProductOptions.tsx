"use client";
import { useWishlistStore } from "@/store/wishlist";
import { useMemo, useState } from "react";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";

export default function ProductOptions({
  colors,
  sizes,
  product,
}: {
  colors: string[];
  sizes: string[];
  product: {
    id: string;
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

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      {/* Colors */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Color</p>
          <span className="text-xs text-gray-500">Selected</span>
        </div>

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
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Size</p>
          <button className="text-sm text-pink-500 hover:underline">
            Size guide
          </button>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
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

      {/* Quantity (UI) */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm font-medium">Quantity</p>
        <div className="flex items-center gap-2 rounded-full border bg-white px-2 py-1">
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

      {/* CTA */}
      <button
        type="button"
        onClick={() => {
          addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            color: selectedColor,
            size: selectedSize,
            qty,
          });
          toast("Added to cart");
        }}
        className="mt-5 w-full rounded-full bg-pink-400 py-3 font-medium text-white hover:bg-pink-500"
      >
        Add to cart
      </button>

      <button
        type="button"
        onClick={() => {
          const willRemove = isWished;
          toggleWish({
            productId: product.id,
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
        className="mt-3 w-full rounded-full border bg-white py-3 font-medium hover:bg-purple-50"
      >
        {isWished ? "♥ In wishlist" : "♡ Add to wishlist"}
      </button>
    </div>
  );
}
