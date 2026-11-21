export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface FlipOriginTransform {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 0.42;
const MAX_SCALE = 0.96;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Computes the initial translation and scale needed to launch a centered modal
 * smoothly from the clicked grid card's exact visual position on screen.
 */
export function computeFlipOriginTransform(
  originRect: RectLike | null,
  viewport: ViewportSize,
  modalWidth: number,
  modalHeight: number
): FlipOriginTransform {
  if (
    !originRect ||
    originRect.width <= 0 ||
    originRect.height <= 0 ||
    viewport.width <= 0 ||
    viewport.height <= 0
  ) {
    return { x: 0, y: 24, scale: 0.88 };
  }

  const originCenterX = originRect.left + originRect.width / 2;
  const originCenterY = originRect.top + originRect.height / 2;

  const viewportCenterX = viewport.width / 2;
  const viewportCenterY = viewport.height / 2;

  const maxOffsetX = viewport.width * 0.48;
  const maxOffsetY = viewport.height * 0.48;

  const x = clamp(originCenterX - viewportCenterX, -maxOffsetX, maxOffsetX);
  const y = clamp(originCenterY - viewportCenterY, -maxOffsetY, maxOffsetY);

  const safeModalWidth = Math.max(modalWidth, 1);
  const safeModalHeight = Math.max(modalHeight, 1);
  const ratioX = originRect.width / safeModalWidth;
  const ratioY = originRect.height / safeModalHeight;
  const scale = clamp((ratioX + ratioY) / 2, MIN_SCALE, MAX_SCALE);

  return {
    x: Math.round(x),
    y: Math.round(y),
    scale: Number(scale.toFixed(3)),
  };
}
