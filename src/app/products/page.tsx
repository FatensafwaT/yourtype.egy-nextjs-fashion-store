"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").toLowerCase().trim();

  const filtered = useMemo(() => {
    if (!q) return products;
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    });
  }, [q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Shop</h1>
          <p className="text-gray-600">
            {q ? (
              <>
                Results for{" "}
                <span className="font-medium text-gray-800">“{q}”</span>
              </>
            ) : (
              "Cute pastel pieces you’ll love."
            )}
          </p>
        </div>

        <div className="flex gap-2">
          <select className="rounded-full border bg-white px-4 py-2 text-sm">
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>

          <button className="rounded-full border bg-white px-4 py-2 text-sm hover:bg-pink-50">
            Filters
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-medium">No results found</p>
          <p className="mt-2 text-sm text-gray-600">
            Try searching for “tops”, “dresses”, or “accessories”.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
