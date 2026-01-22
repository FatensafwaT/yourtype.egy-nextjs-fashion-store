import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import MotionPage from "@/components/MotionPage";
import { headers } from "next/headers";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  colors: string[];
  sizes: string[];
};

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

async function getProducts(page = 1, limit = 12) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/products?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });

  if (!res.ok) return { items: [] as Product[], meta: null as any };

  const data = await res.json();
  return data as {
    items: Product[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasPrev: boolean;
      hasNext: boolean;
    };
  };
}

export default async function HomePage() {
 const { items: products, meta } = await getProducts(1, 12);


  const heroProducts = products.slice(0, 2);
  const newArrivals = products.slice(0, 9); 
  return (
    <MotionPage>
      <div className="space-y-12">
        {/* Hero */}
        <section className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">
                <span className="bg-gradient-to-r from-pink-400 via-gray-400 to-purple-400 bg-clip-text text-transparent">
                  Find your type.
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Wear your vibe 💕
                </span>
              </h1>

              <p className="mt-3 text-gray-400">
                Cute, comfy, and stylish pieces designed for your everyday mood.
              </p>

              <div className="mt-6 flex gap-3">
                <Link
                  href="/products"
                  className="rounded-full bg-pink-400 px-6 py-3 text-sm font-medium text-white hover:bg-pink-500"
                >
                  Shop now
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {heroProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
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
            {newArrivals.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </section>
      </div>
    </MotionPage>
  );
}
