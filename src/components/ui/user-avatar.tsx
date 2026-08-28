import Image from "next/image";

interface UserAvatarProps {
  avatar: string | null;
  name: string | null;
  email: string;
  size?: number;
  className?: string;
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

export function UserAvatar({
  avatar,
  name,
  email,
  size = 32,
  className = "",
}: UserAvatarProps) {
  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name || email}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        unoptimized
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-xs font-bold ${className}`}
      style={{ width: size, height: size }}
    >
      {getInitials(name, email)}
    </div>
  );
}
