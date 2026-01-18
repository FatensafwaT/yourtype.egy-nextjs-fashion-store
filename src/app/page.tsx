import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm text-gray-500">New pastel collection</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">
              <span className="bg-gradient-to-r from-pink-400 via-gray-400 to-purple-400 bg-clip-text text-transparent">
                Find your type.
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                Wear your vibe 💕
              </span>
            </h1>

            <p className="mt-3 text-gray-600">
              Cute, comfy, and stylish pieces designed for your everyday mood.
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                href="/products"
                className="rounded-full bg-pink-400 px-6 py-3 text-sm font-medium text-white hover:bg-pink-500"
              >
                Shop now
              </Link>
              <Link
                href="/products"
                className="rounded-full border bg-white px-6 py-3 text-sm font-medium hover:bg-pink-50"
              >
                Browse products
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 2).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">New Arrivals</h2>
          <Link
            href="/products"
            className="text-sm text-pink-500 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
