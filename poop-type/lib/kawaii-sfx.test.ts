import test from "node:test";
import assert from "node:assert/strict";
import {
  applySubtleJitter,
  DEFAULT_SFX_COOLDOWN_MS,
  getTileFlipFrequency,
  MAX_SUBTLE_GAIN,
  SFX_RECIPES,
  shouldPlaySfx,
  TILE_FLIP_FREQUENCIES,
  type KawaiiSfxName,
} from "./kawaii-sfx";

test("all kawaii SFX recipes stay subtle (soft waveforms and gentle peak gain)", () => {
  const names = Object.keys(SFX_RECIPES) as KawaiiSfxName[];
  assert.ok(names.length >= 10, "expected full curated kawaii SFX palette");

  for (const name of names) {
    const recipe = SFX_RECIPES[name];
    assert.ok(recipe.notes.length >= 1, `${name} must define at least one note`);
    for (const note of recipe.notes) {
      assert.ok(
        note.type === "sine" || note.type === "triangle",
        `${name} should only use soft sine/triangle waveforms`
      );
      assert.ok(
        note.gain > 0 && note.gain <= MAX_SUBTLE_GAIN,
        `${name} gain (${note.gain}) must stay subtle (<= ${MAX_SUBTLE_GAIN})`
      );
      assert.ok(note.startHz > 150 && note.startHz < 2500);
      assert.ok(note.durationSec > 0 && note.durationSec <= 0.3);
    }
  }
});

test("tile flip frequencies climb cleanly up a cheerful pentatonic scale", () => {
  const f0 = getTileFlipFrequency(0);
  const f1 = getTileFlipFrequency(1);
  const f2 = getTileFlipFrequency(2);
  const f3 = getTileFlipFrequency(3);

  assert.ok(f0 < f1 && f1 < f2 && f2 < f3);
  assert.equal(getTileFlipFrequency(-5), TILE_FLIP_FREQUENCIES[0]);
  assert.equal(
    getTileFlipFrequency(99),
    TILE_FLIP_FREQUENCIES[TILE_FLIP_FREQUENCIES.length - 1]
  );
});

test("cooldown guard prevents rapid duplicate SFX bursts", () => {
  assert.equal(shouldPlaySfx(undefined, 1000), true);
  assert.equal(shouldPlaySfx(1000, 1020, DEFAULT_SFX_COOLDOWN_MS), false);
  assert.equal(shouldPlaySfx(1000, 1044, DEFAULT_SFX_COOLDOWN_MS), false);
  assert.equal(shouldPlaySfx(1000, 1045, DEFAULT_SFX_COOLDOWN_MS), true);
  assert.equal(shouldPlaySfx(1000, 1120, DEFAULT_SFX_COOLDOWN_MS), true);
});

test("organic pitch jitter stays within subtle +-2.5% bounds", () => {
  const base = 500;
  assert.equal(applySubtleJitter(base, 0.5), 500);
  assert.equal(applySubtleJitter(base, 0), 487.5);
  assert.equal(applySubtleJitter(base, 1), 512.5);
  // Clamps out-of-range random inputs safely
  assert.equal(applySubtleJitter(base, -1), 487.5);
  assert.equal(applySubtleJitter(base, 2), 512.5);
});
