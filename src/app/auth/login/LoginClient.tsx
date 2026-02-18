"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const callbackUrl = sp.get("callbackUrl") || "/account";
  const reason = sp.get("reason");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm text-gray-500">
      <h1 className="text-2xl font-semibold text-gray-500">Login</h1>

      {reason === "login_required" && (
        <div className="mt-4 text-sm">
          🔒 You must login first to continue checkout.
        </div>
      )}

      <div className="mt-5 space-y-3 text-gray-300" >
        <input
          className="w-full rounded-2xl border px-4 py-3 text-gray-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full rounded-2xl border px-4 py-3 text-gray-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && <p className="text-red-500">{err}</p>}

        <button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setErr(null);

            const res = await signIn("credentials", {
              email,
              password,
              redirect: false,
              callbackUrl,
            });

            setLoading(false);

            if (res?.error) {
              setErr("Invalid email or password");
              return;
            }

            router.replace(callbackUrl);
          }}
          className="w-full rounded-full bg-pink-400 py-3 text-white"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <Link
          href={`/auth/register?callbackUrl=${encodeURIComponent(
            callbackUrl,
          )}&reason=${encodeURIComponent(reason ?? "")}`}
          className="block text-center text-sm text-pink-500"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
