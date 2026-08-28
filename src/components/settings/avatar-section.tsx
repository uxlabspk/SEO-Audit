"use client";

import { useState } from "react";
import { AvatarUpload } from "@/components/settings/avatar-upload";

interface AvatarSectionProps {
  avatar: string | null;
  name: string | null;
  email: string;
}

export function AvatarSection({ avatar, name, email }: AvatarSectionProps) {
  const [currentAvatar, setCurrentAvatar] = useState(avatar);

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-sm font-medium">Avatar</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Your profile photo. Click upload to change it.
      </p>
      <div className="mt-4">
        <AvatarUpload
          avatar={currentAvatar}
          name={name}
          email={email}
          onUpdated={setCurrentAvatar}
        />
      </div>
    </div>
  );
}
