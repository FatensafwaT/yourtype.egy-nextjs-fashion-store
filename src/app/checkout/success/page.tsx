"use client";

import Link from "next/link";
import { useState } from "react";

type LastOrder = {
  orderId: string;
  totalItems: number;
  totalPrice: number;
  placedAt: string;
};

function readLastOrder(): LastOrder | null {
  try {
    const raw = localStorage.getItem("yourtype_last_order_v1");
    if (!raw) return null;
    return JSON.parse(raw) as LastOrder;
  } catch {
    return null;
  }
}

export default function CheckoutSuccessPage() {
  const [order] = useState<LastOrder | null>(() => readLastOrder());

  return (
    <div className="rounded-3xl border bg-white p-10 text-center shadow-sm text-gray-500">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-2xl">
        ✅
      </div>

      <h1 className="mt-4 text-2xl font-semibold">
        Order placed successfully!
      </h1>
      <p className="mt-2 text-gray-600">
        Thank you for shopping with{" "}
        <span className="font-medium">YourType.egy</span> 💖
      </p>

      {order && (
        <div className="mx-auto mt-6 max-w-md rounded-3xl border bg-[#fffafc] p-5 text-left">
          <p className="text-sm text-gray-600">Order ID</p>
          <p className="font-semibold">{order.orderId}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white p-3">
              <p className="text-gray-500">Items</p>
              <p className="font-medium">{order.totalItems}</p>
            </div>
            <div className="rounded-2xl bg-white p-3">
              <p className="text-gray-500">Total</p>
              <p className="font-medium">{order.totalPrice} EGP</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Placed at: {order.placedAt}
          </p>

          <p className="mt-3 text-xs text-gray-500">
            * Demo order (no real payment).
          </p>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/products"
          className="rounded-full bg-pink-400 px-6 py-3 text-sm font-medium text-white hover:bg-pink-500"
        >
          Continue shopping
        </Link>
        <Link
          href="/"
          className="rounded-full border bg-white px-6 py-3 text-sm font-medium hover:bg-pink-50"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
