import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/verify-email?error=missing-token", req.url)
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/verify-email?error=invalid-token", req.url)
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    return NextResponse.redirect(
      new URL("/verify-email?success=true", req.url)
    );
  } catch {
    return NextResponse.redirect(
      new URL("/verify-email?error=server-error", req.url)
    );
  }
}
