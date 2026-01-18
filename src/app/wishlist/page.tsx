"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { products } from "@/data/products";
import { useToastStore } from "@/store/toast";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const clear = useWishlistStore((s) => s.clear);
  const addItem = useCartStore((s) => s.addItem);
  const toast = useToastStore((s) => s.push);

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
        <p className="text-xl font-semibold">Your wishlist is empty 💖</p>
        <p className="mt-2 text-gray-600">Save your favorite items here.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-pink-400 px-6 py-3 text-sm font-medium text-white hover:bg-pink-500"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Wishlist</h1>
          <p className="text-gray-600">{items.length} item(s)</p>
        </div>

        <button
          onClick={clear}
          className="text-sm text-pink-500 hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-3xl border bg-white p-3 shadow-sm"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={it.image}
                alt={it.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 50vw, 25vw"
              />
            </div>

            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{it.name}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Size: <span className="font-medium">{it.size}</span> • Color:{" "}
                  <span
                    className="inline-block h-3 w-3 rounded-full border align-middle mx-1"
                    style={{ backgroundColor: it.color }}
                  />
                </p>

                <p className="text-sm font-semibold text-pink-500">
                  {it.price} EGP
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    addItem({
                      productId: it.productId,
                      name: it.name,
                      price: it.price,
                      image: it.image,
                      color: it.color,
                      size: it.size,
                      qty: 1,
                    });

                    remove(it.id); // remove same variant from wishlist
                    toast("Moved to cart");

                  }}
                  className="flex-1 rounded-full bg-pink-400 px-3 py-2 text-sm font-medium text-white hover:bg-pink-500"
                >
                  Move to cart
                </button>

                <button
                  onClick={() => remove(it.id)}
                  className="rounded-full border bg-white px-3 py-2 text-sm hover:bg-pink-50"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/products"
        className="mt-3 block text-center text-sm text-pink-500 hover:underline"
      >
        Continue shopping
      </Link>
    </div>
  );
}
