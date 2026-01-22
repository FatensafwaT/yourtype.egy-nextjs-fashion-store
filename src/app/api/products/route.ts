import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const norm = (v: string) => v.toLowerCase().trim();
const normSize = (v: string) => v.toUpperCase().trim();
const normColor = (v: string) => v.toLowerCase().trim();

function parseJsonArray(s: string): string[] {
  try {
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function toPosInt(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = norm(searchParams.get("q") ?? "");
    const categoryParam = searchParams.get("category") ?? "all";
    const sizeParam = searchParams.get("size") ?? "all";
    const colorParam = searchParams.get("color") ?? "all";
    const sort = searchParams.get("sort") ?? "new";

    const page = toPosInt(searchParams.get("page"), 1);
    const limit = Math.min(toPosInt(searchParams.get("limit"), 12), 60);

    const where: any = {};
    if (q) {
      where.OR = [{ name: { contains: q } }, { category: { contains: q } }];
    }


    let orderBy: any = { createdAt: "desc" };
    if (sort === "low") orderBy = { price: "asc" };
    if (sort === "high") orderBy = { price: "desc" };

    const rows = await prisma.product.findMany({ where, orderBy });

   
    const category = categoryParam !== "all" ? norm(categoryParam) : null;
    const size = sizeParam !== "all" ? normSize(sizeParam) : null;
    const color = colorParam !== "all" ? normColor(colorParam) : null;

    const filtered = rows
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        category: p.category,
        images: parseJsonArray(p.images),
        colors: parseJsonArray(p.colors),
        sizes: parseJsonArray(p.sizes),
      }))
      .filter((p) => {
        if (category && norm(p.category) !== category) return false;
        if (size && !p.sizes.map(normSize).includes(size)) return false;
        if (color && !p.colors.map(normColor).includes(color)) return false;
        return true;
      });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    const start = (safePage - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return NextResponse.json({
      items,
      meta: {
        page: safePage,
        limit,
        total,
        totalPages,
        hasPrev: safePage > 1,
        hasNext: safePage < totalPages,
      },
    });
  } catch (e) {
    console.error("GET /api/products error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
