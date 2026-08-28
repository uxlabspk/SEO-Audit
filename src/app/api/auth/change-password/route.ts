import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, verifyPassword, hashPassword } from "@/lib/auth";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = changePasswordSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { password: true },
  });

  if (!user?.password) {
    return NextResponse.json(
      { error: "No password set. Use a password reset link." },
      { status: 400 }
    );
  }

  const valid = await verifyPassword(result.data.currentPassword, user.password);
  if (!valid) {
    return NextResponse.json(
      { error: { currentPassword: "Incorrect password" } },
      { status: 400 }
    );
  }

  const hashed = await hashPassword(result.data.newPassword);
  await prisma.user.update({
    where: { id: session.userId },
    data: { password: hashed },
  });

  return NextResponse.json({ success: true });
}
