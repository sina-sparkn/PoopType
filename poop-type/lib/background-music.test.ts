import test from "node:test";
import assert from "node:assert/strict";
import {
  getToggleAction,
  resolveAutoplayResult,
  resolveInitialMusicPreference,
  shouldUnlockOnGesture,
} from "./background-music";

test("initial music preference defaults to on unless explicitly turned off", () => {
  assert.equal(resolveInitialMusicPreference(null), "on");
  assert.equal(resolveInitialMusicPreference(undefined), "on");
  assert.equal(resolveInitialMusicPreference("on"), "on");
  assert.equal(resolveInitialMusicPreference("off"), "off");
});

test("autoplay result resolves to playing or blocked cleanly", () => {
  assert.equal(resolveAutoplayResult(true), "playing");
  assert.equal(resolveAutoplayResult(false), "blocked");
});

test("gesture unlock only triggers when autoplay was blocked and user kept music on", () => {
  assert.equal(shouldUnlockOnGesture("blocked", "on"), true);
  assert.equal(shouldUnlockOnGesture("blocked", "off"), false);
  assert.equal(shouldUnlockOnGesture("paused", "on"), false);
  assert.equal(shouldUnlockOnGesture("playing", "on"), false);
});

test("toggle button pauses when playing and plays when paused or blocked", () => {
  assert.equal(getToggleAction("playing"), "pause");
  assert.equal(getToggleAction("paused"), "play");
  assert.equal(getToggleAction("blocked"), "play");
});
