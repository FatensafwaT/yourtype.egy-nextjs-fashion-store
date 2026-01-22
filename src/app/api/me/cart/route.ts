import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/db/jsondb";
import { auth } from "@/auth"; 

type CartItem = {
  productId: string;
  slug?: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  qty: number;
};

type CartDB = Record<string, CartItem[]>;

function normEmail(v: string) {
  return v.toLowerCase().trim();
}

export async function GET() {
  const session = await auth();
  const email = session?.user?.email ? normEmail(session.user.email) : null;

  if (!email) return NextResponse.json({ items: [] as CartItem[] });

  const db = await readJson<CartDB>("cart", {});
  return NextResponse.json({ items: db[email] ?? [] });
}

export async function PUT(req: Request) {
  const session = await auth();
  const email = session?.user?.email ? normEmail(session.user.email) : null;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { items?: CartItem[] };
  const items = Array.isArray(body.items) ? body.items : [];

  const db = await readJson<CartDB>("cart", {});
  db[email] = items;

  await writeJson("cart", db);

  return NextResponse.json({ ok: true });
}
