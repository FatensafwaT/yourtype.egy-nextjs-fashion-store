import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-10 text-center shadow-sm text-gray-600">
      <p className="text-2xl font-semibold text-gray-800">404</p>
      <p className="mt-2">Page not found 🥺</p>

      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-pink-400 px-6 py-3 text-sm font-medium text-white hover:bg-pink-500"
        >
          Go Home
        </Link>
        <Link
          href="/products?page=1&limit=12"
          className="rounded-full border bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-pink-50"
        >
          Shop
        </Link>
      </div>
    </div>
  );
}
