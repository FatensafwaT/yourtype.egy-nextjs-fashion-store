import type { CartItem } from "@/store/cart";

function keyFor(email: string) {
  return `yourtype_cart_user_v1:${email.toLowerCase()}`;
}

export function loadCart(email: string | null) {
  if (!email) return [];
  try {
    const raw = localStorage.getItem(keyFor(email));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[], email: string | null) {
  if (!email) return;
  try {
    localStorage.setItem(keyFor(email), JSON.stringify(items ?? []));
  } catch {}
}

export function clearCart(email: string | null) {
  if (!email) return;
  try {
    localStorage.removeItem(keyFor(email));
  } catch {}
}
