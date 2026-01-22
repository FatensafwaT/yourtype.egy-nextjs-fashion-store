// src/app/login-required/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MotionPage from "@/components/MotionPage";

export default function LoginRequiredPage() {
  const sp = useSearchParams();
  const next = sp.get("next") || "/checkout"; 

  const loginHref = `/auth/login?callbackUrl=${encodeURIComponent(next)}&reason=login_required`;
  const registerHref = `/auth/register?callbackUrl=${encodeURIComponent(
    next,
  )}&reason=login_required`;

  return (
    <MotionPage>
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-2xl">
          🔒
        </div>

        <h1 className="mt-4 text-2xl font-semibold text-gray-800">
          You must login first
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Please login (or create an account) to continue checkout.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href={loginHref}
            className="block w-full rounded-full bg-pink-400 py-3 text-sm font-medium text-white hover:bg-pink-500"
          >
            Login
          </Link>

          <Link
            href={registerHref}
            className="block w-full rounded-full border bg-white py-3 text-sm font-medium text-gray-700 hover:bg-pink-50"
          >
            Create account
          </Link>
        </div>

        <Link
          href="/products"
          className="mt-5 block text-sm text-pink-500 hover:underline"
        >
          Back to shopping
        </Link>
      </div>
    </MotionPage>
  );
}
