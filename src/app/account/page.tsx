import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm space-y-4">
      <h1 className="text-2xl font-semibold">My Account</h1>
      <p className="text-gray-600">Demo account page.</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/account/orders"
          className="rounded-full bg-pink-400 px-6 py-3 text-center text-sm font-medium text-white hover:bg-pink-500"
        >
          View orders
        </Link>
        <Link
          href="/products"
          className="rounded-full border bg-white px-6 py-3 text-center text-sm font-medium hover:bg-pink-50"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
