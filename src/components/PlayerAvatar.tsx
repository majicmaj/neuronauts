import { AVATAR_SHEETS, avatarDefinition, avatarName } from "@/lib/avatars";
import type { AvatarId } from "@/lib/avatars";
import type { CSSProperties } from "react";

interface PlayerAvatarProps {
  avatarId: AvatarId;
  className?: string;
  decorative?: boolean;
}

export function PlayerAvatar({
  avatarId,
  className = "",
  decorative = false,
}: PlayerAvatarProps) {
  const avatar = avatarDefinition(avatarId);
  const sheet = AVATAR_SHEETS[avatar.sheet];
  const position = (value: number, slots: number) =>
    slots === 1 ? "0%" : `${(value / (slots - 1)) * 100}%`;
  const style = {
    backgroundImage: `url(${sheet.source})`,
    backgroundPosition: `${position(avatar.column, sheet.columns)} ${position(avatar.row, sheet.rows)}`,
    backgroundSize: `${sheet.columns * 100}% ${sheet.rows * 100}%`,
  } as CSSProperties;

  return (
    <span
      className={`player-avatar ${className}`}
      style={style}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : avatarName(avatarId)}
    />
  );
}
