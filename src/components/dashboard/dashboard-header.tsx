"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, AlertTriangle } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    name: string | null;
    email: string;
  };
  emailVerified: boolean;
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email[0].toUpperCase();
}

export function DashboardHeader({ user, emailVerified }: DashboardHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center justify-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono text-sm font-bold">
          P
        </div>
        <span className="text-lg font-semibold tracking-tight">Probe</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        {!emailVerified && (
          <Link href="/verify-email">
            <Badge variant="warning" className="gap-1 cursor-pointer">
              <AlertTriangle className="size-3" />
              Verify email
            </Badge>
          </Link>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-xs font-bold cursor-pointer outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              {getInitials(user.name, user.email)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">Hi, {user.name || "User"}</p>
            </div>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
