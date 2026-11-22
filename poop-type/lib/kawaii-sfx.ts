export type KawaiiSfxName =
  | "pop"
  | "accordionOpen"
  | "accordionClose"
  | "cardFlip"
  | "cardClose"
  | "photoAdd"
  | "photoRemove"
  | "sparkle"
  | "whooshUp"
  | "tileFlip"
  | "fanfare";

export interface SfxNote {
  /** Oscillator waveform — strictly warm sine or triangle for soft kawaii timbre. */
  type: "sine" | "triangle";
  /** Start frequency in Hz. */
  startHz: number;
  /** Optional glide target frequency in Hz. */
  endHz?: number;
  /** Delay from trigger in seconds. */
  delaySec: number;
  /** Duration of the note in seconds. */
  durationSec: number;
  /** Peak gain (kept subtle: <= 0.22). */
  gain: number;
}

export interface SfxRecipe {
  notes: readonly SfxNote[];
  /** Whether to apply tiny +-2.5% organic pitch variation on repeated plays. */
  organicJitter?: boolean;
  /** Minimum ms before this same SFX can fire again. */
  cooldownMs?: number;
}

export const DEFAULT_SFX_COOLDOWN_MS = 45;
export const MAX_SUBTLE_GAIN = 0.22;

/** Cheerful C-major pentatonic climb for the 4 flipping result tiles (C5, D5, E5, G5). */
export const TILE_FLIP_FREQUENCIES = [523.25, 587.33, 659.25, 783.99] as const;

export const SFX_RECIPES: Record<KawaiiSfxName, SfxRecipe> = {
  // Tiny juicy bubble-pop for buttons, nav tabs, and filter pills
  pop: {
    organicJitter: true,
    cooldownMs: 45,
    notes: [
      {
        type: "sine",
        startHz: 470,
        endHz: 680,
        delaySec: 0,
        durationSec: 0.068,
        gain: 0.13,
      },
    ],
  },

  // Cute rising two-note wooden bloop when opening an accordion
  accordionOpen: {
    organicJitter: true,
    cooldownMs: 55,
    notes: [
      {
        type: "sine",
        startHz: 523.25,
        endHz: 560,
        delaySec: 0,
        durationSec: 0.06,
        gain: 0.11,
      },
      {
        type: "triangle",
        startHz: 659.25,
        endHz: 698.46,
        delaySec: 0.045,
        durationSec: 0.075,
        gain: 0.1,
      },
    ],
  },

  // Gentle descending bloop when closing an accordion
  accordionClose: {
    organicJitter: true,
    cooldownMs: 55,
    notes: [
      {
        type: "sine",
        startHz: 587.33,
        endHz: 440,
        delaySec: 0,
        durationSec: 0.078,
        gain: 0.1,
      },
    ],
  },

  // Light magic card-flip sparkle when opening a collectible type card
  cardFlip: {
    cooldownMs: 70,
    notes: [
      {
        type: "triangle",
        startHz: 523.25,
        endHz: 783.99,
        delaySec: 0,
        durationSec: 0.085,
        gain: 0.11,
      },
      {
        type: "sine",
        startHz: 1046.5,
        endHz: 1174.66,
        delaySec: 0.055,
        durationSec: 0.11,
        gain: 0.1,
      },
    ],
  },

  // Soft downward tuck when closing a modal card
  cardClose: {
    cooldownMs: 60,
    notes: [
      {
        type: "sine",
        startHz: 659.25,
        endHz: 493.88,
        delaySec: 0,
        durationSec: 0.075,
        gain: 0.095,
      },
    ],
  },

  // Happy bouncy sticker-plop when a photo lands in the Private Photo Box
  photoAdd: {
    cooldownMs: 70,
    notes: [
      {
        type: "sine",
        startHz: 523.25,
        endHz: 587.33,
        delaySec: 0,
        durationSec: 0.07,
        gain: 0.13,
      },
      {
        type: "triangle",
        startHz: 783.99,
        endHz: 880,
        delaySec: 0.055,
        durationSec: 0.1,
        gain: 0.12,
      },
    ],
  },

  // Tiny soft downward boop when removing a photo
  photoRemove: {
    cooldownMs: 50,
    notes: [
      {
        type: "sine",
        startHz: 430,
        endHz: 295,
        delaySec: 0,
        durationSec: 0.075,
        gain: 0.11,
      },
    ],
  },

  // Crisp pastel chime for Copy, Download, Share, and Start Analyzing
  sparkle: {
    cooldownMs: 80,
    notes: [
      {
        type: "sine",
        startHz: 783.99,
        delaySec: 0,
        durationSec: 0.08,
        gain: 0.1,
      },
      {
        type: "sine",
        startHz: 1046.5,
        delaySec: 0.055,
        durationSec: 0.09,
        gain: 0.11,
      },
      {
        type: "triangle",
        startHz: 1318.51,
        delaySec: 0.11,
        durationSec: 0.13,
        gain: 0.09,
      },
    ],
  },

  // Cute rising whistle-boop for Back to Top
  whooshUp: {
    cooldownMs: 120,
    notes: [
      {
        type: "sine",
        startHz: 392,
        endHz: 783.99,
        delaySec: 0,
        durationSec: 0.14,
        gain: 0.11,
      },
      {
        type: "sine",
        startHz: 783.99,
        endHz: 1046.5,
        delaySec: 0.07,
        durationSec: 0.09,
        gain: 0.08,
      },
    ],
  },

  // Base recipe for ascending result-letter tile flip (frequency overridden by stepIndex)
  tileFlip: {
    cooldownMs: 40,
    notes: [
      {
        type: "triangle",
        startHz: 523.25,
        endHz: 587.33,
        delaySec: 0,
        durationSec: 0.095,
        gain: 0.12,
      },
    ],
  },

  // Warm short kawaii music-box ta-da arpeggio when the result card reveals
  fanfare: {
    cooldownMs: 250,
    notes: [
      {
        type: "triangle",
        startHz: 523.25,
        delaySec: 0,
        durationSec: 0.11,
        gain: 0.12,
      },
      {
        type: "triangle",
        startHz: 659.25,
        delaySec: 0.075,
        durationSec: 0.11,
        gain: 0.12,
      },
      {
        type: "triangle",
        startHz: 783.99,
        delaySec: 0.15,
        durationSec: 0.12,
        gain: 0.13,
      },
      {
        type: "sine",
        startHz: 1046.5,
        delaySec: 0.225,
        durationSec: 0.24,
        gain: 0.14,
      },
      {
        type: "sine",
        startHz: 1318.51,
        delaySec: 0.24,
        durationSec: 0.22,
        gain: 0.08,
      },
    ],
  },
};

/**
 * Maps a 0-based tile flip step (0..3) to a cheerful ascending pentatonic pitch.
 */
export function getTileFlipFrequency(stepIndex: number): number {
  const clamped = Math.max(
    0,
    Math.min(TILE_FLIP_FREQUENCIES.length - 1, Math.floor(stepIndex))
  );
  return TILE_FLIP_FREQUENCIES[clamped];
}

/**
 * Debounce guard preventing rapid duplicate triggers from stacking or clipping.
 */
export function shouldPlaySfx(
  lastPlayedMs: number | undefined,
  nowMs: number,
  minIntervalMs: number = DEFAULT_SFX_COOLDOWN_MS
): boolean {
  if (lastPlayedMs === undefined) return true;
  return nowMs - lastPlayedMs >= minIntervalMs;
}

/**
 * Applies a subtle +-2.5% organic pitch variation so repeated pops feel playful
 * rather than robotic. `randomUnit` is expected in [0, 1].
 */
export function applySubtleJitter(
  baseHz: number,
  randomUnit: number
): number {
  const clamped = Math.max(0, Math.min(1, randomUnit));
  const multiplier = 1 + (clamped * 2 - 1) * 0.025;
  return Number((baseHz * multiplier).toFixed(2));
}

// --- Client-side Web Audio singleton synthesizer ---

let sharedCtx: AudioContext | null = null;
const lastPlayedByName = new Map<string, number>();

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedCtx) {
    try {
      sharedCtx = new AudioCtx();
    } catch {
      return null;
    }
  }

  if (sharedCtx.state === "suspended") {
    void sharedCtx.resume().catch(() => {
      // Autoplay policies may keep context suspended until a user gesture
    });
  }
  return sharedCtx;
}

export interface PlayKawaiiSfxOptions {
  /** Optional 0..3 step index for ascending `tileFlip` notes. */
  stepIndex?: number;
}

/**
 * Plays a subtle, warm, synthesized kawaii UI sound effect via Web Audio API.
 * Gracefully no-ops in SSR or environments without Web Audio support.
 */
export function playKawaiiSfx(
  name: KawaiiSfxName,
  options?: PlayKawaiiSfxOptions
): boolean {
  if (typeof window === "undefined") return false;

  const recipe = SFX_RECIPES[name];
  if (!recipe) return false;

  const nowMs = Date.now();
  const dedupeKey =
    name === "tileFlip" && options?.stepIndex !== undefined
      ? `${name}:${options.stepIndex}`
      : name;
  const cooldown = recipe.cooldownMs ?? DEFAULT_SFX_COOLDOWN_MS;

  if (!shouldPlaySfx(lastPlayedByName.get(dedupeKey), nowMs, cooldown)) {
    return false;
  }
  lastPlayedByName.set(dedupeKey, nowMs);

  // Record lightweight telemetry attributes on <html> for deterministic testing
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.lastSfx = name;
    const prevCount = Number(document.documentElement.dataset.sfxCount ?? "0");
    document.documentElement.dataset.sfxCount = String(
      Number.isFinite(prevCount) ? prevCount + 1 : 1
    );
  }

  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    const startAt = ctx.currentTime + 0.004;

    // Gentle low-pass filter keeps all tones velvety and pastel-soft
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3200, startAt);
    filter.Q.setValueAtTime(0.7, startAt);
    filter.connect(ctx.destination);

    const jitterSeed = recipe.organicJitter ? Math.random() : 0.5;

    for (const note of recipe.notes) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = note.type;

      let startHz = note.startHz;
      let endHz = note.endHz;

      if (name === "tileFlip" && options?.stepIndex !== undefined) {
        startHz = getTileFlipFrequency(options.stepIndex);
        endHz = Number((startHz * 1.12).toFixed(2));
      } else if (recipe.organicJitter) {
        startHz = applySubtleJitter(startHz, jitterSeed);
        if (endHz !== undefined) {
          endHz = applySubtleJitter(endHz, jitterSeed);
        }
      }

      const noteStart = startAt + note.delaySec;
      const noteEnd = noteStart + note.durationSec;
      const peakGain = Math.min(note.gain, MAX_SUBTLE_GAIN);

      osc.frequency.setValueAtTime(startHz, noteStart);
      if (endHz !== undefined && endHz > 0) {
        osc.frequency.exponentialRampToValueAtTime(endHz, noteEnd);
      }

      // Click-free soft attack + silky exponential decay
      gainNode.gain.setValueAtTime(0.0001, noteStart);
      gainNode.gain.linearRampToValueAtTime(
        peakGain,
        noteStart + Math.min(0.012, note.durationSec * 0.25)
      );
      gainNode.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

      osc.connect(gainNode);
      gainNode.connect(filter);

      osc.start(noteStart);
      osc.stop(noteEnd + 0.015);
    }

    return true;
  } catch {
    return false;
  }
}
