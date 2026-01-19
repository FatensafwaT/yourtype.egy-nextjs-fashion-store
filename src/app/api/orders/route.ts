import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addOrder, getOrdersByEmail, Order } from "@/lib/orders";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getOrdersByEmail(email);
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // minimal validation
  if (
    !body?.address ||
    !Array.isArray(body?.items) ||
    body.items.length === 0
  ) {
    return NextResponse.json(
      { error: "Invalid order payload" },
      { status: 400 },
    );
  }

  const orderId = `YT-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;

  const totalItems = body.items.reduce(
    (s: number, x: any) => s + (x.qty ?? 0),
    0,
  );
  const totalPrice = body.items.reduce(
    (s: number, x: any) => s + (x.price ?? 0) * (x.qty ?? 0),
    0,
  );

  const order: Order = {
    id: orderId,
    userEmail: email,
    placedAt: new Date().toISOString(),
    totalItems,
    totalPrice,
    address: body.address,
    items: body.items,
  };

  await addOrder(order);

  return NextResponse.json({ ok: true, orderId }, { status: 201 });
}
