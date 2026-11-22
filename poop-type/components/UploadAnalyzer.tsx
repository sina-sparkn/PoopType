"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import {
  analyzeFilesInBrowser,
  MAX_FILES,
  PortfolioAnalysisResult,
  validateFileMeta,
} from "@/lib/analyze";
import {
  AnalysisPhase,
  analysisPhaseReducer,
  buildResultHref,
  getAnalyzeButtonState,
  INITIAL_ANALYSIS_PHASE_STATE,
} from "@/lib/analysis-phase";
import { saveSessionAnalysis } from "@/lib/session-store";
import { POLAROID_TILTS } from "@/lib/theme";
import { PoopMascot } from "@/components/mascot/PoopMascot";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Meter } from "@/components/ui/Meter";
import { Sticker } from "@/components/ui/Sticker";
import { CameraCaptureModal } from "@/components/CameraCaptureModal";
import {
  FOCUS_ANALYZER_EVENT,
  OPEN_UPLOAD_EVENT,
} from "@/components/layout/BottomTabBar";
import { useLanguage } from "@/components/LanguageProvider";
import { formatTemplate } from "@/lib/i18n";
import { playKawaiiSfx } from "@/lib/kawaii-sfx";

interface QueuedSpecimen {
  id: string;
  file: File;
  previewUrl: string;
}

const LOADING_DURATION_MS = 3000;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export interface AnalysisPhaseContextValue {
  phase: AnalysisPhase;
  isAnalyzing: boolean;
  error: string | null;
  lastResult: PortfolioAnalysisResult | null;
  resultHref: string | null;
  loadingMsgIndex: number;
  loadingMessage: string;
  runAnalysis: (files: File[]) => Promise<void>;
  resetAnalysis: () => void;
}

export const AnalysisPhaseContext =
  createContext<AnalysisPhaseContextValue | null>(null);

export function useAnalysisPhaseState(): AnalysisPhaseContextValue {
  const router = useRouter();
  const { t } = useLanguage();
  const loadingMessages = t.analyzer.loadingMessages;
  const [state, dispatch] = useReducer(
    analysisPhaseReducer,
    INITIAL_ANALYSIS_PHASE_STATE
  );
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const inFlightRef = useRef(false);

  const isAnalyzing =
    state.phase === "analyzing" || state.phase === "navigating";

  // Rotate friendly messages while checking photos
  useEffect(() => {
    if (!isAnalyzing) {
      return;
    }
    const interval = window.setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 750);
    return () => window.clearInterval(interval);
  }, [isAnalyzing, loadingMessages.length]);

  const resetAnalysis = useCallback(() => {
    inFlightRef.current = false;
    dispatch({ type: "RESET" });
  }, []);

  const runAnalysis = useCallback(
    async (files: File[]) => {
      if (inFlightRef.current) {
        return;
      }
      if (files.length === 0) {
        dispatch({
          type: "FAIL",
          error: t.analyzer.errNoPhotos,
        });
        return;
      }

      inFlightRef.current = true;
      setLoadingMsgIndex(0);
      dispatch({ type: "START" });
      const startTime = Date.now();

      try {
        const { result, sanitizedPreviews } = await analyzeFilesInBrowser(files);

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, LOADING_DURATION_MS - elapsed);
        if (remaining > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, remaining));
        }

        const resultHref = buildResultHref(result);
        // Persist sanitized previews + structured result in ephemeral session memory
        // and pass deterministic metrics through the locked URL query param scheme.
        saveSessionAnalysis(result, sanitizedPreviews);
        dispatch({ type: "SUCCEED", result, resultHref });
        router.push(resultHref);
      } catch (err) {
        inFlightRef.current = false;
        dispatch({
          type: "FAIL",
          error:
            err instanceof Error && t.lang === "en"
              ? err.message
              : t.analyzer.errGeneric,
        });
      }
    },
    [router, t.analyzer.errGeneric, t.analyzer.errNoPhotos, t.lang]
  );

  return useMemo(
    () => ({
      phase: state.phase,
      isAnalyzing,
      error: state.error,
      lastResult: state.lastResult,
      resultHref: state.resultHref,
      loadingMsgIndex,
      loadingMessage: loadingMessages[loadingMsgIndex % loadingMessages.length],
      runAnalysis,
      resetAnalysis,
    }),
    [
      state.phase,
      state.error,
      state.lastResult,
      state.resultHref,
      isAnalyzing,
      loadingMsgIndex,
      loadingMessages,
      runAnalysis,
      resetAnalysis,
    ]
  );
}

export function AnalysisPhaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useAnalysisPhaseState();
  return (
    <AnalysisPhaseContext.Provider value={value}>
      {children}
    </AnalysisPhaseContext.Provider>
  );
}

export function useAnalysisPhase(): AnalysisPhaseContextValue {
  const ctx = useContext(AnalysisPhaseContext);
  if (!ctx) {
    throw new Error(
      "useAnalysisPhase must be used within an AnalysisPhaseProvider."
    );
  }
  return ctx;
}

export function UploadAnalyzer() {
  return (
    <AnalysisPhaseProvider>
      <UploadAnalyzerContent />
    </AnalysisPhaseProvider>
  );
}

function UploadAnalyzerContent() {
  const { t } = useLanguage();
  const an = t.analyzer;
  const {
    phase,
    isAnalyzing,
    error: analysisError,
    loadingMsgIndex,
    loadingMessage,
    runAnalysis,
    resetAnalysis,
  } = useAnalysisPhase();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragDepthRef = useRef(0);
  const dropzoneControls = useAnimationControls();

  const [specimens, setSpecimens] = useState<QueuedSpecimen[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const triggerWiggle = useCallback(() => {
    void dropzoneControls.start({
      rotate: [0, -2.5, 2.5, -1.5, 1.5, 0],
      scale: [1, 1.02, 1],
      transition: { duration: 0.4 },
    });
  }, [dropzoneControls]);

  // Track specimens in ref for safe unmount revocation
  const specimensRef = useRef<QueuedSpecimen[]>([]);
  useEffect(() => {
    specimensRef.current = specimens;
  }, [specimens]);

  useEffect(() => {
    return () => {
      for (const item of specimensRef.current) {
        URL.revokeObjectURL(item.previewUrl);
      }
    };
  }, []);

  // Listen for raised center camera button / hero CTA jump events and route arrival (?upload=1 / #analyzer)
  useEffect(() => {
    const onOpenUpload = () => {
      triggerWiggle();
      setIsCameraOpen(true);
    };
    const onFocusAnalyzer = () => {
      triggerWiggle();
    };
    window.addEventListener(OPEN_UPLOAD_EVENT, onOpenUpload);
    window.addEventListener(FOCUS_ANALYZER_EVENT, onFocusAnalyzer);

    // Handle cross-route arrival from BottomTabBar (/?upload=1#analyzer) or Header (/#analyzer)
    const params = new URLSearchParams(window.location.search);
    const wantsUpload = params.get("upload") === "1";
    const wantsAnalyzerHash = window.location.hash === "#analyzer";

    let scrollTimer: number | undefined;
    if (wantsUpload || wantsAnalyzerHash) {
      scrollTimer = window.setTimeout(() => {
        const el = document.getElementById("analyzer");
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        el?.scrollIntoView({
          behavior: prefersReduced ? "auto" : "smooth",
          block: "start",
        });
        triggerWiggle();
        if (wantsUpload) {
          setIsCameraOpen(true);
          // Clean up ?upload=1 query param while keeping #analyzer hash
          window.history.replaceState(null, "", "/#analyzer");
        }
      }, 80);
    }

    return () => {
      window.removeEventListener(OPEN_UPLOAD_EVENT, onOpenUpload);
      window.removeEventListener(FOCUS_ANALYZER_EVENT, onFocusAnalyzer);
      if (scrollTimer !== undefined) {
        window.clearTimeout(scrollTimer);
      }
    };
  }, [triggerWiggle]);

  const addFiles = useCallback(
    (incomingList: FileList | File[]) => {
      const incoming = Array.from(incomingList);
      if (incoming.length === 0) return;

      setValidationError(null);
      if (phase === "error") {
        resetAnalysis();
      }

      const current = specimensRef.current;
      const remainingSlots = MAX_FILES - current.length;
      if (remainingSlots <= 0) {
        setValidationError(formatTemplate(an.errFull, { max: MAX_FILES }));
        return;
      }

      const accepted: QueuedSpecimen[] = [];
      const errors: string[] = [];

      for (const file of incoming) {
        if (accepted.length >= remainingSlots) {
          errors.push(formatTemplate(an.errOnlyFirst, { max: MAX_FILES }));
          break;
        }
        const err = validateFileMeta(file);
        if (err) {
          errors.push(
            err.toLowerCase().includes("mb") || err.toLowerCase().includes("size")
              ? an.errTooLarge
              : an.errBadFormat
          );
          continue;
        }
        accepted.push({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }

      if (errors.length > 0) {
        setValidationError(errors[0]);
      }

      if (accepted.length > 0) {
        const next = [...current, ...accepted];
        specimensRef.current = next;
        setSpecimens(next);
        playKawaiiSfx("photoAdd");
        triggerWiggle();
      }
    },
    [an.errBadFormat, an.errFull, an.errOnlyFirst, an.errTooLarge, phase, resetAnalysis, triggerWiggle]
  );

  // Allow pasting an image from the clipboard directly into the lab tray
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (isAnalyzing) return;
      const items = e.clipboardData?.items;
      if (!items || items.length === 0) return;
      const pastedFiles: File[] = [];
      for (const item of Array.from(items)) {
        if (item.kind === "file") {
          const f = item.getAsFile();
          if (f) pastedFiles.push(f);
        }
      }
      if (pastedFiles.length > 0) {
        addFiles(pastedFiles);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addFiles, isAnalyzing]);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const files = input.files ? Array.from(input.files) : [];
      if (files.length > 0) {
        addFiles(files);
      }
      // Reset AFTER reading & creating object URLs so WebKit never invalidates the File list
      input.value = "";
    },
    [addFiles]
  );

  const handleRemove = useCallback(
    (id: string) => {
      if (isAnalyzing) return;
      setValidationError(null);
      if (phase === "error") {
        resetAnalysis();
      }
      const current = specimensRef.current;
      const target = current.find((s) => s.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      const next = current.filter((s) => s.id !== id);
      specimensRef.current = next;
      setSpecimens(next);
      playKawaiiSfx("photoRemove");
    },
    [isAnalyzing, phase, resetAnalysis]
  );

  const handleClearAll = useCallback(() => {
    if (isAnalyzing) return;
    setValidationError(null);
    if (phase === "error") {
      resetAnalysis();
    }
    for (const s of specimensRef.current) {
      URL.revokeObjectURL(s.previewUrl);
    }
    specimensRef.current = [];
    setSpecimens([]);
    playKawaiiSfx("photoRemove");
  }, [isAnalyzing, phase, resetAnalysis]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current += 1;
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragDepthRef.current = 0;
      setIsDragging(false);
      if (isAnalyzing) return;

      const droppedFiles: File[] = [];
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        droppedFiles.push(...Array.from(e.dataTransfer.files));
      } else if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        for (const item of Array.from(e.dataTransfer.items)) {
          if (item.kind === "file") {
            const f = item.getAsFile();
            if (f) droppedFiles.push(f);
          }
        }
      }

      if (droppedFiles.length > 0) {
        addFiles(droppedFiles);
      }
    },
    [addFiles, isAnalyzing]
  );

  const handleAnalyze = useCallback(() => {
    setValidationError(null);
    void runAnalysis(specimens.map((s) => s.file));
  }, [runAnalysis, specimens]);

  const errorMessage = validationError ?? analysisError;
  const buttonState = getAnalyzeButtonState(phase, specimens.length);
  const localizedButtonLabel =
    phase === "analyzing"
      ? an.btnAnalyzing
      : phase === "navigating"
      ? an.btnOpening
      : an.btnIdle;
  const queuePercent = Math.round((specimens.length / MAX_FILES) * 100);

  return (
    <>
      <Card
        id="analyzer"
        as="section"
        color="mint"
        padding="lg"
        shadow="lg"
        aria-labelledby="analyzer-heading"
        className="scroll-mt-24"
      >
        {/* Header + Queue Progress Meter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Sticker color="sunshine" tilt="left" size="sm">
              <span aria-hidden="true">🔒</span> {an.badge}
            </Sticker>
            <h2
              id="analyzer-heading"
              className="mt-2 font-display text-3xl sm:text-4xl text-[#1B1B1F]"
            >
              {an.title}
            </h2>
          </div>

          <div className="w-full sm:w-72">
            <Meter
              value={queuePercent}
              color="sunshine"
              label={an.meterLabel}
              valueText={formatTemplate(an.meterValue, {
                count: specimens.length,
                max: MAX_FILES,
              })}
            />
          </div>
        </div>

        {/* Thick dashed cartoon dropzone with mascot + speech bubble */}
        <motion.div
          animate={dropzoneControls}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-testid="specimen-dropzone"
          className={`mt-5 rounded-[22px] border-[3px] border-dashed border-[#1B1B1F] p-5 sm:p-7 text-center transition-colors duration-150 ${
            isDragging
              ? "bg-[#FFD93D] shadow-[4px_4px_0_#1B1B1F]"
              : "bg-[#FFF6E5] hover:bg-[#FFFDF7]"
          }`}
        >
          {/* Speech bubble + mascot */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2 inline-block rounded-2xl border-[3px] border-[#1B1B1F] bg-white px-4 py-2 font-display text-lg sm:text-xl text-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F]">
              {isDragging
                ? an.bubbleDragging
                : specimens.length > 0
                ? formatTemplate(an.bubbleHasPhotos, {
                    count: specimens.length,
                    max: MAX_FILES,
                  })
                : an.bubbleEmpty}
              <span
                aria-hidden="true"
                className="absolute -bottom-2.5 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-[3px] border-r-[3px] border-[#1B1B1F] bg-white"
              />
            </div>

            <PoopMascot
              mood={isDragging ? "excited" : "idle"}
              size={112}
              label={an.mascotAlt}
            />
          </div>

          <p className="mt-2 text-base font-bold text-[#1B1B1F]">
            {isDragging ? an.dropHintDragging : an.dropHintIdle}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#1B1B1F]/80">
            {an.fileRules}
          </p>

          {/* Big thumb-friendly camera + gallery pill controls */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-lg mx-auto">
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={() => {
                playKawaiiSfx("pop");
                setValidationError(null);
                setIsCameraOpen(true);
              }}
              data-testid="take-photo-btn"
              className="relative inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full border-[3px] border-[#1B1B1F] bg-[#FF7AC6] px-7 py-3 font-display text-lg sm:text-xl tracking-wide text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation select-none whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span aria-hidden="true">📸</span>
              <span>{an.takePhoto}</span>
            </button>

            <label
              htmlFor="specimen-file-input"
              data-testid="choose-gallery-btn"
              className="relative inline-flex min-h-[54px] w-full items-center justify-center gap-2 overflow-hidden rounded-full border-[3px] border-[#1B1B1F] bg-[#5CC8FF] px-7 py-3 font-display text-lg sm:text-xl tracking-wide text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation select-none whitespace-nowrap focus-within:outline focus-within:outline-4 focus-within:outline-[#1B1B1F] focus-within:outline-offset-[3px]"
            >
              <input
                ref={fileInputRef}
                id="specimen-file-input"
                type="file"
                accept="image/*,.heic,.heif"
                multiple
                disabled={isAnalyzing}
                onClick={(e) => {
                  e.currentTarget.value = "";
                }}
                onChange={handleFileInputChange}
                aria-label={an.chooseGallery}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 file:h-full file:w-full file:cursor-pointer"
              />
              <span aria-hidden="true" className="pointer-events-none">
                🖼️
              </span>
              <span className="pointer-events-none">{an.chooseGallery}</span>
            </label>
          </div>
        </motion.div>

        {/* Mandatory privacy notice with shy mascot */}
        <div className="mt-5 flex flex-col gap-3 rounded-[20px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-4 shadow-[4px_4px_0_#1B1B1F] sm:flex-row sm:items-center">
          <PoopMascot
            mood="shy"
            code="PPTO"
            size={60}
            animated={false}
            className="mx-auto sm:mx-0"
          />
          <div className="text-center sm:text-start">
            <p className="font-display text-lg text-[#1B1B1F]">
              {an.privacyHeadline}
            </p>
            <p className="mt-0.5 text-sm sm:text-base font-semibold text-[#1B1B1F]/85">
              {an.privacyBody}
            </p>
          </div>
        </div>

        {/* Validation alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-4 rounded-[18px] border-[3px] border-[#1B1B1F] bg-[#FF9F43] px-4 py-3 text-base font-extrabold text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F]"
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Polaroid-style previews with slight tilts */}
        {specimens.length > 0 && (
          <div className="mt-6 rounded-[20px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-4 sm:p-5 shadow-[4px_4px_0_#1B1B1F]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl text-[#1B1B1F]">
                {formatTemplate(an.queuedTitle, { count: specimens.length })}
              </h3>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={isAnalyzing}
                className="inline-flex min-h-[44px] items-center rounded-full border-[2.5px] border-[#1B1B1F] bg-[#FF7AC6] px-4 py-1 text-sm font-extrabold text-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F] sticker-press disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {an.clearAll}
              </button>
            </div>

            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {specimens.map((item, idx) => (
                <li
                  key={item.id}
                  className={`relative rounded-[16px] border-[3px] border-[#1B1B1F] bg-white p-2 pb-3 shadow-[4px_4px_0_#1B1B1F] transition-transform hover:rotate-0 ${
                    POLAROID_TILTS[idx % POLAROID_TILTS.length]
                  }`}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-[10px] border-2 border-[#1B1B1F] bg-[#FFF6E5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={formatTemplate(an.queuedAlt, {
                        index: idx + 1,
                        name: item.file.name,
                      })}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    disabled={isAnalyzing}
                    aria-label={formatTemplate(an.removePhotoAria, {
                      name: item.file.name,
                    })}
                    className="absolute -end-2.5 -top-2.5 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#1B1B1F] bg-[#FF7AC6] text-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F] sticker-press disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <p className="mt-2 truncate text-sm font-extrabold text-[#1B1B1F]">
                    {item.file.name}
                  </p>
                  <p className="text-xs font-bold text-[#1B1B1F]/70 tabular-nums">
                    {formatBytes(item.file.size)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Primary Analyze CTA reachable at bottom */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm sm:text-base font-bold text-[#1B1B1F]">
            {an.samePhotoHint}
          </p>
          <Button
            color="sunshine"
            size="lg"
            sfx="sparkle"
            onClick={handleAnalyze}
            disabled={buttonState.disabled}
            aria-busy={buttonState.isLoading}
            data-testid="analyze-submit-btn"
            data-state={buttonState.dataState}
            data-analysis-phase={phase}
            className="w-full sm:w-auto"
          >
            {buttonState.isLoading && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1B1B1F"
                strokeWidth="3"
                strokeLinecap="round"
                aria-hidden="true"
                className="animate-spin shrink-0"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            <span>{localizedButtonLabel}</span>
          </Button>
        </div>
      </Card>

      {/* Full-Screen Cartoon Flush Loading Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            key="flush-loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col items-center justify-center bg-[#5CC8FF] px-5 text-center"
          >
            {/* Cartoon Flush Swirl Background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-45"
            >
              <svg
                width="560"
                height="560"
                viewBox="0 0 400 400"
                className="animate-flush-spin max-w-[95vw] h-auto"
              >
                <circle
                  cx="200"
                  cy="200"
                  r="170"
                  fill="none"
                  stroke="#FFF6E5"
                  strokeWidth="14"
                  strokeDasharray="60 36"
                  strokeLinecap="round"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="122"
                  fill="none"
                  stroke="#FFD93D"
                  strokeWidth="12"
                  strokeDasharray="45 30"
                  strokeLinecap="round"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="76"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="10"
                  strokeDasharray="30 24"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="relative z-10 flex w-full max-w-md flex-col items-center">
              <Sticker color="sunshine" tilt="left" className="mb-4">
                {an.loadingBadge}
              </Sticker>

              {/* Speech bubble cycling friendly messages */}
              <div className="relative mb-3 min-h-[76px] w-full rounded-[24px] border-[3px] border-[#1B1B1F] bg-white px-6 py-4 shadow-[6px_6px_0_#1B1B1F] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMsgIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="font-display text-2xl sm:text-3xl text-[#1B1B1F]"
                  >
                    {loadingMessage}
                  </motion.p>
                </AnimatePresence>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-3 left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 border-b-[3px] border-r-[3px] border-[#1B1B1F] bg-white"
                />
              </div>

              <PoopMascot mood="thinking" size={160} />

              <div className="mt-5 h-7 w-full overflow-hidden rounded-full border-[3px] border-[#1B1B1F] bg-[#FFF6E5] shadow-[4px_4px_0_#1B1B1F]">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2.9, ease: "easeInOut" }}
                  style={{ transformOrigin: "left center" }}
                  className="h-full w-full bg-[#FF7AC6] border-r-[3px] border-[#1B1B1F]"
                />
              </div>

              <p className="mt-4 rounded-full border-[2.5px] border-[#1B1B1F] bg-[#FFF6E5] px-4 py-1.5 text-sm font-extrabold text-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F]">
                {an.loadingFooter}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Live In-Browser Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file) => addFiles([file])}
        onFallbackFileSelect={(files) => addFiles(files)}
      />
    </>
  );
}
