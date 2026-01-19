import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { addUser, userExists } from "@/lib/users";
import { registerSchema } from "@/lib/validation/auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validation (email formula + password rules + name length...)
    const { name, email, password } = registerSchema.parse(body);

    const normalizedEmail = email.toLowerCase().trim();

    if (await userExists(normalizedEmail)) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await addUser({
      id: crypto.randomUUID(), // ✅ بدل Math.random()
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    // ✅ Zod validation errors
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          issues: err.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }

    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
