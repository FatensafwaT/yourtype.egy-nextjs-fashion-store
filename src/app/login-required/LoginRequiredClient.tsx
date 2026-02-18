"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginRequiredClient() {
  const sp = useSearchParams();
  const next = sp.get("next") || "/checkout";

  const loginHref = `/auth/login?callbackUrl=${encodeURIComponent(
    next,
  )}&reason=login_required`;

  const registerHref = `/auth/register?callbackUrl=${encodeURIComponent(
    next,
  )}&reason=login_required`;

  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-10 text-center shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-500">
        You must login first
      </h1>

      <div className="mt-6 space-y-3">
        <Link
          href={loginHref}
          className="block w-full rounded-full bg-pink-400 py-3 text-white"
        >
          Login
        </Link>

        <Link
          href={registerHref}
          className="block w-full rounded-full border py-3 text-gray-500 hover:bg-pink-50"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
