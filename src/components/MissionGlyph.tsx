import { Bulletlist } from "pixelarticons/react/Bulletlist";
import { ChartBarBig } from "pixelarticons/react/ChartBarBig";
import { Check } from "pixelarticons/react/Check";
import { Close } from "pixelarticons/react/Close";
import { CompassSolid } from "pixelarticons/react/CompassSolid";
import { Copy } from "pixelarticons/react/Copy";
import { Gps2 } from "pixelarticons/react/Gps2";
import { Monitor } from "pixelarticons/react/Monitor";
import { Moon } from "pixelarticons/react/Moon";
import { Pencil } from "pixelarticons/react/Pencil";
import { Play } from "pixelarticons/react/Play";
import { Send } from "pixelarticons/react/Send";
import { Signal } from "pixelarticons/react/Signal";
import { Spinner } from "pixelarticons/react/Spinner";
import { SunSolid } from "pixelarticons/react/SunSolid";
import { Target } from "pixelarticons/react/Target";
import { Trophy } from "pixelarticons/react/Trophy";
import { Users } from "pixelarticons/react/Users";
import type { ComponentType, SVGProps } from "react";

export type MissionGlyphName =
  | "callsign"
  | "award"
  | "cancel"
  | "confirm"
  | "copy"
  | "crew"
  | "daylight"
  | "flight-log"
  | "launch"
  | "loader"
  | "navigator"
  | "night"
  | "orbit"
  | "signal"
  | "stats"
  | "system"
  | "target"
  | "transmit";

interface MissionGlyphProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  name: MissionGlyphName;
}

const GLYPHS: Record<MissionGlyphName, ComponentType<SVGProps<SVGSVGElement>>> = {
  award: Trophy,
  callsign: Pencil,
  cancel: Close,
  confirm: Check,
  copy: Copy,
  crew: Users,
  daylight: SunSolid,
  "flight-log": Bulletlist,
  launch: Play,
  loader: Spinner,
  navigator: CompassSolid,
  night: Moon,
  orbit: Gps2,
  signal: Signal,
  stats: ChartBarBig,
  system: Monitor,
  target: Target,
  transmit: Send,
};

export function MissionGlyph({ name, className = "", ...props }: MissionGlyphProps) {
  const Glyph = GLYPHS[name];

  return (
    <Glyph
      className={`mission-glyph ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}
