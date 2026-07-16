import Link from "next/link";
import { AuthSidebar } from "@/components/auth/auth-sidebar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AuthSidebar />

      {/* Right panel - form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono text-sm font-bold">
                P
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Probe
              </span>
            </Link>
          </div>
          {children}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
