import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, deleteSession } from "@/lib/auth";

export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete user's analyses first (foreign key constraint)
  await prisma.analysis.deleteMany({
    where: { userId: session.userId },
  });

  await prisma.user.delete({
    where: { id: session.userId },
  });

  await deleteSession();

  return NextResponse.json({ success: true });
}
