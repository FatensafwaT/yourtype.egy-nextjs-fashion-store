"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MotionPage from "@/components/MotionPage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <MotionPage>
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm text-gray-500">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-gray-600">Welcome back 💖</p>

        <div className="mt-5 space-y-3">
          <input
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-200"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-200"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <p className="text-sm text-red-500">{err}</p>}

          <button
            disabled={loading}
            onClick={async () => {
              setErr(null);
              setLoading(true);
              const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
              });
              setLoading(false);
              if (res?.error) setErr("Invalid email or password");
              else router.push("/account");
            }}
            className="w-full rounded-full bg-pink-400 py-3 font-medium text-white hover:bg-pink-500 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <a
            href="/auth/register"
            className="block text-center text-sm text-pink-500 hover:underline"
          >
            Create an account
          </a>
        </div>
      </div>
    </MotionPage>
  );
}
