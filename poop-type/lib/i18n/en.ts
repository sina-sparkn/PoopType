import type { TranslationDictionary } from "./types";

export const EN_DICT: TranslationDictionary = {
  lang: "en",
  dir: "ltr",
  brandName: "PoopType",
  switcherLabel: "فارسی",
  switcherAria: "Switch language to Persian",
  nav: {
    analyze: "Play",
    types: "16 Types",
    typesShort: "Types",
    science: "Real Facts",
    ctaPhoto: "Check a Photo",
    mobilePrivacyChip: "Private on phone",
    openCameraAria: "Open camera to take a photo",
    primaryNavAria: "Main menu",
    mobileNavAria: "Bottom menu",
    backToTopLabel: "Top",
    backToTopAria: "Back to top",
  },
  footer: {
    disclaimer: "Just for fun! Not real doctor or brain advice.",
    privacy:
      "Your photo never leaves your phone or computer. Nothing is uploaded, and secret photo info is erased right here. 🧻✨",
    navAria: "Footer links",
    linkAnalyzer: "Play Game",
    linkTypes: "All 16 Types",
    linkScience: "Real Facts",
  },
  home: {
    badge: "Silly Poop Personality Game!",
    heroTitleBefore: "What's Your ",
    heroTitleHighlight: "PoopType",
    heroTitleAfter: "?",
    heroSubtitle:
      "Pick 1 to 5 photos on your phone to get a funny 4-letter name, a shape score, and a silly personality card. Your photo stays 100% private on your device! 💩✨",
    heroStickers: [
      "🔒 Stays on your phone",
      "🧼 Secret photo info wiped",
      "🎯 Same photo = same card",
      "🤪 100% just for laughs",
    ],
    ctaStart: "Check My Photo!",
    ctaTypes: "Meet All 16 Types",
    mascotBubble: "Real science? Nope! Super fun? YES! ✨",
    mascotBadge1: "16 Fun Cards",
    mascotBadge2: "0% Uploaded",
    mascotAlt: "Happy PoopType mascot",
    marqueeAria: "Funny news ticker",
    marqueeHeadlines: [
      "FUN FACT: EVERYTHING ON THIS GAME IS MADE UP FOR LAUGHS 🤪",
      "SUPER PRIVATE: YOUR PHOTO NEVER LEAVES YOUR PHONE 🔒",
      "16 FUNNY POOP FRIENDS TO COLLECT AND SHARE ✨",
      "SECRET PHOTO INFO LIKE LOCATION IS WIPED RIGHT AWAY 🧼",
      "SHAPE + COLOR + SHINE = A SILLY PERSONALITY CARD 💩",
      "NOT A REAL DOCTOR — JUST BATHROOM COMEDY 🧻",
    ],
    samplesBadge: "Sneak Peek",
    samplesTitle: "Try a Sample Card!",
    samplesSubtitle:
      "Don't want to use a photo yet? Tap one of these two funny cards to see how the game looks!",
    openReportCta: "See {code} Card →",
    axesBadge: "4 Clues · 16 Fun Types",
    axesTitle: "How the Game Picks Your 4 Letters",
    axesSubtitle:
      "Your phone shrinks the photo tiny, checks 4 easy clues, and matches you with a funny character!",
    axisPrefix: "Clue",
    faq: {
      badge: "Curious Minds",
      title: "Frequently Asked Questions",
      subtitle:
        "Want to know how this silly game turns a photo into a cartoon friend? Here's the super easy version!",
      expandAll: "Open all",
      collapseAll: "Close all",
      items: [
        {
          id: "how-it-works",
          emoji: "🔎",
          badgeColor: "#FFD93D",
          question: "How does the game pick my 4 letters?",
          answer:
            "First, your phone shrinks your photo down tiny — like a little sticker! Then it plays a quick game of 'I Spy' and checks 4 easy clues: Is it firm or soft? Are the edges smooth or bumpy? Is the color dark brown or light brown? And is it shiny or matte? Each clue picks 1 letter, and all 4 letters spell your funny PoopType name!",
        },
        {
          id: "same-photo",
          emoji: "🎯",
          badgeColor: "#6BE3B5",
          question: "Why do I always get the exact same card for the same photo?",
          answer:
            "Because the game follows the exact same counting recipe every time, with zero random dice rolling! If you put in the same photo today or next week, your phone counts the exact same colors and shapes and gives you the exact same character card.",
        },
        {
          id: "multiple-photos",
          emoji: "🍓",
          badgeColor: "#FF7AC6",
          question: "What happens if I add more than 1 photo?",
          answer:
            "You can add up to 5 photos at once! Your phone peeks at each photo one by one, blends all their clues together like a smoothie, and picks the funny character card that matches the whole bunch best.",
        },
        {
          id: "privacy",
          emoji: "🔒",
          badgeColor: "#5CC8FF",
          question: "Does anyone else ever see my photo?",
          answer:
            "Nope — never! Everything happens right inside your own phone or computer, and your photo is never sent anywhere on the internet. Even hidden photo tags like the time and place you took it get wiped away right away.",
        },
        {
          id: "yellow-warning",
          emoji: "⚠️",
          badgeColor: "#FF9F43",
          question: "Why does a yellow warning sticker pop up sometimes?",
          answer:
            "If a photo looks super bright red, pitch black, or very pale, a friendly yellow sticker pops up to give you a gentle heads-up. Sometimes it is just from colorful food like beets or berries — but if you keep seeing it in real life, tell a grown-up or a doctor just to be safe!",
        },
        {
          id: "real-personality",
          emoji: "🤪",
          badgeColor: "#B997FF",
          question: "Can a photo really guess my real personality?",
          answer:
            "Haha, nope! This whole game is 100% pretend and made just for laughs. Real doctors say poop only tells you about what you ate, how much water you drank, and how your tummy feels — never who you are inside!",
        },
      ],
    },
    scienceBadge: "Real Doctor Facts",
    scienceTitle: "Wait — what do real doctors say?",
    scienceBody:
      "Spoiler: poop color and shape come from your food, water, and tummy — never your personality! Tap here to read simple, real facts.",
    scienceCta: "Read Real Facts →",
  },
  analyzer: {
    badge: "Private Photo Box",
    title: "Put Your Photo Here!",
    meterLabel: "Photos Ready",
    meterValue: "{count} / {max} photos",
    bubbleDragging: "Yay! Drop it right here! ✨",
    bubbleHasPhotos: "Awesome! {count} ready — add up to {max} or tap Go! 💩",
    bubbleEmpty: "Show me a photo! 💩",
    mascotAlt: "Cute PoopType mascot waiting for a photo",
    dropHintDragging: "Let go to add your photo!",
    dropHintIdle:
      "Take a photo, pick from your phone, or drop a picture right here",
    fileRules: "JPG, PNG, WebP, or HEIC · Up to 8 MB each · 1 to 5 photos",
    takePhoto: "Take photo",
    chooseGallery: "Pick from gallery",
    privacyHeadline:
      "Photos of poop only. No people, faces, or anyone else's private stuff.",
    privacyBody:
      "Your photo never leaves your phone. We shrink it right on your screen and wipe out secret info like time and place before we play! 🔒",
    queuedTitle: "Your Photos ({count}) ✨",
    clearAll: "Remove all",
    removePhotoAria: "Remove {name}",
    queuedAlt: "Photo {index}: {name}",
    samePhotoHint:
      "Fun trick: the exact same photo always gives you the exact same 4-letter card! 🎯",
    btnIdle: "See My PoopType!",
    btnAnalyzing: "Checking...",
    btnOpening: "Opening Card...",
    errNoPhotos: "Add 1 to 5 photos first so we have something to look at!",
    errFull:
      "You already have {max} photos! Remove one if you want to add a new one.",
    errOnlyFirst: "We can only keep the first {max} photos at a time.",
    errBadFormat: "Please pick a regular picture (JPG, PNG, WebP, or HEIC).",
    errTooLarge: "That photo is too big! Please pick one under 8 MB.",
    errGeneric:
      "Oops, we could not read that picture here. Try a JPG, PNG, or WebP photo!",
    loadingBadge: "Checking on your phone 🔬",
    loadingMessages: [
      "Looking at the shape...",
      "Checking the color...",
      "Asking our silly mascot...",
      "Making your fun card...",
    ],
    loadingFooter: "🔒 Nothing uploaded · 100% private on your device",
  },
  camera: {
    title: "Snap a Photo",
    closeAria: "Close camera",
    startingTitle: "Turning on your camera...",
    startingBody: "Tap Allow if your phone asks for camera permission!",
    errorTitle: "Camera Didn't Open",
    privacyNote:
      "🔒 Saved only on your phone · Never uploaded · Location never saved",
    retry: "Try camera again",
    flip: "Flip",
    snap: "Take Photo",
    saving: "Saving...",
    chooseGallery: "Pick from gallery",
    errNoApi:
      "We can't open the live camera right here. You can still pick a photo from your gallery below!",
    errPermission:
      "Camera access was blocked. Allow the camera in your browser and tap Try again, or pick a photo below.",
    errNotFound:
      "We couldn't find a camera on this device. Pick a photo from your gallery below!",
    errBusy:
      "Another app is using your camera right now. Close it and try again, or pick a photo below.",
    errSecurity:
      "The camera needs a safe HTTPS page. You can still pick a photo from your gallery below!",
    errGeneric:
      "The camera couldn't start right now. Tap Try again or pick a photo below!",
    errCanvas: "Oops, we couldn't save that photo right now.",
    errEncode: "Oops, we couldn't turn that snap into a picture.",
  },
  typesPage: {
    badge1: "Fun Card Deck",
    badge2: "16 Funny Characters ✨",
    titleBefore: "Meet All 16 ",
    titleHighlight: "PoopTypes!",
    subtitle:
      "Every mix of Shape, Edges, Color, and Shine gets its own cute cartoon buddy and funny personality card! 💩✨",
    filterBadge: "Pick Clues",
    showingCount: "Showing {count} of 16",
    resetAll: "Show All ↺",
    filterAll: "All",
    hint: "✨ Tap any card to flip it open and meet that buddy!",
    tapToFlip: "Tap to flip",
    cardAria: "{code} {nickname} — {mood}. Tap to flip",
    modalCloseAria: "Close {code} card",
    matchLabel: "Best Pal",
    clashLabel: "Silly Rival",
    strengthsTitle: "Superpowers",
    flawsTitle: "Silly Quirks",
    fullDossier: "See Full Card →",
  },
  result: {
    drumrollTitle: "Drumroll, Please!",
    drumrollBody: "Getting your funny 4-letter PoopType card ready...",
    skipReveal: "Skip wait →",
    tilesBadge: "Your 4 Secret Letters Are... ✨",
    tilesFooter: "Opening your fun card! 🎉",
    vibeAlertTitle: "Friendly Color Heads-Up (Not Doctor Advice)",
    vibeAlertBody:
      "Heads up! This photo looks very red, black, or super pale. Sometimes that's just food (like beets or berries!), but if you keep seeing it, tell a grown-up or a doctor just to be safe.",
    vibeAlertAria: "Friendly color note",
    photoCountSingle: "1 photo",
    photoCountPlural: "{count} photos",
    codeIdLabel: "Tag",
    confidenceLabel: "{pct}% silly guess ✨",
    bristolBadge: "Shape Chart",
    moodBadge: "Vibe",
    styleBadge: "Habit Style",
    bigFiveTitle: "5 Silly Super-Meters 📊",
    bigFiveBadge: "0–100% Just for Fun",
    bigFive: {
      openness: {
        label: "Curious",
        note: "Loves trying new snacks and wild adventures!",
      },
      conscientiousness: {
        label: "Super Neat",
        note: "Likes keeping toys, snacks, and plans tidy.",
      },
      extraversion: {
        label: "Chatty & Fun",
        note: "Loves laughing, talking, and making new pals.",
      },
      agreeableness: {
        label: "Kind & Sweet",
        note: "Shares nicely even when the last roll is gone!",
      },
      neuroticism: {
        label: "Worry Bug",
        note: "Checks the bathroom lock three times just in case!",
      },
    },
    strengthsTitle: "Superpowers ✨",
    flawsTitle: "Silly Quirks 🙈",
    famousBadge: "Fun Story · Famous For",
    matchesTitle: "Best & Silly Matches 💘",
    bestMatch: "Best Buddy",
    worstMatch: "Funny Opposite",
    shareBadge: "Private Card Maker",
    shareTitle: "Share Your Fun Card!",
    shareBody:
      "Links and picture cards NEVER show your real photo unless you turn the switch on below!",
    includePhotosTitle: "Put my photo on the picture card (optional)",
    includePhotosReady:
      "Off by default to keep it private. Uses your {count} safe tiny photo(s) from this phone.",
    includePhotosUnavailable:
      "Not available on shared links because real photos are never uploaded.",
    btnShare: "Share Card",
    btnCopy: "Copy Link",
    btnDownload: "Save Picture",
    btnTryAgain: "Play Again",
    feedbackCopied: "Link copied! No real photos are inside it. 🔗",
    feedbackCopyFallback: "Copy this link: {url}",
    feedbackShared: "Shared! 🚀",
    feedbackDownloaded: "Picture card saved to your device! 🖼️",
    shareNativeTitle: "PoopType: {code} — {nickname}",
    shareNativeText:
      "I got {code} ({nickname}) on PoopType with {pct}% silly confidence! 💩✨",
    drawingCard: "Drawing your fun card... ✨",
    cardImgAlt: "PoopType cartoon card for {code} — {nickname}",
  },
  shareCard: {
    headerPill: "POOPTYPE FUN CARD",
    confidencePill: "{pct}% silly guess",
    badgeBristol: "SHAPE",
    badgeMood: "VIBE",
    badgeStyle: "HABIT",
    bigFiveHeading: "5 SILLY SUPER-METERS",
    photosHeading: "YOUR SAFE TINY PHOTOS (OPTED IN)",
    bestMatch: "BEST BUDDY",
    worstMatch: "OPPOSITE",
    footer:
      "Just for fun! Not real doctor advice. Your photo never leaves your phone.",
  },
  science: {
    badge1: "True vs Silly",
    badge2: "9 Real Studies",
    titleBefore: "The Real ",
    titleHighlight: "Facts",
    shortVersionLead: "Quick truth:",
    shortVersionBeforeNot:
      "PoopType is just a silly game! Poop color and shape come from your food, water, and tummy — they do ",
    shortVersionNot: "not",
    shortVersionAfterNot: " tell anyone your personality.",
    mascotBubble: "Real facts! 🧪",
    mascotAlt: "Curious mascot holding a magnifying glass",
    sectionsAria: "Page sections",
    jumpLinks: [
      { href: "#history-heading", label: "1. Old Stories" },
      { href: "#bristol-heading", label: "2. Color & Shape" },
      { href: "#microbiome-heading", label: "3. Tummy Bugs" },
      { href: "#ibs-heading", label: "4. Tummy & Feelings" },
      { href: "#takeaway-heading", label: "3 Takeaways" },
    ],
    factMythSr: "What is true and what is pretend",
    factBadge: "✅ ACTUALLY TRUE",
    factTitle: "Your tummy and brain talk a little",
    factBody:
      "Big health studies found tiny links between long-term tummy habits, tiny tummy helpers (bacteria), and how worried or neat people feel.",
    mythBadge: "🚫 TOTAL PRETEND",
    mythTitle: "A photo can't read your mind",
    mythBody:
      "Zero science says one photo can guess your personality. Codes like PPTO and PPLO are 100% phone math + giggles! 💩",
    panel1Badge: "01 · OLD STORIES",
    panel1Title: "Where This Silly Idea Started",
    panel1IntroBefore:
      "Hundreds of years ago, old healers guessed that 4 body moods matched different poop traits. ",
    panel1IntroBold: "Real doctors today know that isn't true",
    panel1IntroAfter: " — it's just funny history:",
    humorCards: [
      {
        name: "Happy & Warm",
        color: "#FFD93D",
        summary: "Soft, smooth, rich brown, mild smell.",
      },
      {
        name: "Calm & Chill",
        color: "#6BE3B5",
        summary: "Bigger and softer.",
      },
      {
        name: "Fast & Fiery",
        color: "#FF9F43",
        summary: "Yellowish, fast, and runny.",
      },
      {
        name: "Quiet & Deep",
        color: "#5CC8FF",
        summary: "Dark, hard, dry, and slow.",
      },
    ],
    freudTitle: "Freud's Famous Potty-Training Idea (Ages 1–3)",
    freudLeftTitle: "Super Neat Type",
    freudLeftBody: "Loves order, saving things, and strict rules.",
    freudRightTitle: "Super Messy Type",
    freudRightBody: "Loves being wild, messy, quick, and sharing everything.",
    freudNote:
      "Real talk: Scientists today say there's very little proof that potty training shapes your whole personality.",
    panel2Badge: "02 · REAL BODY FACTS",
    panel2Title: "Poop Colors & The Shape Chart 🧻",
    panel2IntroBefore: "Poop color mostly comes from ",
    panel2IntroBold: "what you ate, tummy juices, speed, and medicine",
    panel2IntroAfter: " — never your personality:",
    colorGuide: [
      {
        swatch: "#8B5A2B",
        label: "Brown",
        meaning: "Totally normal! From everyday food and tummy juices.",
      },
      {
        swatch: "#4CAF50",
        label: "Green",
        meaning: "Green veggies, food dye, or food moving fast.",
      },
      {
        swatch: "#F5C542",
        label: "Yellow / Greasy",
        meaning: "Can mean your tummy didn't soak up fat well.",
      },
      {
        swatch: "#E05252",
        label: "Pale, Black, or Bright Red",
        meaning: "Sometimes needs a checkup — ask a doctor if it keeps happening.",
      },
    ],
    bristolTitle: "The 1-to-7 Shape Chart (Bristol Scale)",
    bristolBuckets: [
      { range: "Shapes 1–2", label: "Too hard", bg: "#FF9F43" },
      { range: "Shapes 3–4", label: "Just right!", bg: "#6BE3B5" },
      { range: "Shape 5", label: "A bit soft", bg: "#FFD93D" },
      { range: "Shapes 6–7", label: "Too runny", bg: "#FF7AC6" },
    ],
    bristolChips: [
      "⏱️ Shape 1 ≈ 100 hours in tummy",
      "⚡ Shape 7 ≈ 10 hours in tummy",
      "📊 ~1 in 5 slow · ~1 in 12 fast",
    ],
    panel3Badge: "03 · TUMMY HELPERS",
    panel3Title: "Tiny Tummy Bugs & Feelings 🦠",
    panel3IntroBefore:
      "Scientists looked at tiny good bacteria living in people's tummies and found ",
    panel3IntroBold: "very tiny",
    panel3IntroAfter:
      " links to personality quizzes. Tap any card to read the real study:",
    panel4Badge: "04 · TUMMY & BRAIN",
    panel4Title: "Sensitive Tummies (IBS) & Worries 🧠",
    panel4IntroBefore:
      "Big studies on people with extra-sensitive tummies (called IBS) found a real tummy-brain link — mostly with ",
    panel4IntroBold: "stress and worry",
    panel4IntroAfter: ". Tap any card to see the real paper:",
    takeawayBadge: "🩺 Quick Summary",
    takeawayTitle: "3 Easy Things to Remember",
    takeawayItems: [
      {
        icon: "✅",
        lead: "What is true:",
        body: "Over a long time, tummy habits and tiny tummy bacteria have small links with stress and neatness in big studies.",
      },
      {
        icon: "💩",
        lead: "What is just a game:",
        body: "Poop color and shape come from food, water, and tummy speed — one photo can never guess who you are!",
      },
      {
        icon: "🩺",
        lead: "Stay healthy:",
        body: "If poop stays bright red, pitch black, or very pale, or your tummy keeps hurting, talk to a doctor.",
      },
    ],
    ctaAnalyzer: "💩 Back to Game",
    ctaTypes: "🃏 See All 16 Types",
    studyCountSingle: "1 Real Study",
    studyCountPlural: "{count} Real Studies",
    expandAll: "Open all",
    collapseAll: "Close all",
    studies: {
      history: [
        {
          id: "#1",
          badgeColor: "#FF9F43",
          statChip: "2018 Study",
          headline:
            "People with slow tummies leaned tidier; people with fast tummies leaned more go-with-the-flow.",
          citation:
            'Guido et al., Journal of Consumer Behaviour (2018) — "Consumer behaviour and the toilet"',
          details:
            "A 2018 study asked adults about bathroom and shopping habits. Folks with constipation leaned a bit more neat and careful about keeping things, while folks with runny patterns leaned more relaxed and happy to share or toss stuff.",
        },
      ],
      bristol: [
        {
          id: "#2",
          badgeColor: "#FFD93D",
          statChip: "66 Adults · 1997",
          headline:
            "Shape shows how fast food moved: ~100 hours for Shape 1 down to ~10 hours for Shape 7.",
          citation:
            "Lewis SJ & Heaton KW, Scandinavian Journal of Gastroenterology (1997;32(9):920–924)",
          details:
            "Doctors made the 7-shape chart by studying 66 volunteers. Shapes 1–2 mean constipation (slow), 3–4 are just right, 5 is soft-normal, and 6–7 mean diarrhea (fast). In the first group, 1–2 happened more in women and 5–6 more in men. Across a bigger group, about 1 in 5 people were slow and about 1 in 12 were fast.",
        },
      ],
      microbiome: [
        {
          id: "#3",
          badgeColor: "#6BE3B5",
          statChip: "672 Adults · 2018",
          headline:
            "Very small links between certain tummy bacteria and feeling worried or neat.",
          citation: "Kim et al., Brain, Behavior, and Immunity (2018;69:374–385)",
          details:
            "In 672 adults tested with personality surveys and DNA stool checks, higher worry matched slightly more Gammaproteobacteria, lower neatness matched more Proteobacteria, and higher neatness matched more Lachnospiraceae. The scientists noted these differences were super tiny.",
        },
        {
          id: "#4",
          badgeColor: "#FFD93D",
          statChip: "Oxford · 2020",
          headline:
            "People with more friends tended to have a wider mix of tummy bacteria.",
          citation:
            "Johnson KV-A, Human Microbiome Journal (2020;15, Oxford University)",
          details:
            "This Oxford study found that the variety of tiny bacteria in people's tummies had a small link with being social and with worry levels — more social people tended to have a bigger mix of tummy helpers.",
        },
        {
          id: "#5",
          badgeColor: "#5CC8FF",
          statChip: "1,463 Samples · 2021",
          headline:
            "A bigger follow-up study compared 6 kinds of worry with tummy bacteria.",
          citation: "Journal of Personalized Medicine (2021;11(12):1246)",
          details:
            "In South Korea, 1,463 adults gave stool samples and 784 also took a personality quiz so scientists could check how 6 types of stress and worry lined up with tummy bacteria.",
        },
      ],
      ibs: [
        {
          id: "#6",
          badgeColor: "#FF7AC6",
          statChip: "Japan · 2012",
          headline:
            "People with fast-tummy IBS scored higher on worry than other groups.",
          citation: "Tayama et al., BioPsychoSocial Medicine (2012;6:20, Japan)",
          details:
            "In this study from Japan, adults with diarrhea-type sensitive tummies (IBS) had higher worry scores than people without IBS or people with slow-tummy IBS.",
        },
        {
          id: "#7",
          badgeColor: "#FFD93D",
          statChip: "150 Patients · 2007",
          headline:
            "People with IBS showed small differences on personality quizzes, including curiosity.",
          citation: "World Journal of Gastroenterology (2007;13(47):6414, Iran)",
          details:
            "In a study from Iran with 150 IBS patients (71 runny-type, 33 slow-type, 46 mix), scores differed slightly from the general public — including slightly lower curiosity (26.25 vs 27.94).",
        },
        {
          id: "#8",
          badgeColor: "#6BE3B5",
          statChip: "250,000+ People · 2021",
          headline:
            "Family genes for sensitive tummies overlap a lot with stress and worry genes.",
          citation: "Nature Genetics (2021, IBS genome-wide study)",
          details:
            "Looking at over 250,000 people, scientists found that genes linked to IBS strongly overlap with genes for anxiety, worry, and sadness (rg > 0.5). In the UK Biobank group, 6.4% had ongoing constipation and 11.7% had ongoing diarrhea.",
        },
        {
          id: "#9",
          badgeColor: "#5CC8FF",
          statChip: "Maastricht · 2026",
          headline:
            "Worry and tummy-specific stress stood out most in a recent IBS group.",
          citation:
            "Neurogastroenterology and Motility (2026, Maastricht University)",
          details:
            "In a new study from Maastricht University, general worry and tummy-focused stress showed the clearest link with IBS symptoms.",
        },
      ],
    },
  },
  axes: [
    {
      axis: 1,
      name: "Shape",
      measure: "Firm or Soft",
      left: {
        letter: "P",
        label: "Firm",
        summary: "Solid and steady! Likes neat rooms, lists, and clear rules.",
      },
      right: {
        letter: "F",
        label: "Soft",
        summary: "Loose and bouncy! Loves surprises, sharing, and going with the flow.",
      },
    },
    {
      axis: 2,
      name: "Edges",
      measure: "Smooth or Bumpy",
      left: {
        letter: "P",
        label: "Smooth",
        summary: "Clean, tidy outlines! Loves coloring right inside the lines.",
      },
      right: {
        letter: "R",
        label: "Bumpy",
        summary: "Wild, fluffy edges! Full of silly ideas and big imagination.",
      },
    },
    {
      axis: 3,
      name: "Color",
      measure: "Dark or Light",
      left: {
        letter: "T",
        label: "Dark",
        summary: "Deep chocolate brown! Calm, cozy, and loves quiet thinking.",
      },
      right: {
        letter: "L",
        label: "Light",
        summary: "Sunny golden brown! Bright, cheerful, and full of pep.",
      },
    },
    {
      axis: 4,
      name: "Shine",
      measure: "Shiny or Matte",
      left: {
        letter: "O",
        label: "Shiny",
        summary: "Glossy and smooth! Friendly, easygoing, and great at making pals.",
      },
      right: {
        letter: "D",
        label: "Matte",
        summary: "No-shine dry finish! Quick with funny jokes and straight talk.",
      },
    },
  ],
  bristol: {
    1: {
      name: "Shape 1",
      shortLabel: "Little hard marbles",
      traitNote: "Super firm and tidy — likes everything in its own tiny box!",
    },
    2: {
      name: "Shape 2",
      shortLabel: "Lumpy log",
      traitNote: "Strong team player with big, bold ideas.",
    },
    3: {
      name: "Shape 3",
      shortLabel: "Log with tiny cracks",
      traitNote: "Steady outside with lots of smart thoughts inside.",
    },
    4: {
      name: "Shape 4",
      shortLabel: "Smooth banana shape",
      traitNote: "The gold-star classic! Smooth, balanced, and chill.",
    },
    5: {
      name: "Shape 5",
      shortLabel: "Soft little clouds",
      traitNote: "Easygoing, light, and ready to bounce around.",
    },
    6: {
      name: "Shape 6",
      shortLabel: "Fluffy mushy bits",
      traitNote: "Free spirit who loves messy crafts and quick adventures.",
    },
    7: {
      name: "Shape 7",
      shortLabel: "Super splashy liquid",
      traitNote: "Zoom-zoom speed! Too fast for rules or borders.",
    },
  },
  types: {
    PPTO: {
      nickname: "The Treasure Keeper",
      blurb:
        "Loves sorting toys, labeling every box, and making backup plans. Tough on the outside, super sweet and friendly once you know them!",
      strengths: ["Best planner in the group", "Stays super cool when things get busy"],
      flaws: ["Still keeps broken toys from 2009", "Secretly checks everyone's lists"],
      famousFor: "The make-believe Town Librarian who put plastic covers on every single snow rule!",
      moodLabel: "Quiet & Deep",
      moodNote: "Super organized and calm, with a warm, friendly smile.",
      styleLabel: "Neat & Tidy",
      styleNote: "Loves tidy drawers and puts stickers on every jar.",
    },
    PPTD: {
      nickname: "The Rule Boss",
      blurb:
        "Runs on a strict clock and loves doing things the exact right way. Surprise changes feel like breaking the playground rules!",
      strengths: ["Always finishes what they start", "Super funny dry jokes"],
      flaws: ["Doesn't trust mystery leftovers", "Not a big fan of random chit-chat"],
      famousFor: "The make-believe Lighthouse Keeper who wrote down 14,000 sunsets in neat ink!",
      moodLabel: "Quiet & Deep",
      moodNote: "Calm, serious, and careful down to the tiniest detail.",
      styleLabel: "Neat & Tidy",
      styleNote: "Lines up spices in ABC order and saves every receipt.",
    },
    PPLO: {
      nickname: "The Sunny Planner",
      blurb:
        "Makes giant checklists feel like a fun picnic! Cheerful, charming, and gently makes sure everyone follows the plan.",
      strengths: ["Makes group trips super easy", "Solves fights with a big smile"],
      flaws: ["Fixes trip plans at midnight", "A little bossy — in a cute way!"],
      famousFor: "The make-believe Party Mayor who timed a picnic down to the exact sprinkle!",
      moodLabel: "Happy & Warm",
      moodNote: "Warm, sunny, and friendly, with neat little rules.",
      styleLabel: "Neat & Tidy",
      styleNote: "Happily shares jobs as long as everyone uses the chart!",
    },
    PPLD: {
      nickname: "The Coin Counter",
      blurb:
        "Bright, sharp, and never wastes a single word or penny. Keeps everything clean and asks for proof before saying yes!",
      strengths: ["Great at saving allowance", "Super clear and easy to understand"],
      flaws: ["Splits the snack bill to the last penny", "Thinks silly stuff needs a permit"],
      famousFor: "The make-believe Clocktower Guard who counted every crumb eaten by park pigeons!",
      moodLabel: "Fast & Fiery",
      moodNote: "Quick, bright, and sharp — zero mess and zero fluff.",
      styleLabel: "Neat & Tidy",
      styleNote: "Saves and folds gift wrapping paper like a museum treasure.",
    },
    PRTO: {
      nickname: "The Cozy Thinker",
      blurb:
        "Full of secret big ideas and funny creative twists. Turns late-night thinking into cool games and yummy snacks.",
      strengths: ["Clever outside-the-box fixes", "Super chill during wild surprises"],
      flaws: ["Makes simple errands way too fancy", "Collects 12 hobbies at the same time"],
      famousFor: "The make-believe Park Chess Champ who wrote a 40-page guide for rainy-day games!",
      moodLabel: "Calm & Chill",
      moodNote: "Deep thinker with a smooth, easygoing superpower.",
      styleLabel: "Neat & Tidy",
      styleNote: "Remembers every secret recipe and cool collectible.",
    },
    PRTD: {
      nickname: "The Grumpy Genius",
      blurb:
        "Deep thinker with bumpy edges and hilarious deadpan jokes. Loves cozy alone time, big books, and dramatic sighs.",
      strengths: ["Super strong focus", "Makes everyone laugh with one line"],
      flaws: ["Never asks for directions", "Gets grumpy over crooked stickers"],
      famousFor: "The make-believe Mountain Scientist who wrote a giant book defending slow moss!",
      moodLabel: "Quiet & Deep",
      moodNote: "Extra thoughtful, dry-humored, and proudly independent.",
      styleLabel: "Neat & Tidy",
      styleNote: "Insists on packing the whole car trunk all by themselves.",
    },
    PRLO: {
      nickname: "The Crafty Dreamer",
      blurb:
        "Has their own quirky rules, yet stays warm, fuzzy, and super fun! Turns boring to-do lists into rainbow art projects.",
      strengths: ["Awesome creative ideas", "Warm and easy to hang out with"],
      flaws: ["Sorts books by 'vibe'", "Starts 5 crafts before lunch"],
      famousFor: "The make-believe Beach Toymaker who sorted driftwood by how friendly it looked!",
      moodLabel: "Happy & Warm",
      moodNote: "Sunny, smiley, and full of cute little rituals.",
      styleLabel: "Neat & Tidy",
      styleNote: "Collects shiny buttons, movie tickets, and smooth rocks.",
    },
    PRLD: {
      nickname: "The Speedy Inventor",
      blurb:
        "Bouncing with energy and drawing wild blueprints everywhere! Mixes strong opinions with a storm of speedy ideas.",
      strengths: ["Never stops asking 'why?'", "Quick, clever jokes"],
      flaws: ["Redoes plans that already worked", "Argues board-game rules for 40 minutes"],
      famousFor: "The make-believe Star Watcher who moved the breakroom chairs like planets!",
      moodLabel: "Fast & Fiery",
      moodNote: "Bright, zippy energy powered by nonstop inventing.",
      styleLabel: "Neat & Tidy",
      styleNote: "Super picky about ideas, super messy desk!",
    },
    FPTO: {
      nickname: "The Smooth Captain",
      blurb:
        "Glides through surprise nights without breaking a sweat! Loves sharing time, tips, and awesome last-minute adventures.",
      strengths: ["Stays calm in total chaos", "Best host for fun hangouts"],
      flaws: ["Treats clocks like gentle hints", "Says yes to 3 dinners at once"],
      famousFor: "The make-believe Boat Captain who turned a missed dock into a sunset music party!",
      moodLabel: "Calm & Chill",
      moodNote: "Cool, smooth, and never in a rush.",
      styleLabel: "Free & Messy",
      styleNote: "Super generous — lets friends borrow their best jacket forever!",
    },
    FPTD: {
      nickname: "The Turbo Runner",
      blurb:
        "Moves super fast, talks straight, and gets stuff done right now! Spontaneous enough to hop on a train with one tiny backpack.",
      strengths: ["Zooms straight into action", "Fast, smart choices"],
      flaws: ["Skips the instruction booklet", "Stops big projects right near the end"],
      famousFor: "The make-believe Night-Train Messenger who crossed 4 towns without even a map!",
      moodLabel: "Fast & Fiery",
      moodNote: "Zoomy, focused, and always ready to go.",
      styleLabel: "Free & Messy",
      styleNote: "Loves speed and sharing way more than tidy folders.",
    },
    FPLO: {
      nickname: "The Happy Host",
      blurb:
        "Breezy, golden, and smiles at everyone in the room! Believes every tiny problem gets better with cupcakes and a fun detour.",
      strengths: ["Makes everyone feel welcome", "Super easy team player"],
      flaws: ["Loses keys 3 times a week", "Says yes before checking the clock"],
      famousFor: "The make-believe Hotel Helper who fixed a double party by making one giant feast!",
      moodLabel: "Happy & Warm",
      moodNote: "Super sunny, soft-hearted, and loves big groups.",
      styleLabel: "Free & Messy",
      styleNote: "Happy, bouncy, and always first to buy snacks for friends!",
    },
    FPLD: {
      nickname: "The Light Packer",
      blurb:
        "Quick, sunny, and hates extra clutter! Gives away spare stuff on a whim and travels anywhere with just one small bag.",
      strengths: ["Zero clutter, fast choices", "Honest and drama-free"],
      flaws: ["Throws away box manuals right away", "Speed-walks past pretty views"],
      famousFor: "The make-believe Desert Builder who made a whole house with one stool and a window!",
      moodLabel: "Fast & Fiery",
      moodNote: "Light, quick, and direct — no heavy bags allowed.",
      styleLabel: "Free & Messy",
      styleNote: "Never hoards stuff — gives books away the second they finish!",
    },
    FRTO: {
      nickname: "The Night Owl Artist",
      blurb:
        "Dreamy, loose, and full of cool stories over midnight noodles! Turns boring schedules into unforgettable art adventures.",
      strengths: ["Amazing story teller", "Fearless at trying wild ideas"],
      flaws: ["Moves bedroom furniture at 2 AM", "Turns receipts into paper confetti"],
      famousFor: "The make-believe Midnight Noodle Chef who traded warm soup for fun neighborhood riddles!",
      moodLabel: "Calm & Chill",
      moodNote: "Soft, flowy, and endlessly curious at night.",
      styleLabel: "Free & Messy",
      styleNote: "Messy in a cool way — tons of half-drawn notebooks!",
    },
    FRTD: {
      nickname: "The Wild Whirlwind",
      blurb:
        "Big feelings, bumpy edges, and super funny teasing! Always shows up when friends need help, hates plans made too early.",
      strengths: ["Bold, honest creativity", "Super loyal when things go wrong"],
      flaws: ["Has 47 tabs open right now", "Turns a quick errand into a big movie"],
      famousFor: "The make-believe Comic Maker who wrote a 90-page rant about weak staplers!",
      moodLabel: "Quiet & Deep",
      moodNote: "Big, bold energy with a funny, stormy spark.",
      styleLabel: "Free & Messy",
      styleNote: "Breaks silly rules just to see what happens next!",
    },
    FRLO: {
      nickname: "The Sunshine Splash",
      blurb:
        "Bright, bouncy, and shows up 20 minutes late holding warm donuts — and everyone still cheers! Spreads hugs and giggles everywhere.",
      strengths: ["Super happy, sunny energy", "Shares everything with everyone"],
      flaws: ["Thinks 'be there at 5' means 5:30", "Starts a group chat for buying milk"],
      famousFor: "The make-believe Parade Leader who led a marching band straight into a backyard picnic!",
      moodLabel: "Happy & Warm",
      moodNote: "Pure sunshine — bubbly, warm, and unstoppable fun.",
      styleLabel: "Free & Messy",
      styleNote: "Shares snacks, songs, and secrets in five minutes flat!",
    },
    FRLD: {
      nickname: "The Confetti Joker",
      blurb:
        "Lighthearted, fluffy-edged, and full of quick jokes! Writes awesome ideas in 5 notebooks and loses 4 of them by Friday.",
      strengths: ["Super funny on the spot", "Loves weird, wonderful ideas"],
      flaws: ["Never finishes one cup of cocoa", "Forgets why they walked into the room"],
      famousFor: "The make-believe Balloon Pilot who drew maps of silly clouds instead of roads!",
      moodLabel: "Fast & Fiery",
      moodNote: "Bright, breezy sparks flying in every direction!",
      styleLabel: "Free & Messy",
      styleNote: "Playfully messy and totally puzzled by tidy folders.",
    },
  },
};
