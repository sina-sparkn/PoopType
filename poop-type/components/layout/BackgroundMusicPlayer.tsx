"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { SPRING_SNAPPY } from "@/components/motion/MotionPrimitives";
import {
  getToggleAction,
  MUSIC_PREF_STORAGE_KEY,
  MusicPlaybackStatus,
  MusicPreference,
  resolveAutoplayResult,
  resolveInitialMusicPreference,
  shouldUnlockOnGesture,
} from "@/lib/background-music";
import { playKawaiiSfx } from "@/lib/kawaii-sfx";

const AUDIO_SRC = "/assets/aistudio/main_music_a4aae9ca.m4a";

const VISUALIZER_BARS = [
  { color: "#FF7AC6", animClass: "eq-wave-bar-1", staticScale: 0.48 },
  { color: "#FFD93D", animClass: "eq-wave-bar-2", staticScale: 0.82 },
  { color: "#6BE3B5", animClass: "eq-wave-bar-3", staticScale: 1.0 },
  { color: "#5CC8FF", animClass: "eq-wave-bar-4", staticScale: 0.76 },
  { color: "#FF9F43", animClass: "eq-wave-bar-5", staticScale: 0.44 },
] as const;

function readStoredPreference(): MusicPreference {
  try {
    return resolveInitialMusicPreference(
      window.sessionStorage.getItem(MUSIC_PREF_STORAGE_KEY)
    );
  } catch {
    return "on";
  }
}

function writeStoredPreference(pref: MusicPreference): void {
  try {
    window.sessionStorage.setItem(MUSIC_PREF_STORAGE_KEY, pref);
  } catch {
    // Ignore storage errors in restricted browsing contexts
  }
}

/**
 * Persistent site-wide background music player with automatic playback,
 * browser autoplay-policy first-gesture unlock, and a floating Play/Pause
 * sticker button positioned opposite the Back-to-Top button.
 */
export function BackgroundMusicPlayer() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const prefRef = useRef<MusicPreference>("on");
  const statusRef = useRef<MusicPlaybackStatus>("paused");
  const cleanupUnlockRef = useRef<(() => void) | null>(null);

  const [status, setStatus] = useState<MusicPlaybackStatus>("paused");

  useEffect(() => {
    document.documentElement.dataset.musicPlaying =
      status === "playing" ? "true" : "false";
    return () => {
      document.documentElement.dataset.musicPlaying = "false";
    };
  }, [status]);

  const updateStatus = useCallback((next: MusicPlaybackStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const clearUnlockListeners = useCallback(() => {
    if (cleanupUnlockRef.current) {
      cleanupUnlockRef.current();
      cleanupUnlockRef.current = null;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;
    const initialPref = readStoredPreference();
    prefRef.current = initialPref;

    if (initialPref === "off") {
      audio.pause();
      return;
    }

    let cancelled = false;

    const armGestureUnlock = () => {
      clearUnlockListeners();

      const onFirstGesture = (event: Event) => {
        // Let the floating play/pause button handle its own click directly
        if (
          buttonRef.current &&
          event.target instanceof Node &&
          buttonRef.current.contains(event.target)
        ) {
          return;
        }
        if (!shouldUnlockOnGesture(statusRef.current, prefRef.current)) {
          clearUnlockListeners();
          return;
        }
        clearUnlockListeners();
        const playAttempt = audio.play();
        if (playAttempt && typeof playAttempt.then === "function") {
          playAttempt
            .then(() => {
              if (!cancelled) updateStatus("playing");
            })
            .catch(() => {
              if (!cancelled) updateStatus("paused");
            });
        }
      };

      window.addEventListener("pointerdown", onFirstGesture, {
        capture: true,
        passive: true,
      });
      window.addEventListener("keydown", onFirstGesture, {
        capture: true,
        passive: true,
      });
      window.addEventListener("touchstart", onFirstGesture, {
        capture: true,
        passive: true,
      });

      cleanupUnlockRef.current = () => {
        window.removeEventListener("pointerdown", onFirstGesture, true);
        window.removeEventListener("keydown", onFirstGesture, true);
        window.removeEventListener("touchstart", onFirstGesture, true);
      };
    };

    const startAttempt = audio.play();
    if (startAttempt && typeof startAttempt.then === "function") {
      startAttempt
        .then(() => {
          if (!cancelled) {
            updateStatus(resolveAutoplayResult(true));
          }
        })
        .catch(() => {
          if (!cancelled) {
            updateStatus(resolveAutoplayResult(false));
            armGestureUnlock();
          }
        });
    }

    return () => {
      cancelled = true;
      clearUnlockListeners();
    };
  }, [clearUnlockListeners, updateStatus]);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    playKawaiiSfx("pop");
    clearUnlockListeners();
    const action = getToggleAction(statusRef.current);

    if (action === "pause") {
      prefRef.current = "off";
      writeStoredPreference("off");
      audio.pause();
      updateStatus("paused");
      return;
    }

    prefRef.current = "on";
    writeStoredPreference("on");
    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.then === "function") {
      playAttempt
        .then(() => {
          updateStatus("playing");
        })
        .catch(() => {
          updateStatus("paused");
        });
    } else {
      updateStatus("playing");
    }
  };

  const isPlaying = status === "playing";
  const label = isPlaying ? t.nav.musicPauseLabel : t.nav.musicPlayLabel;
  const ariaLabel = isPlaying ? t.nav.musicPauseAria : t.nav.musicPlayAria;

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        autoPlay
        loop
        playsInline
        preload="auto"
        data-testid="background-music-audio"
        onPlay={() => updateStatus("playing")}
        onPause={() => {
          if (statusRef.current === "playing") {
            updateStatus("paused");
          }
        }}
      />

      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-label={ariaLabel}
        aria-pressed={isPlaying}
        title={ariaLabel}
        data-testid="music-toggle-button"
        data-state={status}
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.82, y: 14 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.05 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
        transition={SPRING_SNAPPY}
        className={`fixed z-30 start-4 bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:bottom-7 md:start-7 inline-flex h-[52px] min-w-[52px] sm:h-12 sm:ps-4 sm:pe-2 items-center justify-center gap-2.5 rounded-full border-[3px] border-[#1B1B1F] text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation select-none transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7AC6]/70 ${
          isPlaying ? "bg-[#6BE3B5]" : "bg-[#FFF6E5]"
        }`}
      >
        {isPlaying ? (
          <Pause
            className="h-[18px] w-[18px] shrink-0 fill-[#1B1B1F]"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        ) : (
          <Play
            className="h-[18px] w-[18px] shrink-0 fill-[#1B1B1F] translate-x-[1px]"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        )}

        <span className="hidden sm:inline font-display text-base tracking-wide whitespace-nowrap">
          {label}
        </span>

        {/* Redesigned concentric dark-ink soundwave capsule with 5 candy-colored waveform bars */}
        <span
          aria-hidden="true"
          dir="ltr"
          data-testid="music-equalizer"
          data-playing={isPlaying ? "true" : "false"}
          className="relative hidden sm:inline-flex items-center justify-center h-8 px-3 gap-[4px] rounded-full bg-[#1B1B1F] shadow-[inset_0_1.5px_0_rgba(255,255,255,0.16)] overflow-hidden shrink-0"
        >
          {/* Subtle oscilloscope center line */}
          <span className="pointer-events-none absolute inset-x-2.5 top-1/2 -translate-y-1/2 h-[1.5px] rounded-full bg-white/15" />

          {VISUALIZER_BARS.map((bar, index) => {
            const shouldAnimate = isPlaying && !prefersReducedMotion;
            return (
              <span
                key={bar.animClass}
                data-testid={`eq-bar-${index}`}
                className={`relative z-10 w-[3.5px] h-[18px] rounded-full eq-wave-bar ${
                  shouldAnimate ? bar.animClass : ""
                }`}
                style={{
                  backgroundColor: bar.color,
                  boxShadow: isPlaying ? `0 0 6px ${bar.color}55` : "none",
                  opacity: isPlaying ? 1 : 0.65,
                  transform: shouldAnimate
                    ? undefined
                    : `scaleY(${isPlaying ? bar.staticScale : 0.2})`,
                }}
              />
            );
          })}
        </span>
      </motion.button>
    </>
  );
}
