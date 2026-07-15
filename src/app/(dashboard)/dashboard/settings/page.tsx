import { getCurrentUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto container">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-sm font-medium">Profile</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Name</label>
            <p className="text-sm">{user?.name || "Not set"}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <p className="text-sm">{user?.email}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">
              Member since
            </label>
            <p className="text-sm">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
