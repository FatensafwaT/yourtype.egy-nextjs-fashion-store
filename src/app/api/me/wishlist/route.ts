import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/db/jsondb";
import { auth } from "@/auth"; 

type WishlistItem = {
  productId: string;
  slug?: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
};

type WishlistDB = Record<string, WishlistItem[]>; 

function normEmail(v: string) {
  return v.toLowerCase().trim();
}

function dedupe(items: WishlistItem[]) {
  const map = new Map<string, WishlistItem>();
  for (const it of items) {
    const key = `${it.productId}_${(it.color ?? "").toLowerCase()}_${(
      it.size ?? ""
    ).toUpperCase()}`;
    map.set(key, it);
  }
  return Array.from(map.values());
}

export async function GET() {
  const session = await auth();
  const email = session?.user?.email ? normEmail(session.user.email) : null;

  if (!email) return NextResponse.json({ items: [] as WishlistItem[] });

  const db = await readJson<WishlistDB>("wishlist", {});
  return NextResponse.json({ items: db[email] ?? [] });
}

export async function PUT(req: Request) {
  const session = await auth();
  const email = session?.user?.email ? normEmail(session.user.email) : null;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { items?: WishlistItem[] };
  const items = dedupe(Array.isArray(body.items) ? body.items : []);

  const db = await readJson<WishlistDB>("wishlist", {});
  db[email] = items;

  await writeJson("wishlist", db);

  return NextResponse.json({ ok: true });
}
