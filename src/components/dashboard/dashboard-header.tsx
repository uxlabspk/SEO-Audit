"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, AlertTriangle } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    name: string | null;
    email: string;
  };
  emailVerified: boolean;
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
      <div className={'flex items-center justify-center gap-2'}>
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
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <User className="size-4" />
          {user.name || user.email}
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
}
