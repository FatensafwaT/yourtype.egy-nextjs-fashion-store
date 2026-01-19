"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import MotionPage from "@/components/MotionPage";

export default function AccountPage() {
  const { data, status } = useSession();

  if (status === "loading") {
    return (
      <MotionPage>
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-gray-600">Loading account...</p>
        </div>
      </MotionPage>
    );
  }

  const user = data?.user;

  return (
    <MotionPage>
      <div className="rounded-3xl border bg-white p-8 shadow-sm space-y-5 text-gray-500">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">My Account</h1>
            <p className="mt-1 text-gray-600">
              {user?.name ?? "User"} • {user?.email ?? "No email"}
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-full border bg-white px-4 py-2 text-sm hover:bg-pink-50"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/account/orders"
            className="rounded-full bg-pink-400 px-6 py-3 text-center text-sm font-medium text-white hover:bg-pink-500"
          >
            View orders
          </Link>

          <Link
            href="/products"
            className="rounded-full border bg-white px-6 py-3 text-center text-sm font-medium hover:bg-pink-50"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </MotionPage>
  );
}
