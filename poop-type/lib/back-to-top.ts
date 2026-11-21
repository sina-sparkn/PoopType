export const REQUIRED_SCROLLS = 3;
export const DEFAULT_SCROLL_STEP_PX = 240;
export const TOP_HIDE_THRESHOLD_PX = 80;
export const GESTURE_COOLDOWN_MS = 140;

export interface BackToTopState {
  downwardGestures: number;
  lastGestureAt: number;
  lastScrollY: number;
  visible: boolean;
}

export function createInitialBackToTopState(): BackToTopState {
  return {
    downwardGestures: 0,
    lastGestureAt: Number.NEGATIVE_INFINITY,
    lastScrollY: 0,
    visible: false,
  };
}

/**
 * Computes the vertical scroll distance equivalent to three comfortable scrolls,
 * scaling gracefully on shorter tabs so the button remains reachable while never
 * appearing on non-scrollable pages.
 */
export function computeThreeScrollThresholdPx(
  _viewportHeight: number,
  maxScrollY: number
): number {
  if (maxScrollY <= TOP_HIDE_THRESHOLD_PX) {
    return Number.POSITIVE_INFINITY;
  }
  const perScroll = Math.min(
    DEFAULT_SCROLL_STEP_PX,
    Math.max(120, Math.floor(maxScrollY / 4))
  );
  const threeScrolls = perScroll * REQUIRED_SCROLLS;
  const maxReachable = Math.max(240, Math.floor(maxScrollY * 0.72));
  return Math.min(threeScrolls, maxReachable);
}

/**
 * Records a discrete downward scroll gesture (wheel notch, touch swipe up, or
 * PageDown/ArrowDown keypress) with cooldown debouncing so one flick counts once.
 */
export function recordDownwardGesture(
  state: BackToTopState,
  {
    nowMs,
    scrollY,
    viewportHeight,
    maxScrollY,
  }: {
    nowMs: number;
    scrollY: number;
    viewportHeight: number;
    maxScrollY: number;
  }
): BackToTopState {
  if (maxScrollY <= TOP_HIDE_THRESHOLD_PX) {
    return createInitialBackToTopState();
  }

  const isDistinctGesture = nowMs - state.lastGestureAt >= GESTURE_COOLDOWN_MS;
  const nextGestures = isDistinctGesture
    ? state.downwardGestures + 1
    : state.downwardGestures;
  const nextLastGestureAt = isDistinctGesture ? nowMs : state.lastGestureAt;

  const thresholdPx = computeThreeScrollThresholdPx(viewportHeight, maxScrollY);
  const visible =
    scrollY > TOP_HIDE_THRESHOLD_PX &&
    (nextGestures >= REQUIRED_SCROLLS || scrollY >= thresholdPx);

  return {
    downwardGestures: nextGestures,
    lastGestureAt: nextLastGestureAt,
    lastScrollY: scrollY,
    visible,
  };
}

/**
 * Re-evaluates visibility after a scroll position update. Resets cleanly when
 * returning near the top of the page.
 */
export function applyScrollPosition(
  state: BackToTopState,
  {
    scrollY,
    viewportHeight,
    maxScrollY,
  }: {
    scrollY: number;
    viewportHeight: number;
    maxScrollY: number;
  }
): BackToTopState {
  if (scrollY <= TOP_HIDE_THRESHOLD_PX || maxScrollY <= TOP_HIDE_THRESHOLD_PX) {
    return {
      downwardGestures: 0,
      lastGestureAt: state.lastGestureAt,
      lastScrollY: scrollY,
      visible: false,
    };
  }

  const thresholdPx = computeThreeScrollThresholdPx(viewportHeight, maxScrollY);
  const visible =
    state.downwardGestures >= REQUIRED_SCROLLS || scrollY >= thresholdPx;

  return {
    ...state,
    lastScrollY: scrollY,
    visible,
  };
}
