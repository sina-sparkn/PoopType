import type { PoopTypeCode } from "@/lib/types-data";

export type Language = "en" | "fa";

export interface LocalizedAxis {
  axis: 1 | 2 | 3 | 4;
  name: string;
  measure: string;
  left: {
    letter: string;
    label: string;
    summary: string;
  };
  right: {
    letter: string;
    label: string;
    summary: string;
  };
}

export interface LocalizedPoopType {
  nickname: string;
  blurb: string;
  strengths: [string, string];
  flaws: [string, string];
  famousFor: string;
  moodLabel: string;
  moodNote: string;
  styleLabel: string;
  styleNote: string;
}

export interface LocalizedBristol {
  name: string;
  shortLabel: string;
  traitNote: string;
}

export interface LocalizedScienceStudy {
  id: string;
  badgeColor: string;
  statChip: string;
  headline: string;
  citation: string;
  details: string;
}

export interface LocalizedFaqItem {
  id: string;
  emoji: string;
  badgeColor: string;
  question: string;
  answer: string;
}

export interface TranslationDictionary {
  lang: Language;
  dir: "ltr" | "rtl";
  brandName: string;
  switcherLabel: string;
  switcherAria: string;
  nav: {
    analyze: string;
    types: string;
    typesShort: string;
    science: string;
    ctaPhoto: string;
    mobilePrivacyChip: string;
    openCameraAria: string;
    primaryNavAria: string;
    mobileNavAria: string;
    backToTopLabel: string;
    backToTopAria: string;
    musicPlayLabel: string;
    musicPauseLabel: string;
    musicPlayAria: string;
    musicPauseAria: string;
  };
  footer: {
    disclaimer: string;
    privacy: string;
    navAria: string;
    linkAnalyzer: string;
    linkTypes: string;
    linkScience: string;
  };
  home: {
    badge: string;
    heroTitleBefore: string;
    heroTitleHighlight: string;
    heroTitleAfter: string;
    heroSubtitle: string;
    heroStickers: [string, string, string, string];
    ctaStart: string;
    ctaTypes: string;
    mascotBubble: string;
    mascotBadge1: string;
    mascotBadge2: string;
    mascotAlt: string;
    marqueeAria: string;
    marqueeHeadlines: string[];
    samplesBadge: string;
    samplesTitle: string;
    samplesSubtitle: string;
    openReportCta: string;
    axesBadge: string;
    axesTitle: string;
    axesSubtitle: string;
    axisPrefix: string;
    faq: {
      badge: string;
      title: string;
      subtitle: string;
      expandAll: string;
      collapseAll: string;
      items: LocalizedFaqItem[];
    };
    scienceBadge: string;
    scienceTitle: string;
    scienceBody: string;
    scienceCta: string;
  };
  analyzer: {
    badge: string;
    title: string;
    meterLabel: string;
    meterValue: string; // "{count} / {max} photos"
    bubbleDragging: string;
    bubbleHasPhotos: string; // "{count}" & "{max}"
    bubbleEmpty: string;
    mascotAlt: string;
    dropHintDragging: string;
    dropHintIdle: string;
    fileRules: string;
    takePhoto: string;
    chooseGallery: string;
    privacyHeadline: string;
    privacyBody: string;
    queuedTitle: string; // "{count}"
    clearAll: string;
    removePhotoAria: string; // "{name}"
    queuedAlt: string; // "{index}" & "{name}"
    samePhotoHint: string;
    btnIdle: string;
    btnAnalyzing: string;
    btnOpening: string;
    errNoPhotos: string;
    errFull: string; // "{max}"
    errOnlyFirst: string; // "{max}"
    errBadFormat: string;
    errTooLarge: string;
    errGeneric: string;
    loadingBadge: string;
    loadingMessages: [string, string, string, string];
    loadingFooter: string;
  };
  camera: {
    title: string;
    closeAria: string;
    startingTitle: string;
    startingBody: string;
    errorTitle: string;
    privacyNote: string;
    retry: string;
    flip: string;
    snap: string;
    saving: string;
    chooseGallery: string;
    errNoApi: string;
    errPermission: string;
    errNotFound: string;
    errBusy: string;
    errSecurity: string;
    errGeneric: string;
    errCanvas: string;
    errEncode: string;
  };
  typesPage: {
    badge1: string;
    badge2: string;
    titleBefore: string;
    titleHighlight: string;
    subtitle: string;
    filterBadge: string;
    showingCount: string; // "{count}"
    resetAll: string;
    filterAll: string;
    hint: string;
    tapToFlip: string;
    cardAria: string; // "{code}" "{nickname}" "{mood}"
    modalCloseAria: string; // "{code}"
    matchLabel: string;
    clashLabel: string;
    strengthsTitle: string;
    flawsTitle: string;
    fullDossier: string;
  };
  result: {
    drumrollTitle: string;
    drumrollBody: string;
    skipReveal: string;
    tilesBadge: string;
    tilesFooter: string;
    vibeAlertTitle: string;
    vibeAlertBody: string;
    vibeAlertAria: string;
    photoCountSingle: string;
    photoCountPlural: string; // "{count}"
    codeIdLabel: string;
    confidenceLabel: string; // "{pct}"
    bristolBadge: string;
    moodBadge: string;
    styleBadge: string;
    bigFiveTitle: string;
    bigFiveBadge: string;
    bigFive: Record<
      "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "neuroticism",
      { label: string; note: string }
    >;
    strengthsTitle: string;
    flawsTitle: string;
    famousBadge: string;
    matchesTitle: string;
    bestMatch: string;
    worstMatch: string;
    shareBadge: string;
    shareTitle: string;
    shareBody: string;
    includePhotosTitle: string;
    includePhotosReady: string; // "{count}"
    includePhotosUnavailable: string;
    btnShare: string;
    btnCopy: string;
    btnDownload: string;
    btnTryAgain: string;
    feedbackCopied: string;
    feedbackCopyFallback: string; // "{url}"
    feedbackShared: string;
    feedbackDownloaded: string;
    shareNativeTitle: string; // "{code}" "{nickname}"
    shareNativeText: string; // "{code}" "{nickname}" "{pct}"
    drawingCard: string;
    cardImgAlt: string; // "{code}" "{nickname}"
  };
  shareCard: {
    headerPill: string;
    confidencePill: string; // "{pct}"
    badgeBristol: string;
    badgeMood: string;
    badgeStyle: string;
    bigFiveHeading: string;
    photosHeading: string;
    bestMatch: string;
    worstMatch: string;
    footer: string;
  };
  science: {
    badge1: string;
    badge2: string;
    titleBefore: string;
    titleHighlight: string;
    shortVersionLead: string;
    shortVersionBeforeNot: string;
    shortVersionNot: string;
    shortVersionAfterNot: string;
    mascotBubble: string;
    mascotAlt: string;
    sectionsAria: string;
    jumpLinks: Array<{ href: string; label: string }>;
    factMythSr: string;
    factBadge: string;
    factTitle: string;
    factBody: string;
    mythBadge: string;
    mythTitle: string;
    mythBody: string;
    panel1Badge: string;
    panel1Title: string;
    panel1IntroBefore: string;
    panel1IntroBold: string;
    panel1IntroAfter: string;
    humorCards: Array<{ name: string; color: string; summary: string }>;
    freudTitle: string;
    freudLeftTitle: string;
    freudLeftBody: string;
    freudRightTitle: string;
    freudRightBody: string;
    freudNote: string;
    panel2Badge: string;
    panel2Title: string;
    panel2IntroBefore: string;
    panel2IntroBold: string;
    panel2IntroAfter: string;
    colorGuide: Array<{ swatch: string; label: string; meaning: string }>;
    bristolTitle: string;
    bristolBuckets: Array<{ range: string; label: string; bg: string }>;
    bristolChips: [string, string, string];
    panel3Badge: string;
    panel3Title: string;
    panel3IntroBefore: string;
    panel3IntroBold: string;
    panel3IntroAfter: string;
    panel4Badge: string;
    panel4Title: string;
    panel4IntroBefore: string;
    panel4IntroBold: string;
    panel4IntroAfter: string;
    takeawayBadge: string;
    takeawayTitle: string;
    takeawayItems: Array<{ icon: string; lead: string; body: string }>;
    ctaAnalyzer: string;
    ctaTypes: string;
    studyCountSingle: string;
    studyCountPlural: string; // "{count}"
    expandAll: string;
    collapseAll: string;
    studies: {
      history: LocalizedScienceStudy[];
      bristol: LocalizedScienceStudy[];
      microbiome: LocalizedScienceStudy[];
      ibs: LocalizedScienceStudy[];
    };
  };
  axes: [LocalizedAxis, LocalizedAxis, LocalizedAxis, LocalizedAxis];
  bristol: Record<number, LocalizedBristol>;
  types: Record<PoopTypeCode, LocalizedPoopType>;
}
