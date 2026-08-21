export interface FloatingRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
}

export interface FloatingSize {
  width: number;
  height: number;
}

export interface FloatingPosition {
  left: number;
  top: number;
  width: number;
  placement: "above" | "below";
}

const VIEWPORT_MARGIN = 12;
const ANCHOR_GAP = 8;
const MAX_TOOLTIP_WIDTH = 256;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function positionFloatingDisclosure(
  anchor: FloatingRect,
  tooltip: FloatingSize,
  viewport: FloatingSize
): FloatingPosition {
  const availableWidth = Math.max(0, viewport.width - VIEWPORT_MARGIN * 2);
  const width = Math.min(MAX_TOOLTIP_WIDTH, availableWidth);
  const maximumLeft = Math.max(VIEWPORT_MARGIN, viewport.width - width - VIEWPORT_MARGIN);
  const left = clamp(
    anchor.left + anchor.width / 2 - width / 2,
    VIEWPORT_MARGIN,
    maximumLeft
  );
  const spaceAbove = anchor.top - VIEWPORT_MARGIN - ANCHOR_GAP;
  const spaceBelow = viewport.height - anchor.bottom - VIEWPORT_MARGIN - ANCHOR_GAP;
  const placement = tooltip.height <= spaceBelow || spaceBelow >= spaceAbove
    ? "below"
    : "above";
  const desiredTop = placement === "below"
    ? anchor.bottom + ANCHOR_GAP
    : anchor.top - tooltip.height - ANCHOR_GAP;
  const maximumTop = Math.max(
    VIEWPORT_MARGIN,
    viewport.height - tooltip.height - VIEWPORT_MARGIN
  );

  return {
    left: Math.round(left),
    top: Math.round(clamp(desiredTop, VIEWPORT_MARGIN, maximumTop)),
    width: Math.round(width),
    placement,
  };
}
