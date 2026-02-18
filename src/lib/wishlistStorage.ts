import type { WishItem } from "@/store/wishlist";

function userKey(email: string) {
  return `yourtype_wishlist_user_v1:${email.toLowerCase()}`;
}

const GUEST_KEY = "yourtype_wishlist_guest_v1";

function safeParseArray(raw: string | null) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadWishlist(email: string | null): WishItem[] {
  if (!email) return [];
  return safeParseArray(localStorage.getItem(userKey(email))) as WishItem[];
}

export function saveWishlist(items: WishItem[], email: string | null) {
  if (!email) return;
  localStorage.setItem(userKey(email), JSON.stringify(items ?? []));
}

export function loadGuestWishlist(): WishItem[] {
  return safeParseArray(localStorage.getItem(GUEST_KEY)) as WishItem[];
}

export function saveGuestWishlist(items: WishItem[]) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items ?? []));
}

export function clearGuestWishlist() {
  localStorage.removeItem(GUEST_KEY);
}

export function mergeWishlistItems(
  userItems: WishItem[],
  guestItems: WishItem[],
) {
  const map = new Map<string, WishItem>();
  for (const it of userItems ?? []) map.set(it.id, it);
  for (const it of guestItems ?? []) map.set(it.id, it); 
  return Array.from(map.values());
}
