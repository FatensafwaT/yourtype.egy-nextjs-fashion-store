"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type OrderItem = {
  name: string;
  price: number;
  qty: number;
  color: string;
  size: string;
  image: string;
};

type Order = {
  orderId: string;
  totalItems: number;
  totalPrice: number;
  placedAt: string;
  address: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
  };
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data));
  }, []);

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border bg-white p-10 text-center shadow-sm text-gray-500">
        <p className="text-xl font-semibold">No orders yet 🧾</p>
        <p className="mt-2 text-gray-600">
          Place your first order to see it here.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-pink-400 px-6 py-3 text-sm font-medium text-white hover:bg-pink-500"
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-gray-500">
      <div>
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="text-gray-600">Your recent orders (demo).</p>
      </div>

      {orders.map((order) => (
        <div
          key={order.orderId}
          className="rounded-3xl border bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold">{order.orderId}</p>
              <p className="mt-1 text-sm text-gray-600">{order.placedAt}</p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl bg-[#fffafc] p-3 text-sm">
                <p className="text-gray-500">Items</p>
                <p className="font-medium">{order.totalItems}</p>
              </div>
              <div className="rounded-2xl bg-[#fffafc] p-3 text-sm">
                <p className="text-gray-500">Total</p>
                <p className="font-medium">{order.totalPrice} EGP</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-[#fffafc] p-4 text-sm">
            <p className="font-medium">Delivery</p>
            <p className="mt-1 text-gray-600">
              {order.address.fullName} • {order.address.phone}
            </p>
            <p className="text-gray-600">
              {order.address.city} — {order.address.address}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium">Items</p>
            <div className="mt-2 space-y-3">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex gap-3 rounded-2xl border p-3">
                  <div className="relative h-16 w-14 overflow-hidden rounded-xl border bg-white">
                    <Image
                      src={it.image}
                      alt={it.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">{it.name}</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Size: <span className="font-medium">{it.size}</span> •
                      Color:{" "}
                      <span
                        className="inline-block h-3 w-3 rounded-full border align-middle mx-1"
                        style={{ backgroundColor: it.color }}
                      />
                      • Qty: <span className="font-medium">{it.qty}</span>
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-pink-500">
                    {it.price} EGP
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
