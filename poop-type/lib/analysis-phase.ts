import { encodeResultParams, PortfolioAnalysisResult } from "./analyze";

export type AnalysisPhase = "idle" | "analyzing" | "navigating" | "error";

export interface AnalysisPhaseState {
  phase: AnalysisPhase;
  error: string | null;
  lastResult: PortfolioAnalysisResult | null;
  resultHref: string | null;
}

export type AnalysisPhaseAction =
  | { type: "START" }
  | {
      type: "SUCCEED";
      result: PortfolioAnalysisResult;
      resultHref: string;
    }
  | { type: "FAIL"; error: string }
  | { type: "RESET" };

export const INITIAL_ANALYSIS_PHASE_STATE: AnalysisPhaseState = {
  phase: "idle",
  error: null,
  lastResult: null,
  resultHref: null,
};

export function buildResultHref(result: PortfolioAnalysisResult): string {
  const params = encodeResultParams(result);
  return `/result/${result.code}?${params.toString()}`;
}

export function analysisPhaseReducer(
  state: AnalysisPhaseState,
  action: AnalysisPhaseAction
): AnalysisPhaseState {
  switch (action.type) {
    case "START": {
      if (state.phase === "analyzing" || state.phase === "navigating") {
        return state;
      }
      return {
        phase: "analyzing",
        error: null,
        lastResult: null,
        resultHref: null,
      };
    }
    case "SUCCEED": {
      return {
        phase: "navigating",
        error: null,
        lastResult: action.result,
        resultHref: action.resultHref,
      };
    }
    case "FAIL": {
      return {
        phase: "error",
        error: action.error,
        lastResult: null,
        resultHref: null,
      };
    }
    case "RESET": {
      return INITIAL_ANALYSIS_PHASE_STATE;
    }
  }
}

export interface AnalyzeButtonViewState {
  disabled: boolean;
  isLoading: boolean;
  label: string;
  dataState: "idle" | "disabled-loading";
}

export function getAnalyzeButtonState(
  phase: AnalysisPhase,
  specimenCount: number
): AnalyzeButtonViewState {
  if (phase === "analyzing") {
    return {
      disabled: true,
      isLoading: true,
      label: "Analyzing...",
      dataState: "disabled-loading",
    };
  }
  if (phase === "navigating") {
    return {
      disabled: true,
      isLoading: true,
      label: "Opening Report...",
      dataState: "disabled-loading",
    };
  }
  return {
    disabled: specimenCount === 0,
    isLoading: false,
    label: "Analyze My Business",
    dataState: "idle",
  };
}
