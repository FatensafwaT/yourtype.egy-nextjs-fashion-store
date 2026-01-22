"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  async function onSubmit(values: RegisterInput) {
   
    console.log(values);
  }

  return (
    <div className="mx-auto max-w-md space-y-5 rounded-3xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Create account</h1>

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
      </form>
    </div>
  );
}
