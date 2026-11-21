import {
  BigFiveScores,
  FormLetter,
  isValidPoopCode,
  OutlineLetter,
  POOP_TYPES,
  PoopTypeCode,
  PoopTypeProfile,
  SheenLetter,
  ToneLetter,
} from "./types-data";

export const MAX_FILES = 5;
export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
export const MAX_ANALYSIS_DIMENSION = 128;

export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "heif",
]);

export const VIBE_ALERT_MESSAGE =
  "This is a joke and cannot assess health. If you notice persistent red, black/tarry, or pale stools, talk to a medical professional.";

export type VibeAlertReason = "red" | "black" | "pale" | null;

export interface SingleSpecimenAnalysis {
  hashHex: string;
  code: PoopTypeCode;
  bristolType: number; // 1..7
  toneScore: number; // 0..100 (higher = lighter)
  outlineScore: number; // 0..100 (higher = more ragged)
  sheenScore: number; // 0..100 (higher = oilier/glossier)
  blobCount: number;
  elongation: number;
  vibeAlert: boolean;
  vibeReason: VibeAlertReason;
}

export interface PortfolioAnalysisResult {
  code: PoopTypeCode;
  profile: PoopTypeProfile;
  bristolType: number;
  confidence: number; // e.g., 94.7
  toneScore: number;
  outlineScore: number;
  sheenScore: number;
  specimenCount: number;
  seedHex: string;
  vibeAlert: boolean;
  vibeReason: VibeAlertReason;
  bigFive: BigFiveScores;
}

export interface BrowserAnalysisOutput {
  result: PortfolioAnalysisResult;
  sanitizedPreviews: string[];
}

export function validateFileMeta(file: {
  name: string;
  type: string;
  size: number;
}): string | null {
  if (file.size <= 0) {
    return `"${file.name}" appears to be empty.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `"${file.name}" exceeds the 8 MB specimen limit.`;
  }

  const normalizedType = file.type.toLowerCase();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const mimeOk = normalizedType !== "" && ALLOWED_MIME_TYPES.has(normalizedType);
  const extOk = ext !== "" && ALLOWED_EXTENSIONS.has(ext);

  if (!mimeOk && !extOk) {
    return `"${file.name}" is not a supported format (use JPG, PNG, WebP, or HEIC).`;
  }

  return null;
}

export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", copy.buffer);
  const view = new Uint8Array(digest);
  let hex = "";
  for (let i = 0; i < view.length; i++) {
    hex += view[i].toString(16).padStart(2, "0");
  }
  return hex;
}

/**
 * Deterministic unit float in [0, 1) derived from a SHA-256 hex string and an integer salt.
 */
export function seededUnit(hex: string, salt: number): number {
  const clean = hex.replace(/[^0-9a-f]/gi, "").padEnd(16, "0");
  const offset = (Math.abs(salt) * 4) % Math.max(1, clean.length - 8);
  const slice = clean.slice(offset, offset + 8);
  const parsed = parseInt(slice, 16) >>> 0;
  // Mix with SplitMix32 step so nearby salts remain uncorrelated
  let x = (parsed ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b) >>> 0;
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35) >>> 0;
  x = (x ^ (x >>> 16)) >>> 0;
  return x / 0x100000000;
}

export function rgbToLabLightness(r: number, g: number, b: number): number {
  const linearize = (v: number): number => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const rl = linearize(r);
  const gl = linearize(g);
  const bl = linearize(b);
  // CIE Y relative luminance (D65)
  const y = 0.2126729 * rl + 0.7151522 * gl + 0.072175 * bl;
  const f = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116;
  return Math.max(0, Math.min(100, 116 * f - 16));
}

export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) {
    return { h: 0, s: 0, l };
  }

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) {
    h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
  } else if (max === gn) {
    h = ((bn - rn) / d + 2) * 60;
  } else {
    h = ((rn - gn) / d + 4) * 60;
  }

  return { h, s, l };
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Pure, unit-testable pixel analyzer implementing the PoopType pipeline:
 * 1. Background-vs-foreground segmentation
 * 2. Center-weighted CIE L* Tone in brown/yellow/green/red hue band
 * 3. Sobel edge density Outline
 * 4. Specular highlight Sheen inside foreground blob
 * 5. Connected-component Form + Bristol Stool Scale estimation
 * 6. Seeded determinism & tie-breaks
 * 7. Vibe Alert check for red, black/tarry, or pale/clay hues
 */
export function analyzePixelBuffer(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  hashHex: string
): SingleSpecimenAnalysis {
  const totalPixels = width * height;
  if (totalPixels === 0 || rgba.length < totalPixels * 4) {
    throw new Error("Invalid pixel buffer dimensions.");
  }

  // Estimate background color from outer border ring
  let bgR = 0;
  let bgG = 0;
  let bgB = 0;
  let borderCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        const idx = (y * width + x) * 4;
        bgR += rgba[idx];
        bgG += rgba[idx + 1];
        bgB += rgba[idx + 2];
        borderCount++;
      }
    }
  }
  bgR /= Math.max(1, borderCount);
  bgG /= Math.max(1, borderCount);
  bgB /= Math.max(1, borderCount);

  const gray = new Float32Array(totalPixels);
  const lightness = new Float32Array(totalPixels);
  const fgMask = new Uint8Array(totalPixels);

  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const maxDist = Math.hypot(cx, cy) || 1;

  // Color distance distribution from border background to build foreground mask
  const colorDist = new Float32Array(totalPixels);
  let maxColorDist = 0;

  let toneWeightSum = 0;
  let toneLightnessSum = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      const idx = p * 4;
      const r = rgba[idx];
      const g = rgba[idx + 1];
      const b = rgba[idx + 2];

      const lStar = rgbToLabLightness(r, g, b);
      lightness[p] = lStar;
      gray[p] = 0.299 * r + 0.587 * g + 0.114 * b;

      const dist = Math.hypot(r - bgR, g - bgG, b - bgB);
      colorDist[p] = dist;
      if (dist > maxColorDist) maxColorDist = dist;

      // Center-weighted Tone in brown/yellow/green/red hue band
      const { h, s } = rgbToHsl(r, g, b);
      const inStoolHueBand = h <= 160 || h >= 330;
      const notPureBackdrop = lStar > 3 && lStar < 93 && (s > 0.06 || dist > 28);
      if (inStoolHueBand && notPureBackdrop) {
        const radial = Math.hypot(x - cx, y - cy) / maxDist;
        const centerWeight = Math.exp(-2.2 * radial * radial);
        toneLightnessSum += lStar * centerWeight;
        toneWeightSum += centerWeight;
      }
    }
  }

  // Foreground segmentation threshold
  const distThreshold = Math.max(22, maxColorDist * 0.24);
  let fgCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      if (colorDist[p] >= distThreshold) {
        fgMask[p] = 1;
        fgCount++;
      }
    }
  }

  // Fallback for nearly uniform / full-frame specimen images: use central 50% disk
  if (fgCount < totalPixels * 0.015) {
    fgCount = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const radial = Math.hypot(x - cx, y - cy) / maxDist;
        if (radial <= 0.55) {
          fgMask[y * width + x] = 1;
          fgCount++;
        }
      }
    }
  } else {
    // Flood-fill exterior background from border pixels so bright specular
    // highlights enclosed inside a dark blob remain part of the foreground.
    const exteriorBg = new Uint8Array(totalPixels);
    const bgQueue = new Int32Array(totalPixels);
    let qHead = 0;
    let qTail = 0;

    const enqueueIfBg = (p: number) => {
      if (fgMask[p] === 0 && exteriorBg[p] === 0) {
        exteriorBg[p] = 1;
        bgQueue[qTail++] = p;
      }
    };

    for (let x = 0; x < width; x++) {
      enqueueIfBg(x);
      enqueueIfBg((height - 1) * width + x);
    }
    for (let y = 1; y < height - 1; y++) {
      enqueueIfBg(y * width);
      enqueueIfBg(y * width + (width - 1));
    }

    while (qHead < qTail) {
      const curr = bgQueue[qHead++];
      const cy0 = Math.floor(curr / width);
      const cx0 = curr - cy0 * width;
      if (cx0 > 0) enqueueIfBg(curr - 1);
      if (cx0 < width - 1) enqueueIfBg(curr + 1);
      if (cy0 > 0) enqueueIfBg(curr - width);
      if (cy0 < height - 1) enqueueIfBg(curr + width);
    }

    for (let p = 0; p < totalPixels; p++) {
      if (fgMask[p] === 0 && exteriorBg[p] === 0) {
        fgMask[p] = 1;
        fgCount++;
      }
    }
  }

  // Step 2: Tone (mean L* in stool hue band, fallback to foreground L*)
  let meanFgL = 0;
  let meanFgSat = 0;
  let redAlertPixels = 0;
  let blackAlertPixels = 0;
  let paleAlertPixels = 0;
  let specularPixels = 0;

  // First pass on foreground for baseline L*
  for (let p = 0; p < totalPixels; p++) {
    if (fgMask[p] === 1) {
      meanFgL += lightness[p];
    }
  }
  meanFgL /= Math.max(1, fgCount);

  // Second pass on foreground for Sheen & Vibe Alert
  for (let p = 0; p < totalPixels; p++) {
    if (fgMask[p] !== 1) continue;
    const idx = p * 4;
    const r = rgba[idx];
    const g = rgba[idx + 1];
    const b = rgba[idx + 2];
    const lStar = lightness[p];
    const { h, s } = rgbToHsl(r, g, b);

    meanFgSat += s;

    // Specular highlights inside foreground blob: near-white OR sharply brighter low-sat glint
    const isNearWhite = lStar >= 80 && s <= 0.35;
    const isBrightGlint = lStar >= meanFgL + 24 && lStar >= 62 && s <= 0.4;
    if (isNearWhite || isBrightGlint) {
      specularPixels++;
    }

    // Vibe Alert checks
    const isStrongRed =
      (h <= 16 || h >= 342) && s >= 0.45 && r >= 115 && r > g * 1.45 && r > b * 1.45;
    if (isStrongRed) {
      redAlertPixels++;
    }
    if (lStar < 15) {
      blackAlertPixels++;
    }
    if (lStar > 72 && s < 0.16 && !isNearWhite) {
      paleAlertPixels++;
    }
  }
  meanFgSat /= Math.max(1, fgCount);

  const rawToneL = toneWeightSum > 0.001 ? toneLightnessSum / toneWeightSum : meanFgL;
  const toneJitter = (seededUnit(hashHex, 11) - 0.5) * 4; // +-2
  const toneScore = clamp(Math.round(rawToneL + toneJitter), 5, 95);

  // Step 3: Outline via 3x3 Sobel edge density around/inside foreground
  let edgePixels = 0;
  let evaluatedPixels = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p = y * width + x;
      const nearFg =
        fgMask[p] === 1 ||
        fgMask[p - 1] === 1 ||
        fgMask[p + 1] === 1 ||
        fgMask[p - width] === 1 ||
        fgMask[p + width] === 1;
      if (!nearFg) continue;

      evaluatedPixels++;
      const tl = gray[(y - 1) * width + (x - 1)];
      const tc = gray[(y - 1) * width + x];
      const tr = gray[(y - 1) * width + (x + 1)];
      const ml = gray[y * width + (x - 1)];
      const mr = gray[y * width + (x + 1)];
      const bl = gray[(y + 1) * width + (x - 1)];
      const bc = gray[(y + 1) * width + x];
      const br = gray[(y + 1) * width + (x + 1)];

      const gx = -tl - 2 * ml - bl + tr + 2 * mr + br;
      const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;
      const mag = Math.hypot(gx, gy);
      if (mag > 70) {
        edgePixels++;
      }
    }
  }

  const rawEdgeDensity = edgePixels / Math.max(1, evaluatedPixels);
  const outlineJitter = (seededUnit(hashHex, 17) - 0.5) * 5;
  const outlineScore = clamp(Math.round(rawEdgeDensity * 220 + outlineJitter), 5, 95);

  // Step 4: Sheen (specular highlight fraction inside foreground)
  const specularShare = specularPixels / Math.max(1, fgCount);
  const sheenJitter = (seededUnit(hashHex, 23) - 0.5) * 4;
  // Map 0..0.16 specular share onto 0..100 scale
  const sheenScore = clamp(Math.round((specularShare / 0.14) * 100 + sheenJitter), 5, 95);

  // Step 5: Connected-component blob analysis for Form & Bristol 1-7
  const visited = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  interface BlobStats {
    area: number;
    meanX: number;
    meanY: number;
    elongation: number;
    fillRatio: number;
  }
  const blobs: BlobStats[] = [];

  for (let start = 0; start < totalPixels; start++) {
    if (fgMask[start] !== 1 || visited[start] === 1) continue;

    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    visited[start] = 1;

    let area = 0;
    let sumX = 0;
    let sumY = 0;
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    const coordsX: number[] = [];
    const coordsY: number[] = [];

    while (head < tail) {
      const curr = queue[head++];
      const cy0 = Math.floor(curr / width);
      const cx0 = curr - cy0 * width;

      area++;
      sumX += cx0;
      sumY += cy0;
      coordsX.push(cx0);
      coordsY.push(cy0);
      if (cx0 < minX) minX = cx0;
      if (cx0 > maxX) maxX = cx0;
      if (cy0 < minY) minY = cy0;
      if (cy0 > maxY) maxY = cy0;

      // 4-connected neighbors
      if (cx0 > 0) {
        const n = curr - 1;
        if (fgMask[n] === 1 && visited[n] === 0) {
          visited[n] = 1;
          queue[tail++] = n;
        }
      }
      if (cx0 < width - 1) {
        const n = curr + 1;
        if (fgMask[n] === 1 && visited[n] === 0) {
          visited[n] = 1;
          queue[tail++] = n;
        }
      }
      if (cy0 > 0) {
        const n = curr - width;
        if (fgMask[n] === 1 && visited[n] === 0) {
          visited[n] = 1;
          queue[tail++] = n;
        }
      }
      if (cy0 < height - 1) {
        const n = curr + width;
        if (fgMask[n] === 1 && visited[n] === 0) {
          visited[n] = 1;
          queue[tail++] = n;
        }
      }
    }

    // Filter tiny 1-3px dust speckles
    if (area < Math.max(4, Math.floor(fgCount * 0.015))) {
      continue;
    }

    const meanX = sumX / area;
    const meanY = sumY / area;

    // 2D covariance eigenvalues give rotation-invariant elongation ratio
    let mxx = 0;
    let myy = 0;
    let mxy = 0;
    for (let i = 0; i < area; i++) {
      const dx = coordsX[i] - meanX;
      const dy = coordsY[i] - meanY;
      mxx += dx * dx;
      myy += dy * dy;
      mxy += dx * dy;
    }
    mxx /= area;
    myy /= area;
    mxy /= area;
    const trace = mxx + myy;
    const disc = Math.sqrt(Math.max(0, (mxx - myy) * (mxx - myy) + 4 * mxy * mxy));
    const eig1 = Math.max(0.25, (trace + disc) / 2);
    const eig2 = Math.max(0.25, (trace - disc) / 2);
    const elongation = Math.sqrt(eig1 / eig2);

    const bboxArea = Math.max(1, (maxX - minX + 1) * (maxY - minY + 1));
    const fillRatio = area / bboxArea;

    blobs.push({ area, meanX, meanY, elongation, fillRatio });
  }

  blobs.sort((a, b) => b.area - a.area);
  const blobCount = Math.max(1, blobs.length);
  const primary = blobs[0] ?? {
    area: fgCount,
    meanX: cx,
    meanY: cy,
    elongation: 1.5,
    fillRatio: 0.65,
  };
  const largestShare = primary.area / Math.max(1, fgCount);
  const fgCoverage = fgCount / totalPixels;

  let bristolType: number;
  if (blobCount >= 4 && largestShare < 0.45) {
    // Many small distinct blobs -> Bristol 1-2
    bristolType = blobCount >= 6 || outlineScore < 42 ? 1 : 2;
  } else if (primary.elongation >= 2.05 && blobCount <= 3 && outlineScore < 68) {
    // One elongated cohesive blob -> Bristol 3-4
    bristolType = outlineScore >= 38 ? 3 : 4;
  } else {
    // Wide, flat, or ragged mass -> Bristol 5-7
    if (fgCoverage > 0.45 && outlineScore < 35) {
      bristolType = 7;
    } else if (outlineScore >= 52 || primary.fillRatio < 0.56) {
      bristolType = 6;
    } else {
      bristolType = 5;
    }
  }

  // Axis assignments
  const formLetter: FormLetter =
    bristolType <= 3
      ? "P"
      : bristolType >= 5
      ? "F"
      : seededUnit(hashHex, 3) < 0.5
      ? "P"
      : "F";

  const outlineLetter: OutlineLetter = outlineScore < 50 ? "P" : "R";
  const toneLetter: ToneLetter = toneScore < 48 ? "T" : "L";
  const sheenLetter: SheenLetter = sheenScore >= 46 ? "O" : "D";

  const code = `${formLetter}${outlineLetter}${toneLetter}${sheenLetter}` as PoopTypeCode;

  // Step 7: Vibe Alert
  const redShare = redAlertPixels / Math.max(1, fgCount);
  const blackShare = blackAlertPixels / Math.max(1, fgCount);
  const paleShare = paleAlertPixels / Math.max(1, fgCount);

  let vibeReason: VibeAlertReason = null;
  if (redShare >= 0.28) {
    vibeReason = "red";
  } else if (meanFgL < 14 && blackShare >= 0.62) {
    vibeReason = "black";
  } else if (meanFgL > 72 && meanFgSat < 0.16 && paleShare >= 0.55) {
    vibeReason = "pale";
  }

  return {
    hashHex,
    code,
    bristolType,
    toneScore,
    outlineScore,
    sheenScore,
    blobCount,
    elongation: Number(primary.elongation.toFixed(2)),
    vibeAlert: vibeReason !== null,
    vibeReason,
  };
}

export function deriveBigFive(
  code: PoopTypeCode,
  toneScore: number,
  outlineScore: number,
  sheenScore: number,
  seedHex: string
): BigFiveScores {
  const base = POOP_TYPES[code].baseBigFive;
  const jitter = (salt: number) => Math.round((seededUnit(seedHex, salt) - 0.5) * 10);

  return {
    openness: clamp(
      Math.round(base.openness + (outlineScore - 50) * 0.12 + jitter(31)),
      8,
      98
    ),
    conscientiousness: clamp(
      Math.round(base.conscientiousness - (outlineScore - 50) * 0.14 + jitter(37)),
      8,
      98
    ),
    extraversion: clamp(
      Math.round(base.extraversion + (toneScore - 50) * 0.12 + jitter(41)),
      8,
      98
    ),
    agreeableness: clamp(
      Math.round(base.agreeableness + (sheenScore - 50) * 0.12 + jitter(43)),
      8,
      98
    ),
    neuroticism: clamp(
      Math.round(base.neuroticism + (outlineScore - 50) * 0.1 + jitter(47)),
      8,
      98
    ),
  };
}

export function deriveFakeConfidence(seedHex: string): number {
  const raw = 91.2 + seededUnit(seedHex, 53) * 8.1; // 91.2% .. 99.3%
  return Math.round(raw * 10) / 10;
}

export async function combinePortfolioAnalyses(
  specimens: SingleSpecimenAnalysis[]
): Promise<PortfolioAnalysisResult> {
  if (specimens.length === 0) {
    throw new Error("At least one specimen is required for portfolio analysis.");
  }

  // Deterministic combined hash independent of subtle object differences
  const joined = specimens.map((s) => s.hashHex).join(":");
  const combinedHashHex =
    specimens.length === 1
      ? specimens[0].hashHex
      : await sha256Hex(new TextEncoder().encode(joined));

  const n = specimens.length;
  const avgBristol = Math.round(
    specimens.reduce((sum, s) => sum + s.bristolType, 0) / n
  );
  const bristolType = clamp(avgBristol, 1, 7);
  const toneScore = clamp(
    Math.round(specimens.reduce((sum, s) => sum + s.toneScore, 0) / n),
    5,
    95
  );
  const outlineScore = clamp(
    Math.round(specimens.reduce((sum, s) => sum + s.outlineScore, 0) / n),
    5,
    95
  );
  const sheenScore = clamp(
    Math.round(specimens.reduce((sum, s) => sum + s.sheenScore, 0) / n),
    5,
    95
  );

  const formLetter: FormLetter =
    bristolType <= 3
      ? "P"
      : bristolType >= 5
      ? "F"
      : seededUnit(combinedHashHex, 3) < 0.5
      ? "P"
      : "F";
  const outlineLetter: OutlineLetter = outlineScore < 50 ? "P" : "R";
  const toneLetter: ToneLetter = toneScore < 48 ? "T" : "L";
  const sheenLetter: SheenLetter = sheenScore >= 46 ? "O" : "D";

  const code = `${formLetter}${outlineLetter}${toneLetter}${sheenLetter}` as PoopTypeCode;
  const profile = POOP_TYPES[code];
  const seedHex = combinedHashHex.slice(0, 12);

  const alertedSpecimen = specimens.find((s) => s.vibeAlert);
  const vibeAlert = Boolean(alertedSpecimen);
  const vibeReason: VibeAlertReason = alertedSpecimen?.vibeReason ?? null;

  return {
    code,
    profile,
    bristolType,
    confidence: deriveFakeConfidence(seedHex),
    toneScore,
    outlineScore,
    sheenScore,
    specimenCount: n,
    seedHex,
    vibeAlert,
    vibeReason,
    bigFive: deriveBigFive(code, toneScore, outlineScore, sheenScore, seedHex),
  };
}

export function encodeResultParams(result: PortfolioAnalysisResult): URLSearchParams {
  const params = new URLSearchParams();
  params.set("b", String(result.bristolType));
  params.set("c", result.confidence.toFixed(1));
  params.set("t", String(result.toneScore));
  params.set("o", String(result.outlineScore));
  params.set("s", String(result.sheenScore));
  params.set("n", String(result.specimenCount));
  params.set("h", result.seedHex);
  if (result.vibeAlert) {
    params.set("v", "1");
    if (result.vibeReason) {
      params.set("vr", result.vibeReason);
    }
  }
  return params;
}

export function decodeResultParams(
  rawCode: string,
  searchParams: Record<string, string | string[] | undefined>
): PortfolioAnalysisResult | null {
  const upper = rawCode.toUpperCase();
  if (!isValidPoopCode(upper)) {
    return null;
  }

  const getOne = (key: string): string | undefined => {
    const val = searchParams[key];
    return Array.isArray(val) ? val[0] : val;
  };

  const profile = POOP_TYPES[upper];
  const defaultBristol = upper[0] === "P" ? 3 : 5;
  const defaultTone = upper[2] === "T" ? 32 : 68;
  const defaultOutline = upper[1] === "P" ? 26 : 72;
  const defaultSheen = upper[3] === "O" ? 71 : 28;

  const parseNum = (raw: string | undefined, fallback: number, min: number, max: number) => {
    if (!raw) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? clamp(n, min, max) : fallback;
  };

  const bristolType = Math.round(parseNum(getOne("b"), defaultBristol, 1, 7));
  const seedHex = (getOne("h") ?? upper.split("").map((c) => c.charCodeAt(0).toString(16)).join("")).slice(0, 12);
  const confidence = Number(
    parseNum(getOne("c"), deriveFakeConfidence(seedHex), 80.0, 99.9).toFixed(1)
  );
  const toneScore = Math.round(parseNum(getOne("t"), defaultTone, 5, 95));
  const outlineScore = Math.round(parseNum(getOne("o"), defaultOutline, 5, 95));
  const sheenScore = Math.round(parseNum(getOne("s"), defaultSheen, 5, 95));
  const specimenCount = Math.round(parseNum(getOne("n"), 1, 1, MAX_FILES));

  const vibeFlag = getOne("v") === "1";
  const rawReason = getOne("vr");
  const vibeReason: VibeAlertReason =
    vibeFlag && (rawReason === "red" || rawReason === "black" || rawReason === "pale")
      ? rawReason
      : vibeFlag
      ? "red"
      : null;

  return {
    code: upper,
    profile,
    bristolType,
    confidence,
    toneScore,
    outlineScore,
    sheenScore,
    specimenCount,
    seedHex,
    vibeAlert: vibeFlag,
    vibeReason,
    bigFive: deriveBigFive(upper, toneScore, outlineScore, sheenScore, seedHex),
  };
}

/**
 * Browser-only helper: re-draws an uploaded image onto a fresh Canvas so all
 * EXIF/GPS metadata is stripped, downscales to <= 128px on its longest side
 * for analysis, and creates a clean sanitized thumbnail data URL.
 */
async function loadSanitizedSpecimen(file: File): Promise<{
  rgba: Uint8ClampedArray;
  width: number;
  height: number;
  hashHex: string;
  previewDataUrl: string;
}> {
  const err = validateFileMeta(file);
  if (err) {
    throw new Error(err);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const hashHex = await sha256Hex(bytes);

  let sourceWidth = 0;
  let sourceHeight = 0;
  let drawSource: CanvasImageSource;
  let cleanup = () => {};

  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      sourceWidth = bitmap.width;
      sourceHeight = bitmap.height;
      drawSource = bitmap;
      cleanup = () => bitmap.close();
    } catch {
      const loaded = await loadViaImageElement(file);
      sourceWidth = loaded.img.naturalWidth;
      sourceHeight = loaded.img.naturalHeight;
      drawSource = loaded.img;
      cleanup = loaded.cleanup;
    }
  } else {
    const loaded = await loadViaImageElement(file);
    sourceWidth = loaded.img.naturalWidth;
    sourceHeight = loaded.img.naturalHeight;
    drawSource = loaded.img;
    cleanup = loaded.cleanup;
  }

  try {
    if (sourceWidth === 0 || sourceHeight === 0) {
      throw new Error(`Could not decode image dimensions for "${file.name}".`);
    }

    // 1. Downscale to <= 128px longest side for Canvas analysis (strips all EXIF/GPS)
    const scale = Math.min(1, MAX_ANALYSIS_DIMENSION / Math.max(sourceWidth, sourceHeight));
    const targetW = Math.max(16, Math.round(sourceWidth * scale));
    const targetH = Math.max(16, Math.round(sourceHeight * scale));

    const analysisCanvas = document.createElement("canvas");
    analysisCanvas.width = targetW;
    analysisCanvas.height = targetH;
    const analysisCtx = analysisCanvas.getContext("2d", { willReadFrequently: true });
    if (!analysisCtx) {
      throw new Error("Your browser could not initialize a 2D canvas context.");
    }
    analysisCtx.drawImage(drawSource, 0, 0, targetW, targetH);
    const imageData = analysisCtx.getImageData(0, 0, targetW, targetH);

    // 2. Render EXIF-stripped preview (max 360px) for local display / opt-in share card
    const previewScale = Math.min(1, 360 / Math.max(sourceWidth, sourceHeight));
    const prevW = Math.max(32, Math.round(sourceWidth * previewScale));
    const prevH = Math.max(32, Math.round(sourceHeight * previewScale));
    const previewCanvas = document.createElement("canvas");
    previewCanvas.width = prevW;
    previewCanvas.height = prevH;
    const previewCtx = previewCanvas.getContext("2d");
    if (previewCtx) {
      previewCtx.drawImage(drawSource, 0, 0, prevW, prevH);
    }
    const previewDataUrl = previewCanvas.toDataURL("image/jpeg", 0.82);

    return {
      rgba: imageData.data,
      width: targetW,
      height: targetH,
      hashHex,
      previewDataUrl,
    };
  } finally {
    cleanup();
  }
}

function loadViaImageElement(
  file: File
): Promise<{ img: HTMLImageElement; cleanup: () => void }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, cleanup: () => URL.revokeObjectURL(url) });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          `Your browser could not decode "${file.name}". If this is a HEIC image, try JPG, PNG, or WebP.`
        )
      );
    };
    img.src = url;
  });
}

export async function analyzeFilesInBrowser(
  files: File[]
): Promise<BrowserAnalysisOutput> {
  if (files.length === 0) {
    throw new Error("Please add 1 to 5 specimen photos first.");
  }
  if (files.length > MAX_FILES) {
    throw new Error(`Maximum ${MAX_FILES} photos per Poop Portfolio.`);
  }

  const sanitizedPreviews: string[] = [];
  const specimenResults: SingleSpecimenAnalysis[] = [];

  for (const file of files) {
    const loaded = await loadSanitizedSpecimen(file);
    sanitizedPreviews.push(loaded.previewDataUrl);
    specimenResults.push(
      analyzePixelBuffer(loaded.rgba, loaded.width, loaded.height, loaded.hashHex)
    );
  }

  const result = await combinePortfolioAnalyses(specimenResults);
  return { result, sanitizedPreviews };
}
