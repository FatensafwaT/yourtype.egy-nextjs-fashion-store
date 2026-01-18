"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];
const ALL_CATEGORIES = ["Tops", "Dresses", "Pants", "Accessories"] as const;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = (searchParams.get("q") ?? "").toLowerCase().trim();

  const [sort, setSort] = useState(searchParams.get("sort") ?? "new");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all",
  );
  const [size, setSize] = useState(searchParams.get("size") ?? "all");
  const [color, setColor] = useState(searchParams.get("color") ?? "all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams();

    if (q) params.set("q", q);
    if (sort !== "new") params.set("sort", sort);
    if (category !== "all") params.set("category", category);
    if (size !== "all") params.set("size", size);
    if (color !== "all") params.set("color", color);

    router.replace(`/products?${params.toString()}`, { scroll: false });
  }, [q, sort, category, size, color, router]);

  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => set.add(c)));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (size !== "all") {
      list = list.filter((p) => p.sizes.includes(size));
    }

    if (color !== "all") {
      list = list.filter((p) => p.colors.includes(color));
    }

    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    return list;
  }, [q, category, size, color, sort]);

  const hasActiveFilters =
    category !== "all" || size !== "all" || color !== "all";

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-full border bg-white px-4 py-2 text-sm"
          >
            <option value="new">Newest</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>

          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="rounded-full border bg-white px-4 py-2 text-sm hover:bg-pink-50"
          >
            Filters
          </button>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setCategory("all");
                setSize("all");
                setColor("all");
                setSort("new");
                router.replace("/products");
              }}
              className="rounded-full border bg-white px-4 py-2 text-sm hover:bg-pink-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {filtersOpen && (
        <div className="rounded-3xl border bg-white p-5 shadow-sm space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Category */}
            <div>
              <p className="text-sm font-medium">Category</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory("all")}
                  className={[
                    "rounded-full border px-4 py-2 text-sm",
                    category === "all"
                      ? "border-pink-300 bg-pink-50"
                      : "bg-white hover:bg-pink-50",
                  ].join(" ")}
                >
                  All
                </button>
                {ALL_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm",
                      category === c
                        ? "border-pink-300 bg-pink-50"
                        : "bg-white hover:bg-pink-50",
                    ].join(" ")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <p className="text-sm font-medium">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setSize("all")}
                  className={[
                    "rounded-full border px-4 py-2 text-sm",
                    size === "all"
                      ? "border-pink-300 bg-pink-50"
                      : "bg-white hover:bg-pink-50",
                  ].join(" ")}
                >
                  All
                </button>
                {ALL_SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm",
                      size === s
                        ? "border-pink-300 bg-pink-50"
                        : "bg-white hover:bg-pink-50",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <p className="text-sm font-medium">Color</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setColor("all")}
                  className={[
                    "rounded-full border px-4 py-2 text-sm",
                    color === "all"
                      ? "border-pink-300 bg-pink-50"
                      : "bg-white hover:bg-pink-50",
                  ].join(" ")}
                >
                  All
                </button>

                {allColors.slice(0, 10).map((c) => {
                  const active = color === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={[
                        "h-10 w-10 rounded-full border transition ring-offset-2",
                        active
                          ? "ring-2 ring-pink-300"
                          : "hover:ring-2 hover:ring-pink-200",
                      ].join(" ")}
                      style={{ backgroundColor: c }}
                      aria-label="color"
                      title={c}
                    />
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                (Demo) showing up to 10 colors
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-medium">No results found</p>
          <p className="mt-2 text-sm text-gray-600">
            Try searching for “tops”, or clear filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
