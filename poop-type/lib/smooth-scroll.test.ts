import test from "node:test";
import assert from "node:assert/strict";
import {
  computeScrollDuration,
  computeScrollTargetY,
} from "./smooth-scroll";

test("computeScrollTargetY accounts for sticky header offset and clamps to bounds", () => {
  assert.equal(
    computeScrollTargetY({
      elementTop: 600,
      currentScrollY: 100,
      headerOffset: 88,
      maxScrollY: 2000,
    }),
    612
  );

  // Never scrolls above 0
  assert.equal(
    computeScrollTargetY({
      elementTop: 20,
      currentScrollY: 0,
      headerOffset: 88,
      maxScrollY: 2000,
    }),
    0
  );

  // Never scrolls past maxScrollY
  assert.equal(
    computeScrollTargetY({
      elementTop: 2400,
      currentScrollY: 200,
      headerOffset: 88,
      maxScrollY: 1500,
    }),
    1500
  );
});

test("computeScrollDuration scales smoothly with distance and respects reduced motion", () => {
  assert.equal(computeScrollDuration(800, true), 0);
  assert.equal(computeScrollDuration(2, false), 0);

  const shortJump = computeScrollDuration(200, false);
  const mediumJump = computeScrollDuration(1000, false);
  const longJump = computeScrollDuration(4000, false);

  assert.ok(shortJump >= 0.38 && shortJump < mediumJump);
  assert.ok(mediumJump < longJump);
  assert.ok(longJump <= 0.85);
});
