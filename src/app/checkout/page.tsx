"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/store/cart";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  fullName: z.string().min(3, "Please enter your full name"),
  phone: z
    .string()
    .min(10, "Phone number is too short")
    .max(15, "Phone number is too long"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(8, "Address is too short"),
  payment: z.enum(["cod", "card"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      payment: "cod",
    },
  });

  const payment = watch("payment");

  useEffect(() => {
    const raw = localStorage.getItem("yourtype_checkout_address_v1");
    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as Partial<FormValues>;
      if (saved.fullName) setValue("fullName", saved.fullName);
      if (saved.phone) setValue("phone", saved.phone);
      if (saved.city) setValue("city", saved.city);
      if (saved.address) setValue("address", saved.address);
    } catch {}
  }, [setValue]);

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
        <p className="text-xl font-semibold">No items to checkout 🥺</p>
        <p className="mt-2 text-gray-600">Add products to your cart first.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-pink-400 px-6 py-3 text-sm font-medium text-white hover:bg-pink-500"
        >
          Go shopping
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 700));

    // 1) Persist address (without payment/notes لو تحبي)
    const addressToSave = {
      fullName: data.fullName,
      phone: data.phone,
      city: data.city,
      address: data.address,
    };
    localStorage.setItem(
      "yourtype_checkout_address_v1",
      JSON.stringify(addressToSave),
    );

    // 2) Save last order summary for success page
    const orderId = `YT-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
    localStorage.setItem(
      "yourtype_last_order_v1",
      JSON.stringify({
        orderId,
        totalItems,
        totalPrice,
        placedAt: new Date().toLocaleString(),
      }),
    );
    // 2.5) Append to orders list
    const ordersRaw = localStorage.getItem("yourtype_orders_v1");
    const orders = ordersRaw ? JSON.parse(ordersRaw) : [];

    orders.unshift({
      orderId,
      totalItems,
      totalPrice,
      placedAt: new Date().toLocaleString(),
      address: addressToSave,
      items: items.map((x) => ({
        name: x.name,
        price: x.price,
        qty: x.qty,
        color: x.color,
        size: x.size,
        image: x.image,
      })),
    });

    localStorage.setItem("yourtype_orders_v1", JSON.stringify(orders));

    // 3) Clear cart + navigate
    clear();
    router.push("/checkout/success");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <p className="text-gray-600">
            Please enter your delivery information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl border bg-white p-6 shadow-sm space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Full name</label>
              <input
                {...register("fullName")}
                className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="Faten Safwat"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                {...register("phone")}
                className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="01xxxxxxxxx"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">City</label>
              <input
                {...register("city")}
                className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="Cairo"
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <input
                {...register("address")}
                className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="Street, building, apartment..."
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Payment</label>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm">
                <input type="radio" value="cod" {...register("payment")} />
                Cash on delivery
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm">
                <input type="radio" value="card" {...register("payment")} />
                Card (demo)
              </label>
            </div>
            {errors.payment && (
              <p className="mt-1 text-xs text-red-500">
                {errors.payment.message}
              </p>
            )}

            {payment === "card" && (
              <p className="mt-2 text-xs text-gray-500">
                Card payments will be added later (Stripe test).
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              {...register("notes")}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="Any delivery notes?"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-pink-400 py-3 font-medium text-white hover:bg-pink-500 disabled:opacity-60"
          >
            {isSubmitting ? "Placing order..." : "Place order"}
          </button>

          <Link
            href="/cart"
            className="block text-center text-sm text-pink-500 hover:underline"
          >
            Back to cart
          </Link>
        </form>
      </div>

      {/* Summary */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm h-fit">
        <h2 className="text-lg font-semibold">Order summary</h2>

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

        <p className="mt-4 text-xs text-gray-500">
          Demo checkout (no real payment).
        </p>
      </div>
    </div>
  );
}
