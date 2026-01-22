"use client";

import { SessionProvider } from "next-auth/react";
import CartWishlistSync from "./CartWishlistSync";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartWishlistSync />
      {children}
    </SessionProvider>
  );
}
