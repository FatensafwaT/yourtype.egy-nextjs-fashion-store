"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];
const ALL_CATEGORIES = [
  { label: "Tops", value: "Tops" },
  { label: "Dresses", value: "Dresses" },
  { label: "Pants", value: "Pants" },
  { label: "Accessories", value: "Accessories" },
] as const;

export default function ProductsFiltersBar({
  allColors,
}: {
  allColors: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ URL هو المصدر الحقيقي
  const q = (searchParams.get("q") ?? "").trim();
  const sort = searchParams.get("sort") ?? "new";
  const category = searchParams.get("category") ?? "all";
  const size = searchParams.get("size") ?? "all";
  const color = searchParams.get("color")
    ? decodeURIComponent(searchParams.get("color")!)
    : "all";

  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentParamsString = useMemo(
    () => searchParams.toString(),
    [searchParams],
  );

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(currentParamsString);

    Object.entries(patch).forEach(([key, value]) => {
      if (!value || value === "all" || value === "new") params.delete(key);
      else params.set(key, value);
    });

    const next = params.toString();
    router.replace(next ? `/products?${next}` : "/products", { scroll: false });
  }

  const hasActiveFilters =
    category !== "all" || size !== "all" || color !== "all" || sort !== "new";

  return (
    <div className="space-y-4 text-gray-500">
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
            onChange={(e) => updateParams({ sort: e.target.value })}
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
              onClick={() => router.replace("/products")}
              className="rounded-full border bg-white px-4 py-2 text-sm hover:bg-pink-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="rounded-3xl border bg-white p-5 shadow-sm space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Category */}
            <div>
              <p className="text-sm font-medium">Category</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => updateParams({ category: "all" })}
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
                    key={c.value}
                    onClick={() => updateParams({ category: c.value })}
                    className={[
                      "rounded-full border px-4 py-2 text-sm",
                      category === c.value
                        ? "border-pink-300 bg-pink-50"
                        : "bg-white hover:bg-pink-50",
                    ].join(" ")}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <p className="text-sm font-medium">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => updateParams({ size: "all" })}
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
                    onClick={() => updateParams({ size: s })}
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
                  onClick={() => updateParams({ color: "all" })}
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
                  const active = color.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => updateParams({ color: c })}
                      className={[
                        "h-10 w-10 rounded-full border transition ring-offset-2",
                        active
                          ? "ring-2 ring-pink-300"
                          : "hover:ring-2 hover:ring-pink-200",
                      ].join(" ")}
                      style={{ backgroundColor: c }}
                      title={c}
                      aria-label="color"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
