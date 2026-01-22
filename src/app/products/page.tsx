import { headers } from "next/headers";
import MotionPage from "@/components/MotionPage";
import ProductCard from "@/components/ProductCard";
import ProductsFiltersBar from "@/components/ProductsFiltersBar";
import Link from "next/link";

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

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

function toPosInt(v: unknown, fallback: number) {
  const n = typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function buildHrefWithPage(
  sp: Record<string, string | string[] | undefined>,
  page: number,
) {
  const qs = new URLSearchParams();

  for (const [k, v] of Object.entries(sp)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      for (const vv of v) qs.append(k, vv);
    } else if (typeof v === "string" && v.trim()) {
      qs.set(k, v);
    }
  }

  qs.set("page", String(page));

  if (!qs.get("limit")) qs.set("limit", "12");

  return `/products?${qs.toString()}`;
}

async function getProducts(sp: Record<string, string | string[] | undefined>) {
  const qs = new URLSearchParams();


  for (const [k, v] of Object.entries(sp)) {
    if (v == null) continue;

    if (Array.isArray(v)) {
      for (const vv of v) {
        if (typeof vv === "string" && vv.trim()) qs.append(k, vv);
      }
    } else if (typeof v === "string" && v.trim()) {
      qs.set(k, v);
    }
  }


  if (!qs.get("page")) qs.set("page", "1");
  if (!qs.get("limit")) qs.set("limit", "12");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (!host) return { items: [] as Product[], meta: null as unknown as Meta };

  const base = `${proto}://${host}`;
  const url = `${base}/api/products?${qs.toString()}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return { items: [] as Product[], meta: null as unknown as Meta };

  return (await res.json()) as { items: Product[]; meta: Meta };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  
  const currentPage = toPosInt(sp.page, 1);
  const limit = toPosInt(sp.limit, 12);

  const { items, meta } = await getProducts(sp);


  const safeMeta: Meta =
    meta ??
    ({
      page: currentPage,
      limit,
      total: items.length,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
    } as Meta);


  const allColors = Array.from(new Set(items.flatMap((p) => p.colors)));

  return (
    <MotionPage>
      <div className="space-y-6">
        <ProductsFiltersBar allColors={allColors} />

        {items.length === 0 ? (
          <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-medium">No results found</p>
            <p className="mt-2 text-sm text-gray-600">
              Try searching again or clear filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href={buildHrefWithPage(sp, Math.max(1, safeMeta.page - 1))}
                aria-disabled={!safeMeta.hasPrev}
                className={`rounded-full border px-4 py-2 text-sm ${
                  safeMeta.hasPrev
                    ? "hover:bg-gray-50"
                    : "pointer-events-none opacity-50"
                }`}
              >
                Prev
              </Link>

              <div className="text-sm text-gray-500">
                Page{" "}
                <span className="font-medium text-gray-700">
                  {safeMeta.page}
                </span>{" "}
                /{" "}
                <span className="font-medium text-gray-700">
                  {safeMeta.totalPages}
                </span>
              </div>

              <Link
                href={buildHrefWithPage(
                  sp,
                  Math.min(safeMeta.totalPages, safeMeta.page + 1),
                )}
                aria-disabled={!safeMeta.hasNext}
                className={`rounded-full border px-4 py-2 text-sm ${
                  safeMeta.hasNext
                    ? "hover:bg-gray-50"
                    : "pointer-events-none opacity-50"
                }`}
              >
                Next
              </Link>
            </div>
          </>
        )}
      </div>
    </MotionPage>
  );
}
