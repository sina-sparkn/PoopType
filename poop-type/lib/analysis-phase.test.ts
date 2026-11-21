import test from "node:test";
import assert from "node:assert/strict";
import {
  analysisPhaseReducer,
  buildResultHref,
  getAnalyzeButtonState,
  INITIAL_ANALYSIS_PHASE_STATE,
} from "./analysis-phase";
import { PortfolioAnalysisResult } from "./analyze";
import { POOP_TYPES } from "./types-data";

const MOCK_RESULT: PortfolioAnalysisResult = {
  code: "PPTO",
  profile: POOP_TYPES.PPTO,
  bristolType: 2,
  confidence: 94.7,
  toneScore: 31,
  outlineScore: 24,
  sheenScore: 74,
  specimenCount: 2,
  seedHex: "a1b2c3d4e5f6",
  vibeAlert: false,
  vibeReason: null,
  bigFive: POOP_TYPES.PPTO.baseBigFive,
};

test("analysisPhaseReducer transitions idle -> analyzing -> navigating and stores result", () => {
  const started = analysisPhaseReducer(INITIAL_ANALYSIS_PHASE_STATE, {
    type: "START",
  });
  assert.equal(started.phase, "analyzing");
  assert.equal(started.error, null);
  assert.equal(started.lastResult, null);

  // Duplicate START while analyzing is a no-op
  const duplicateStart = analysisPhaseReducer(started, { type: "START" });
  assert.strictEqual(duplicateStart, started);

  const href = buildResultHref(MOCK_RESULT);
  const succeeded = analysisPhaseReducer(started, {
    type: "SUCCEED",
    result: MOCK_RESULT,
    resultHref: href,
  });
  assert.equal(succeeded.phase, "navigating");
  assert.equal(succeeded.lastResult?.code, "PPTO");
  assert.equal(
    succeeded.resultHref,
    "/result/PPTO?b=2&c=94.7&t=31&o=24&s=74&n=2&h=a1b2c3d4e5f6"
  );
});

test("analysisPhaseReducer handles failure and reset cleanly", () => {
  const started = analysisPhaseReducer(INITIAL_ANALYSIS_PHASE_STATE, {
    type: "START",
  });
  const failed = analysisPhaseReducer(started, {
    type: "FAIL",
    error: "Decode failed",
  });
  assert.equal(failed.phase, "error");
  assert.equal(failed.error, "Decode failed");
  assert.equal(failed.lastResult, null);

  const reset = analysisPhaseReducer(failed, { type: "RESET" });
  assert.deepEqual(reset, INITIAL_ANALYSIS_PHASE_STATE);
});

test("getAnalyzeButtonState switches cleanly between idle and disabled-loading", () => {
  const emptyIdle = getAnalyzeButtonState("idle", 0);
  assert.deepEqual(emptyIdle, {
    disabled: true,
    isLoading: false,
    label: "Analyze My Business",
    dataState: "idle",
  });

  const readyIdle = getAnalyzeButtonState("idle", 2);
  assert.deepEqual(readyIdle, {
    disabled: false,
    isLoading: false,
    label: "Analyze My Business",
    dataState: "idle",
  });

  const analyzing = getAnalyzeButtonState("analyzing", 2);
  assert.deepEqual(analyzing, {
    disabled: true,
    isLoading: true,
    label: "Analyzing...",
    dataState: "disabled-loading",
  });

  const navigating = getAnalyzeButtonState("navigating", 2);
  assert.deepEqual(navigating, {
    disabled: true,
    isLoading: true,
    label: "Opening Report...",
    dataState: "disabled-loading",
  });

  const errorRetry = getAnalyzeButtonState("error", 2);
  assert.deepEqual(errorRetry, {
    disabled: false,
    isLoading: false,
    label: "Analyze My Business",
    dataState: "idle",
  });
});
