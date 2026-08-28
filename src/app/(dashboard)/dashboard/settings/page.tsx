import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/settings/profile-form";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { AccountStats } from "@/components/settings/account-stats";
import { DangerZone } from "@/components/settings/danger-zone";
import { AvatarSection } from "@/components/settings/avatar-section";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto container">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <div className="space-y-6">
        <AccountStats userId={user.id} emailVerified={user.emailVerified} />
        <AvatarSection
          avatar={user.avatar}
          name={user.name}
          email={user.email}
        />
        <ProfileForm name={user.name} email={user.email} />
        <ChangePasswordForm />
        <DangerZone />
      </div>
    </div>
  );
}
