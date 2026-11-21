import test from "node:test";
import assert from "node:assert/strict";
import { computeFlipOriginTransform } from "./card-flip-geometry";

test("returns gentle centered fallback when originRect is null or empty", () => {
  assert.deepEqual(
    computeFlipOriginTransform(null, { width: 1440, height: 900 }, 480, 540),
    { x: 0, y: 24, scale: 0.88 }
  );

  assert.deepEqual(
    computeFlipOriginTransform(
      { left: 0, top: 0, width: 0, height: 200 },
      { width: 390, height: 844 },
      358,
      520
    ),
    { x: 0, y: 24, scale: 0.88 }
  );
});

test("computes signed offset relative to viewport center on desktop", () => {
  // Card in top-left quadrant of 1440x900 viewport
  const topLeft = computeFlipOriginTransform(
    { left: 100, top: 100, width: 260, height: 280 },
    { width: 1440, height: 900 },
    480,
    540
  );
  // origin center = (230, 240), viewport center = (720, 450) -> (-490, -210)
  assert.equal(topLeft.x, -490);
  assert.equal(topLeft.y, -210);
  assert.ok(topLeft.scale >= 0.42 && topLeft.scale <= 0.96);

  // Card in bottom-right quadrant
  const bottomRight = computeFlipOriginTransform(
    { left: 1060, top: 520, width: 260, height: 280 },
    { width: 1440, height: 900 },
    480,
    540
  );
  assert.equal(bottomRight.x, 470);
  assert.equal(bottomRight.y, 210);
});

test("clamps scale and extreme offscreen coordinates cleanly on mobile", () => {
  const tinyCard = computeFlipOriginTransform(
    { left: -500, top: 2000, width: 40, height: 40 },
    { width: 390, height: 844 },
    358,
    520
  );
  assert.equal(tinyCard.scale, 0.42);
  assert.equal(tinyCard.x, -Math.round(390 * 0.48));
  assert.equal(tinyCard.y, Math.round(844 * 0.48));

  const giantCard = computeFlipOriginTransform(
    { left: 0, top: 100, width: 600, height: 700 },
    { width: 390, height: 844 },
    358,
    520
  );
  assert.equal(giantCard.scale, 0.96);
});
