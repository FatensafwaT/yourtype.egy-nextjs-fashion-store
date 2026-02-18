import type { CartItem } from "@/store/cart";

function userKey(email: string) {
  return `yourtype_cart_user_v1:${email.toLowerCase()}`;
}

const GUEST_KEY = "yourtype_cart_guest_v1";

function safeParseArray(raw: string | null) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadCart(email: string | null): CartItem[] {
  if (!email) return [];
  const raw = localStorage.getItem(userKey(email));
  return safeParseArray(raw) as CartItem[];
}

export function saveCart(items: CartItem[], email: string | null) {
  if (!email) return;
  localStorage.setItem(userKey(email), JSON.stringify(items ?? []));
}

export function clearCart(email: string | null) {
  if (!email) return;
  localStorage.removeItem(userKey(email));
}

// =====================
// Guest cart helpers
// =====================
export function loadGuestCart(): CartItem[] {
  return safeParseArray(localStorage.getItem(GUEST_KEY)) as CartItem[];
}

export function saveGuestCart(items: CartItem[]) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items ?? []));
}

export function clearGuestCart() {
  localStorage.removeItem(GUEST_KEY);
}

// =====================
// Merge (guest + user)
// =====================
export function mergeCartItems(userItems: CartItem[], guestItems: CartItem[]) {
  const map = new Map<string, CartItem>();

  for (const it of userItems ?? []) map.set(it.id, it);
  for (const it of guestItems ?? []) {
    const existing = map.get(it.id);
    if (existing) {
      map.set(it.id, { ...existing, qty: existing.qty + (it.qty ?? 1) });
    } else {
      map.set(it.id, it);
    }
  }

  return Array.from(map.values());
}
