import Link from "next/link";
import ProductOptions from "@/components/ProductOptions";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
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

async function getProduct(slug: string) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/products/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return (await res.json()) as Product;
}

async function getRelated(category: string, excludeId: string) {
  const base = await getBaseUrl();
  const res = await fetch(
    `${base}/api/products?category=${encodeURIComponent(category)}`,
    { cache: "no-store" },
  );

  if (!res.ok) return [] as Product[];
  const list = (await res.json()) as Product[];

  return list.filter((p) => p.id !== excludeId).slice(0, 3);
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <p className="font-medium">Product not found.</p>
        <Link
          href="/products"
          className="mt-3 inline-block text-pink-500 hover:underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const related = await getRelated(product.category, product.id);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link href="/products" className="hover:underline">
          Shop
        </Link>{" "}
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Images */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Info */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500">{product.category}</p>

            <h1 className="mt-1 text-3xl font-semibold leading-tight">
              {product.name}
            </h1>

            <p className="mt-3 text-xl font-semibold text-pink-500">
              {product.price} EGP
            </p>

            
          </div>

          {/* Variant box */}
          <ProductOptions
            colors={product.colors}
            sizes={product.sizes}
            product={{
              id: product.id,
              slug: product.slug, 
              name: product.name,
              price: product.price,
              image: product.images[0],
            }}
          />

          {/* Description */}
          <div className="rounded-3xl border bg-white p-5 text-gray-700 shadow-sm">
            <p className="text-sm font-medium">Description</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              A cute pastel essential with comfy fabric and sweet details —
              perfect for everyday styling. Pair it with your favorite skirt or
              jeans for a soft, confident look.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-[#fffafc] p-3">
                <p className="text-gray-500">Material</p>
                <p className="font-medium">Soft cotton blend</p>
              </div>
              <div className="rounded-2xl bg-[#fffafc] p-3">
                <p className="text-gray-500">Care</p>
                <p className="font-medium">Gentle wash</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">You may also like</h2>
            <Link
              href="/products"
              className="text-sm text-pink-500 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
