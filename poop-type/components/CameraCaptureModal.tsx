"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PoopMascot } from "@/components/mascot/PoopMascot";
import { useLanguage } from "@/components/LanguageProvider";
import type { TranslationDictionary } from "@/lib/i18n";

export interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  onFallbackFileSelect: (files: File[]) => void;
}

type CameraStatus = "starting" | "ready" | "capturing" | "error";

function describeCameraError(
  err: unknown,
  cam: TranslationDictionary["camera"]
): string {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return cam.errNoApi;
  }
  const name = err instanceof DOMException || err instanceof Error ? err.name : "";
  switch (name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return cam.errPermission;
    case "NotFoundError":
    case "DevicesNotFoundError":
      return cam.errNotFound;
    case "NotReadableError":
    case "TrackStartError":
      return cam.errBusy;
    case "SecurityError":
      return cam.errSecurity;
    default:
      return cam.errGeneric;
  }
}

export function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  onFallbackFileSelect,
}: CameraCaptureModalProps) {
  const { t } = useLanguage();
  const cam = t.camera;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  );
  const [status, setStatus] = useState<CameraStatus>("starting");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const stopStream = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    stopStream();
    onClose();
  }, [onClose, stopStream]);

  // Close on Escape key & prevent background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleClose, isOpen]);

  // Start / restart camera stream whenever modal opens, facingMode changes, or user retries
  useEffect(() => {
    if (!isOpen) {
      stopStream();
      return;
    }

    let cancelled = false;

    async function startCamera() {
      stopStream();
      setStatus("starting");
      setErrorText(null);

      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices ||
        typeof navigator.mediaDevices.getUserMedia !== "function"
      ) {
        if (!cancelled) {
          setStatus("error");
          setErrorText(describeCameraError(null, cam));
        }
        return;
      }

      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1280 },
              height: { ideal: 960 },
            },
            audio: false,
          });
        } catch (firstErr) {
          const errName = firstErr instanceof Error ? firstErr.name : "";
          // Don't retry if the user explicitly denied permission
          if (
            errName === "NotAllowedError" ||
            errName === "PermissionDeniedError" ||
            errName === "SecurityError"
          ) {
            throw firstErr;
          }
          // Fallback to generic default video device (works on desktop webcams)
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        if (cancelled) {
          for (const track of stream.getTracks()) {
            track.stop();
          }
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          try {
            await video.play();
          } catch {
            // Some browsers auto-play once metadata loads
          }
        }

        if (!cancelled) {
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setErrorText(describeCameraError(err, cam));
        }
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [cam, facingMode, isOpen, retryCount, stopStream]);

  const handleSnap = useCallback(async () => {
    const video = videoRef.current;
    if (!video || status !== "ready") return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    if (width === 0 || height === 0) return;

    setStatus("capturing");

    try {
      // Draw directly onto a fresh local canvas (zero EXIF/GPS metadata)
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error(cam.errCanvas);
      }
      ctx.drawImage(video, 0, 0, width, height);

      const blob: Blob | null = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9);
      });

      if (!blob) {
        throw new Error(cam.errEncode);
      }

      const file = new File([blob], `camera-specimen-${Date.now()}.jpg`, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      stopStream();
      onCapture(file);
      onClose();
    } catch (err) {
      setStatus("error");
      setErrorText(err instanceof Error ? err.message : cam.errGeneric);
    }
  }, [cam.errCanvas, cam.errEncode, cam.errGeneric, onCapture, onClose, status, stopStream]);

  const handleFlipCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  }, []);

  const handleFallbackInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const files = input.files ? Array.from(input.files) : [];
      if (files.length > 0) {
        stopStream();
        onFallbackFileSelect(files);
        onClose();
      }
      input.value = "";
    },
    [onClose, onFallbackFileSelect, stopStream]
  );

  if (!isClient) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="camera-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B1B1F]/75 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="camera-modal-title"
            data-testid="camera-capture-modal"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-[26px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] shadow-[8px_8px_0_#1B1B1F]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b-[3px] border-[#1B1B1F] bg-[#FF7AC6] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="text-xl">
                  📸
                </span>
                <h3
                  id="camera-modal-title"
                  className="font-display text-xl sm:text-2xl text-[#1B1B1F]"
                >
                  {cam.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label={cam.closeAria}
                data-testid="camera-close-btn"
                className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#1B1B1F] bg-[#FFF6E5] text-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1B1B1F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Live Viewfinder or Error/Loading State */}
            <div className="p-4 sm:p-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] border-[3px] border-[#1B1B1F] bg-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  data-testid="camera-video"
                  className={`h-full w-full object-cover ${
                    status === "error" ? "hidden" : "block"
                  }`}
                />

                {status === "starting" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#5CC8FF] p-5 text-center">
                    <PoopMascot mood="thinking" size={92} />
                    <p className="mt-2 font-display text-xl text-[#1B1B1F]">
                      {cam.startingTitle}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#1B1B1F]/85">
                      {cam.startingBody}
                    </p>
                  </div>
                )}

                {status === "error" && (
                  <div
                    role="alert"
                    data-testid="camera-error-alert"
                    className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFD93D] p-5 text-center"
                  >
                    <PoopMascot mood="shy" size={84} animated={false} />
                    <p className="mt-2 font-display text-xl text-[#1B1B1F]">
                      {cam.errorTitle}
                    </p>
                    <p className="mt-1.5 max-w-sm text-sm sm:text-base font-bold leading-snug text-[#1B1B1F]">
                      {errorText}
                    </p>
                  </div>
                )}
              </div>

              {/* Privacy note */}
              <p className="mt-3 text-center text-xs sm:text-sm font-extrabold text-[#1B1B1F]/80">
                {cam.privacyNote}
              </p>

              {/* Action Controls */}
              {status === "error" ? (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setRetryCount((c) => c + 1)}
                    data-testid="camera-retry-btn"
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-[3px] border-[#1B1B1F] bg-[#FFD93D] px-5 py-2.5 font-display text-lg text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation"
                  >
                    🔄 {cam.retry}
                  </button>
                  <label
                    data-testid="camera-fallback-upload-btn"
                    className="relative inline-flex min-h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-full border-[3px] border-[#1B1B1F] bg-[#5CC8FF] px-5 py-2.5 font-display text-lg text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation"
                  >
                    <input
                      type="file"
                      accept="image/*,.heic,.heif"
                      multiple
                      onChange={handleFallbackInputChange}
                      aria-label={cam.chooseGallery}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 file:h-full file:w-full file:cursor-pointer"
                    />
                    <span className="pointer-events-none">
                      🖼️ {cam.chooseGallery}
                    </span>
                  </label>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleFlipCamera}
                      disabled={status !== "ready"}
                      data-testid="camera-flip-btn"
                      className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-full border-[3px] border-[#1B1B1F] bg-[#5CC8FF] px-5 py-2.5 font-display text-base sm:text-lg text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🔄 {cam.flip}
                    </button>
                    <button
                      type="button"
                      onClick={handleSnap}
                      disabled={status !== "ready"}
                      data-testid="camera-snap-btn"
                      className="inline-flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-full border-[3px] border-[#1B1B1F] bg-[#6BE3B5] px-6 py-3 font-display text-lg sm:text-xl text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span aria-hidden="true">📸</span>
                      <span>
                        {status === "capturing" ? cam.saving : cam.snap}
                      </span>
                    </button>
                  </div>

                  <label
                    data-testid="camera-gallery-btn"
                    className="relative inline-flex min-h-[50px] w-full items-center justify-center gap-2 overflow-hidden rounded-full border-[3px] border-[#1B1B1F] bg-[#FFD93D] px-5 py-2.5 font-display text-base sm:text-lg text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation select-none"
                  >
                    <input
                      type="file"
                      accept="image/*,.heic,.heif"
                      multiple
                      onChange={handleFallbackInputChange}
                      aria-label={cam.chooseGallery}
                      data-testid="camera-gallery-input"
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 file:h-full file:w-full file:cursor-pointer"
                    />
                    <span aria-hidden="true" className="pointer-events-none">
                      🖼️
                    </span>
                    <span className="pointer-events-none">
                      {cam.chooseGallery}
                    </span>
                  </label>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
