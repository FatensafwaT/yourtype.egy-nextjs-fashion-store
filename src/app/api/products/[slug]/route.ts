import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseJsonArray(s: string): string[] {
  try {
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const p = await prisma.product.findUnique({ where: { slug } });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    category: p.category,
    images: parseJsonArray(p.images),
    colors: parseJsonArray(p.colors),
    sizes: parseJsonArray(p.sizes),
  });
}
