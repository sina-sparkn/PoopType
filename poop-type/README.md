# PoopType

> Peer-reviewed bathroom pseudoscience. Your poop never leaves your device.

PoopType is a parody personality typing web app built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and client-side HTML Canvas pixel analysis. Upload 1 to 5 photos in the browser to receive a deterministic 4-letter personality code (such as `PPTO` or `PPLO`), an estimated Bristol Stool Scale rating, humoral temperament, Freudian classification, joke Big Five meters, and a client-side shareable PNG card.

**For entertainment only. Not medical or psychological advice.**

---

## Setup & Scripts

```bash
cd poop-type
npm install
npm run dev       # Starts Next.js on http://localhost:3000
npm run build     # Runs TypeScript check + production Next.js build
npm run lint      # Runs ESLint + tsc --noEmit
npm test          # Runs node:test unit tests for lib/analyze.ts
```

### Dependencies & Justifications

Runtime dependencies are strictly limited to the core stack:
- `next`, `react`, `react-dom` — Next.js App Router runtime.
- `framer-motion` — Accessible UI transitions and meter animations (with `MotionConfig reducedMotion="user"`).
- `tailwindcss` / `@tailwindcss/postcss` — Utility-first styling.
- `tsx` (devDependency) — Runs Node's built-in `node:test` runner directly against TypeScript unit tests in `lib/analyze.test.ts`.

No external AI APIs, no database, no auth, and no third-party analytics or image upload libraries are used.

---

## Project Structure

```text
poop-type/
├── app/
│   ├── globals.css               # Tailwind v4 theme variables & reduced-motion rules
│   ├── layout.tsx                # Root layout, Google Fonts, metadata, header & footer
│   ├── page.tsx                  # Home page with masthead, UploadAnalyzer, and 4-axis guide
│   ├── result/[code]/
│   │   ├── page.tsx              # Dynamic result page reconstructed purely from URL params
│   │   └── not-found.tsx         # Friendly 404 for unknown 4-letter codes
│   ├── types/page.tsx            # Browse & filter all 16 PoopType classifications
│   └── science/page.tsx          # "The Actual Science" grounded strictly in peer-reviewed refs
├── components/
│   ├── MotionProvider.tsx        # Framer Motion reduced-motion wrapper
│   ├── SiteHeader.tsx            # Single-row 3-zone navigation header
│   ├── SiteFooter.tsx            # Site-wide entertainment disclaimer & privacy summary
│   ├── UploadAnalyzer.tsx        # Drag-and-drop / camera intake, previews, 3s loading sequence
│   ├── ResultView.tsx            # Result report, Big Five meters, Vibe Alert, share card UI
│   └── TypesCatalog.tsx          # Filterable 16-type grid
└── lib/
    ├── types-data.ts             # All 16 codes, axis definitions, fictional archetypes, Bristol copy
    ├── analyze.ts                # Pure-TS Canvas pixel pipeline, SHA-256 seeding, URL codec
    ├── analyze.test.ts           # Deterministic node:test unit suite
    ├── share-card.ts             # Client-side HTML Canvas PNG card renderer
    └── session-store.ts          # Ephemeral in-memory preview store (never persisted)
```

---

## Analysis Heuristics (`lib/analyze.ts`)

All analysis executes locally in the browser using the HTML Canvas API and Web Crypto API:

1. **Validation & Downscaling**: Accepts JPG, PNG, WebP, and HEIC (where browser-supported), up to 8 MB per file and 1–5 files per session ("Poop Portfolio"). Every image is re-drawn to an offscreen `<canvas>` scaled to at most `128px` on its longest side.
2. **Foreground Segmentation**: Estimates backdrop color from the outer border ring and segments foreground pixels by Euclidean RGB distance (falling back to a central disk on uniform frames).
3. **Tone (`T` Toasted vs `L` Light)**: Computes center-weighted mean CIE `L*` lightness for pixels inside the brown/yellow/green/red hue band. Below threshold → `T`; at or above → `L`.
4. **Outline (`P` Precise vs `R` Ragged)**: Runs a 3×3 Sobel operator (`Gx`, `Gy`) on grayscale pixels across the foreground and its immediate perimeter. Low edge density → `P`; high edge density → `R`.
5. **Sheen (`O` Oily vs `D` Dry)**: Measures the share of near-white or high-luminance low-saturation specular highlights inside the segmented foreground. High specular share → `O`; low → `D`.
6. **Form (`P` Packed vs `F` Free-flowing & Bristol 1–7)**: Runs 4-connected BFS connected-component labeling and covariance-eigenvalue elongation on foreground blobs:
   - Many compact blobs → Bristol 1–2 (`P`)
   - Elongated cohesive blob → Bristol 3–4 (`P` for 3; Bristol 4 breaks ties via seeded SHA-256 hash)
   - Wide, flat, or ragged mass → Bristol 5–7 (`F`)
7. **Seeded Determinism**: Computes SHA-256 over the raw image bytes using `crypto.subtle.digest`. The digest seeds tie-breaks, tiny score jitter, Big Five variations, and the `"Confidence: XX.X% (made up)"` readout—so uploading the same image twice always produces the identical code and report.
8. **Poop Portfolio Averaging**: When 2–5 images are uploaded, continuous metrics and Bristol estimates are averaged across specimens, and individual hashes are combined via SHA-256.
9. **Vibe Alert**: If the foreground is predominantly strong red, very dark/black-tarry, or very pale/clay-colored, the result displays a non-diagnostic note advising users to consult a medical professional if persistent.

---

## Privacy Design

- **Zero Server Uploads**: No image bytes are ever sent over the network. There are no upload API routes, databases, or third-party AI calls.
- **EXIF & GPS Stripping**: Every image is immediately redrawn to a fresh HTML `<canvas>` before analysis and before generating local preview thumbnails, stripping camera EXIF and GPS metadata.
- **URL-Reconstructed Results**: Shared links (`/result/PPTO?b=2&c=94.7&t=...`) encode only the 4-letter code and summary parameters—never images—so shared links work in fresh tabs without transmitting photos.
- **Photos Excluded from Share Cards by Default**: The client-side PNG share card excludes uploaded photos by default, behind an explicit opt-in checkbox that only reads ephemeral in-memory thumbnails from the active tab.
