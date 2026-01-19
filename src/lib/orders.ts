import { readJson, writeJson } from "@/lib/db/jsondb";

export type OrderItem = {
  name: string;
  price: number;
  qty: number;
  color: string;
  size: string;
  image: string;
};

export type Order = {
  id: string;
  userEmail: string;
  placedAt: string;
  totalItems: number;
  totalPrice: number;
  address: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
  };
  items: OrderItem[];
};

export async function getAllOrders() {
  return readJson<Order[]>("orders", []);
}

export async function getOrdersByEmail(email: string) {
  const orders = await getAllOrders();
  return orders.filter((o) => o.userEmail === email);
}

export async function addOrder(order: Order) {
  const orders = await getAllOrders();
  orders.unshift(order);
  await writeJson("orders", orders);
  return order;
}
