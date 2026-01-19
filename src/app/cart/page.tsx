"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import MotionPage from "@/components/MotionPage";
export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const incQty = useCartStore((s) => s.incQty);
  const decQty = useCartStore((s) => s.decQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clear = useCartStore((s) => s.clear);

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
        <p className="text-xl font-semibold text-gray-500">Your cart is empty 🥺</p>
        <p className="mt-2 text-gray-600">Let’s add something cute.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-pink-400 px-6 py-3 text-sm font-medium text-white hover:bg-pink-500"
        >
          Go shopping
        </Link>
      </div>
    );
  }

  return (
    <MotionPage>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Cart</h1>
              <p className="text-gray-600">{totalItems} item(s)</p>
            </div>

            <button
              onClick={clear}
              className="text-sm text-pink-500 hover:underline"
            >
              Clear cart
            </button>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border bg-white p-4 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="relative h-28 w-24 overflow-hidden rounded-2xl border bg-white">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Size: <span className="font-medium">{item.size}</span> •
                        Color:{" "}
                        <span
                          className="inline-block h-3 w-3 rounded-full border align-middle mx-1"
                          style={{ backgroundColor: item.color }}
                        />
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-gray-500 hover:text-pink-500"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-semibold text-pink-500">
                      {item.price} EGP
                    </p>

                    <div className="flex items-center gap-2 rounded-full border bg-white px-2 py-1">
                      <button
                        onClick={() => decQty(item.id)}
                        className="h-8 w-8 rounded-full hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => incQty(item.id)}
                        className="h-8 w-8 rounded-full hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold">Summary</h2>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{totalPrice} EGP</span>
            </div>

            <div className="pt-3 border-t flex justify-between text-base">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{totalPrice} EGP</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-5 block w-full rounded-full bg-pink-400 py-3 text-center font-medium text-white hover:bg-pink-500"
          >
            Checkout
          </Link>

          <Link
            href="/products"
            className="mt-3 block text-center text-sm text-pink-500 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </MotionPage>
  );
}
