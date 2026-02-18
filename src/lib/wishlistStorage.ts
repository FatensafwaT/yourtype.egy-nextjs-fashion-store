import type { WishItem } from "@/store/wishlist";

function keyFor(email: string) {
  return `yourtype_wishlist_user_v1:${email.toLowerCase()}`;
}

export function loadWishlist(email: string | null) {
  if (!email) return [];
  try {
    const raw = localStorage.getItem(keyFor(email));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WishItem[]) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(items: WishItem[], email: string | null) {
  if (!email) return;
  try {
    localStorage.setItem(keyFor(email), JSON.stringify(items ?? []));
  } catch {}
}
