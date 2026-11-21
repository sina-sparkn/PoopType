import test from "node:test";
import assert from "node:assert/strict";
import {
  applyScrollPosition,
  computeThreeScrollThresholdPx,
  createInitialBackToTopState,
  recordDownwardGesture,
} from "./back-to-top";

test("back-to-top stays hidden at top and after 1 or 2 downward scrolls", () => {
  let state = createInitialBackToTopState();
  assert.equal(state.visible, false);

  // 1st scroll gesture
  state = recordDownwardGesture(state, {
    nowMs: 1000,
    scrollY: 180,
    viewportHeight: 900,
    maxScrollY: 2600,
  });
  assert.equal(state.downwardGestures, 1);
  assert.equal(state.visible, false);

  // Rapid wheel sub-event within cooldown should NOT count as 2nd gesture
  state = recordDownwardGesture(state, {
    nowMs: 1050,
    scrollY: 220,
    viewportHeight: 900,
    maxScrollY: 2600,
  });
  assert.equal(state.downwardGestures, 1);
  assert.equal(state.visible, false);

  // 2nd distinct scroll gesture
  state = recordDownwardGesture(state, {
    nowMs: 1300,
    scrollY: 400,
    viewportHeight: 900,
    maxScrollY: 2600,
  });
  assert.equal(state.downwardGestures, 2);
  assert.equal(state.visible, false);

  // 3rd distinct scroll gesture triggers visibility
  state = recordDownwardGesture(state, {
    nowMs: 1600,
    scrollY: 560,
    viewportHeight: 900,
    maxScrollY: 2600,
  });
  assert.equal(state.downwardGestures, 3);
  assert.equal(state.visible, true);
});

test("back-to-top appears on continuous drag/programmatic scroll past three scroll units", () => {
  let state = createInitialBackToTopState();

  state = applyScrollPosition(state, {
    scrollY: 240,
    viewportHeight: 900,
    maxScrollY: 2600,
  });
  assert.equal(state.visible, false);

  state = applyScrollPosition(state, {
    scrollY: 500,
    viewportHeight: 900,
    maxScrollY: 2600,
  });
  assert.equal(state.visible, false);

  state = applyScrollPosition(state, {
    scrollY: 720,
    viewportHeight: 900,
    maxScrollY: 2600,
  });
  assert.equal(state.visible, true);
});

test("back-to-top hides and resets count when returning near top", () => {
  let state = createInitialBackToTopState();
  state = recordDownwardGesture(state, {
    nowMs: 100,
    scrollY: 160,
    viewportHeight: 900,
    maxScrollY: 2400,
  });
  state = recordDownwardGesture(state, {
    nowMs: 400,
    scrollY: 320,
    viewportHeight: 900,
    maxScrollY: 2400,
  });
  state = recordDownwardGesture(state, {
    nowMs: 700,
    scrollY: 480,
    viewportHeight: 900,
    maxScrollY: 2400,
  });
  assert.equal(state.visible, true);

  // Scroll back to top
  state = applyScrollPosition(state, {
    scrollY: 0,
    viewportHeight: 900,
    maxScrollY: 2400,
  });
  assert.equal(state.visible, false);
  assert.equal(state.downwardGestures, 0);

  // One new scroll should NOT immediately re-show it
  state = recordDownwardGesture(state, {
    nowMs: 1200,
    scrollY: 160,
    viewportHeight: 900,
    maxScrollY: 2400,
  });
  assert.equal(state.visible, false);
});

test("threshold scales safely for shorter pages and never shows on unscrollable pages", () => {
  assert.equal(computeThreeScrollThresholdPx(900, 0), Number.POSITIVE_INFINITY);
  assert.equal(computeThreeScrollThresholdPx(900, 60), Number.POSITIVE_INFINITY);

  // Medium page (like /types desktop)
  assert.equal(computeThreeScrollThresholdPx(900, 1200), 720);

  // Shorter page still has a reachable threshold
  const shortThreshold = computeThreeScrollThresholdPx(900, 600);
  assert.ok(shortThreshold > 200 && shortThreshold < 600);
});
