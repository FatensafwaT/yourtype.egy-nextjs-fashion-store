import { headers } from "next/headers";
import MotionPage from "@/components/MotionPage";
import ProductCard from "@/components/ProductCard";
import ProductsFiltersBar from "@/components/ProductsFiltersBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

async function getProducts(sp: Record<string, string | string[] | undefined>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string" && v.trim()) qs.set(k, v);
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (!host) return [] as Product[];

  const base = `${proto}://${host}`;
  const url = `${base}/api/products?${qs.toString()}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return [] as Product[];
  return (await res.json()) as Product[];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams; // ✅ unwrap promise
  const products = await getProducts(sp);

  const allColors = Array.from(new Set(products.flatMap((p) => p.colors)));

  return (
    <MotionPage>
      <div className="space-y-6">
        <ProductsFiltersBar allColors={allColors} />

        {products.length === 0 ? (
          <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-medium">No results found</p>
            <p className="mt-2 text-sm text-gray-600">
              Try searching again or clear filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        )}
      </div>
    </MotionPage>
  );
}
