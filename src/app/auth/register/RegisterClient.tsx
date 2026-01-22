"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const callbackUrl = sp.get("callbackUrl") || "/account";
  const reason = sp.get("reason");

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const loginHref = `/auth/login?callbackUrl=${encodeURIComponent(
    callbackUrl,
  )}&reason=${encodeURIComponent(reason ?? "")}`;

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    setSuccess(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (Array.isArray((data as any)?.issues)) {
        (data as any).issues.forEach(
          (issue: { field: string; message: string }) => {
            if (!issue.field) return;
            setError(issue.field as keyof RegisterInput, {
              type: "server",
              message: issue.message,
            });
          },
        );
        return;
      }

      setServerError((data as any)?.error ?? "Something went wrong");
      return;
    }

    setSuccess("Account created successfully 🎉");


    setTimeout(() => {
      router.push(loginHref);
    }, 600);
  }

  return (
    <div className="mx-auto max-w-md space-y-5 rounded-3xl border bg-white p-6 shadow-sm text-gray-500">
      <h1 className="text-2xl font-semibold">Create account</h1>

      {reason === "login_required" && (
        <div className="rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm text-gray-700">
          🔒 Create an account to continue checkout.
        </div>
      )}

      {serverError && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      {success && (
        <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {success} — Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            {...register("name")}
            className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-pink-300"
            placeholder="Faten Safwat"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            {...register("email")}
            className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-pink-300"
            placeholder="name@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password")}
            className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-pink-300"
            placeholder="********"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}

          <p className="mt-2 text-xs text-gray-500">
            Must be 8+ chars and include uppercase, lowercase, number, and
            special character.
          </p>
        </div>

        <button
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-pink-500 px-4 py-3 text-sm font-medium text-white hover:bg-pink-600 disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create account"}
        </button>

        {serverError === "Email already registered" && (
          <div className="space-y-3 rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-700">
            <p>This email is already registered.</p>
            <Link
              href={loginHref}
              className="inline-flex items-center justify-center rounded-full bg-pink-500 px-5 py-2 text-white hover:bg-pink-600"
            >
              Go to Login
            </Link>
          </div>
        )}

        <Link
          href={loginHref}
          className="block text-center text-sm text-pink-500 hover:underline"
        >
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}
