import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const avatarSchema = z.object({
  avatar: z.string().min(1, "Avatar data is required"),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { avatar?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = avatarSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Avatar data is required" }, { status: 400 });
  }

  const dataUrl = result.data.avatar;

  // Validate data URL format
  const match = dataUrl.match(/^data:(image\/[a-z-]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
  }

  const [, mimeType, base64Data] = match;
  if (!ALLOWED.includes(mimeType)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and GIF are allowed" },
      { status: 400 }
    );
  }

  // Check size (base64 is ~33% larger than raw)
  const sizeBytes = Math.round((base64Data.length * 3) / 4);
  if (sizeBytes > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image must be under 2MB" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { avatar: dataUrl },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { avatar: null },
  });

  return NextResponse.json({ success: true });
}
