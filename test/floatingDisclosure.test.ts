import assert from "node:assert/strict";
import test from "node:test";
import { positionFloatingDisclosure } from "../src/lib/floatingDisclosure.ts";

const viewport = { width: 390, height: 844 };

test("keeps a disclosure inside the left and right edges of a mobile viewport", () => {
  const atLeft = positionFloatingDisclosure(
    { top: 100, right: 80, bottom: 150, left: 8, width: 72 },
    { width: 256, height: 100 },
    viewport
  );
  const atRight = positionFloatingDisclosure(
    { top: 100, right: 382, bottom: 150, left: 310, width: 72 },
    { width: 256, height: 100 },
    viewport
  );

  assert.equal(atLeft.left, 12);
  assert.equal(atRight.left + atRight.width, viewport.width - 12);
});

test("flips a disclosure above an anchor near the bottom of the viewport", () => {
  const position = positionFloatingDisclosure(
    { top: 760, right: 240, bottom: 812, left: 140, width: 100 },
    { width: 256, height: 120 },
    viewport
  );

  assert.equal(position.placement, "above");
  assert.equal(position.top, 632);
});

test("clamps a disclosure taller than the available viewport", () => {
  const position = positionFloatingDisclosure(
    { top: 300, right: 240, bottom: 352, left: 140, width: 100 },
    { width: 256, height: 900 },
    viewport
  );

  assert.equal(position.top, 12);
});
