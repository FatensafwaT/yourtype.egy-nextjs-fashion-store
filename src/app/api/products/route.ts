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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = norm(searchParams.get("q") ?? "");
  const categoryParam = searchParams.get("category") ?? "all";
  const sizeParam = searchParams.get("size") ?? "all";
  const colorParam = searchParams.get("color") ?? "all";
  const sort = searchParams.get("sort") ?? "new";

  
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

  const list = rows
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

  return NextResponse.json(list);
}
