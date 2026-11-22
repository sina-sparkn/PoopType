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

const AUDIO_SRC = "/assets/aistudio/main_music_a4aae9ca.m4a";

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
        className={`fixed z-30 start-4 bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:bottom-7 md:start-7 inline-flex h-[52px] min-w-[52px] sm:h-12 sm:px-4 items-center justify-center gap-2 rounded-full border-[3px] border-[#1B1B1F] text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation select-none transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7AC6]/70 ${
          isPlaying ? "bg-[#6BE3B5]" : "bg-[#FFF6E5]"
        }`}
      >
        {isPlaying ? (
          <Pause
            className="h-5 w-5 shrink-0 fill-[#1B1B1F]"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        ) : (
          <Play
            className="h-5 w-5 shrink-0 fill-[#1B1B1F] translate-x-[1px]"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        )}

        <span className="hidden sm:inline font-display text-base tracking-wide">
          {label}
        </span>

        {/* Live animated equalizer bars bouncing up and down while playing */}
        {isPlaying && (
          <span
            aria-hidden="true"
            data-testid="music-equalizer"
            className="hidden sm:inline-flex items-end gap-[2.5px] h-4"
          >
            <motion.span
              className="w-[3px] h-4 rounded-full bg-[#1B1B1F] origin-bottom"
              animate={
                prefersReducedMotion
                  ? { scaleY: 0.55 }
                  : { scaleY: [0.28, 1, 0.42, 0.85, 0.28] }
              }
              transition={{
                type: "tween",
                duration: 0.78,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.span
              className="w-[3px] h-4 rounded-full bg-[#1B1B1F] origin-bottom"
              animate={
                prefersReducedMotion
                  ? { scaleY: 1 }
                  : { scaleY: [0.95, 0.32, 1, 0.48, 0.95] }
              }
              transition={{
                type: "tween",
                duration: 0.62,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.span
              className="w-[3px] h-4 rounded-full bg-[#1B1B1F] origin-bottom"
              animate={
                prefersReducedMotion
                  ? { scaleY: 0.72 }
                  : { scaleY: [0.42, 0.88, 0.28, 1, 0.42] }
              }
              transition={{
                type: "tween",
                duration: 0.88,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </span>
        )}
      </motion.button>
    </>
  );
}
