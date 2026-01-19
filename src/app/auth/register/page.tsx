"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";
import Link from "next/link";

export default function RegisterPage() {
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

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    setSuccess(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    console.log("REGISTER RESPONSE:", data);

    if (!res.ok) {
      // ✅ لو السيرفر رجّع تفاصيل zod
      if (Array.isArray(data?.issues)) {
        data.issues.forEach((issue: { field: string; message: string }) => {
          if (!issue.field) return;
          setError(issue.field as keyof RegisterInput, {
            type: "server",
            message: issue.message,
          });
        });
        return;
      }

      setServerError(data?.error ?? "Something went wrong");
      return;
    }

    setSuccess("Account created successfully 🎉");
  }

  return (
    <div className="mx-auto max-w-md space-y-5 rounded-3xl border bg-white p-6 shadow-sm text-gray-500">
      <h1 className="text-2xl font-semibold">Create account</h1>

      {serverError && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      {success && (
        <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
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
        {(success || serverError === "Email already registered") && (
          <div
            className={`rounded-2xl p-4 text-sm space-y-3 ${
              success
                ? "bg-green-50 text-green-700"
                : "bg-yellow-50 text-yellow-700"
            }`}
          >
            <p>
              {success
                ? "Account created successfully 🎉"
                : "This email is already registered."}
            </p>

            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-full bg-pink-500 px-5 py-2 text-white hover:bg-pink-600"
            >
              Go to Login
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}
