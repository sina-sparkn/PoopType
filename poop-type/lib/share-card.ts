import { PortfolioAnalysisResult } from "./analyze";
import { formatTemplate, getDictionary, isRtl, type Language } from "./i18n";

export interface ShareCardOptions {
  includePhotos: boolean;
  sanitizedPreviews: string[];
  lang?: Language;
}

const TILE_COLORS = ["#FF7AC6", "#FFD93D", "#6BE3B5", "#5CC8FF"];
const METER_COLORS = ["#FF7AC6", "#FFD93D", "#6BE3B5", "#5CC8FF", "#FF9F43"];

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawStickerBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
  shadowOffset = 6,
  lineWidth = 4
) {
  // Hard offset ink shadow
  ctx.fillStyle = "#1B1B1F";
  drawRoundedRect(ctx, x + shadowOffset, y + shadowOffset, w, h, r);
  ctx.fill();

  // Main fill + ink outline
  ctx.fillStyle = fill;
  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.strokeStyle = "#1B1B1F";
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("Could not load preview image for share card."));
    img.src = src;
  });
}

/**
 * Draws the cartoon PoopMascot directly onto the share card canvas,
 * reflecting the 4-letter code (Form, Outline, Tone, Sheen).
 */
function drawCanvasMascot(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  code: string
) {
  const isTall = code[0] === "P";
  const isRagged = code[1] === "R";
  const isToasted = code[2] === "T";
  const isOily = code[3] === "O";

  const bodyFill = isToasted ? "#744420" : "#C98C3D";
  const shadeFill = isToasted ? "#583114" : "#A66E24";

  ctx.save();
  ctx.translate(cx - 70 * scale, cy - 66 * scale);
  ctx.scale(scale, scale);

  // Ground shadow
  ctx.fillStyle = "rgba(27,27,31,0.18)";
  ctx.beginPath();
  ctx.ellipse(70, 120, isTall ? 40 : 48, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body path matching the 4 Form x Outline variants
  let bodyPathStr: string;
  let faceY = 0;
  if (isTall && !isRagged) {
    bodyPathStr =
      "M72 16 C75 26 88 30 92 42 C96 52 104 54 106 66 C113 72 117 82 114 94 C111 106 96 112 70 112 C44 112 29 106 26 94 C23 82 27 72 34 66 C36 54 44 52 48 42 C52 31 64 26 67 16 C68 12 71 12 72 16 Z";
  } else if (isTall && isRagged) {
    bodyPathStr =
      "M70 14 L77 25 L88 28 L87 38 L98 44 L96 54 L109 61 L106 71 L117 79 L111 89 L115 99 L102 108 L88 112 L70 109 L52 112 L38 108 L25 99 L29 89 L23 79 L34 71 L31 61 L44 54 L42 44 L53 38 L52 28 L63 25 Z";
    faceY = 1;
  } else if (!isTall && !isRagged) {
    bodyPathStr =
      "M70 40 C86 40 96 48 100 58 C114 62 124 74 124 88 C124 104 110 114 70 114 C30 114 16 104 16 88 C16 74 26 62 40 58 C44 48 54 40 70 40 Z";
    faceY = 9;
  } else {
    bodyPathStr =
      "M70 39 L82 44 L94 42 L99 54 L112 58 L113 69 L125 77 L120 88 L125 99 L112 109 L96 113 L82 110 L70 114 L58 110 L44 113 L28 109 L15 99 L20 88 L15 77 L27 69 L28 58 L41 54 L46 42 L58 44 Z";
    faceY = 10;
  }

  const body = new Path2D(bodyPathStr);
  ctx.fillStyle = bodyFill;
  ctx.fill(body);
  ctx.strokeStyle = "#1B1B1F";
  ctx.lineWidth = 4.5;
  ctx.lineJoin = "round";
  ctx.stroke(body);

  // Swirl crease
  ctx.strokeStyle = shadeFill;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(44, 64);
  ctx.quadraticCurveTo(70, 71, 96, 64);
  ctx.stroke();

  // Oily shine highlights
  if (isOily) {
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(isTall ? 44 : 34, isTall ? 75 : 78);
    ctx.quadraticCurveTo(
      isTall ? 40 : 31,
      isTall ? 84 : 87,
      isTall ? 46 : 38,
      isTall ? 92 : 95
    );
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(isTall ? 53 : 45, isTall ? 55 : 64, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Blush cheeks
  ctx.fillStyle = "#FF7AC6";
  ctx.beginPath();
  ctx.ellipse(46, 89 + faceY, 7, 4.2, 0, 0, Math.PI * 2);
  ctx.ellipse(94, 89 + faceY, 7, 4.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes or sunglasses
  if (!isOily && isTall) {
    ctx.fillStyle = "#1B1B1F";
    drawRoundedRect(ctx, 42, 69 + faceY, 24, 16, 5);
    ctx.fill();
    drawRoundedRect(ctx, 74, 69 + faceY, 24, 16, 5);
    ctx.fill();
    ctx.strokeStyle = "#1B1B1F";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(66, 75 + faceY);
    ctx.lineTo(74, 75 + faceY);
    ctx.stroke();
    ctx.strokeStyle = "#5CC8FF";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(47, 73 + faceY);
    ctx.lineTo(53, 73 + faceY);
    ctx.lineTo(48, 80 + faceY);
    ctx.moveTo(79, 73 + faceY);
    ctx.lineTo(85, 73 + faceY);
    ctx.lineTo(80, 80 + faceY);
    ctx.stroke();
  } else {
    // Happy big eyes
    for (const ex of [55, 85]) {
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(ex, 76 + faceY, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1B1B1F";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#1B1B1F";
      ctx.beginPath();
      ctx.arc(ex + 1, 76 + faceY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(ex + 2.8, 73.5 + faceY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Cheerful smile
  ctx.fillStyle = "#1B1B1F";
  ctx.beginPath();
  ctx.moveTo(58, 88 + faceY);
  ctx.quadraticCurveTo(70, 102 + faceY, 82, 88 + faceY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#FF7AC6";
  ctx.beginPath();
  ctx.ellipse(70, 94 + faceY, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dry + Free-flowing tiny cactus buddy
  if (!isOily && !isTall) {
    ctx.save();
    ctx.translate(98, 78);
    ctx.fillStyle = "#FF9F43";
    ctx.strokeStyle = "#1B1B1F";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(8, 22);
    ctx.lineTo(26, 22);
    ctx.lineTo(23, 34);
    ctx.lineTo(11, 34);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#6BE3B5";
    drawRoundedRect(ctx, 13, 5, 8, 18, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#FF7AC6";
    ctx.beginPath();
    ctx.arc(17, 4, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Generates a cartoon sticker-book PNG result card using the HTML Canvas API.
 * Photos are excluded by default unless the user explicitly opts in.
 */
export async function renderShareCardPng(
  result: PortfolioAnalysisResult,
  options: ShareCardOptions
): Promise<string> {
  const lang: Language = options.lang ?? "en";
  const t = getDictionary(lang);
  const rtl = isRtl(lang);
  const localizedType = t.types[result.code];
  const bristolInfo = t.bristol[result.bristolType] ?? t.bristol[4];

  const bodyFont = rtl
    ? "'Vazirmatn', system-ui, sans-serif"
    : "'Nunito', system-ui, sans-serif";
  const displayFont = rtl
    ? "'Vazirmatn', system-ui, sans-serif"
    : "'Lilita One', Impact, sans-serif";

  const width = 1080;
  const hasOptInPhotos =
    options.includePhotos && options.sanitizedPreviews.length > 0;
  const height = hasOptInPhotos ? 1320 : 1120;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not initialize share card canvas.");
  }

  // Cream background with playful candy polka dots
  ctx.fillStyle = "#FFF6E5";
  ctx.fillRect(0, 0, width, height);
  const dotColors = [
    "rgba(255,122,198,0.28)",
    "rgba(92,200,255,0.28)",
    "rgba(255,217,61,0.42)",
    "rgba(107,227,181,0.3)",
  ];
  for (let y = 26; y < height; y += 64) {
    for (let x = 26; x < width; x += 64) {
      ctx.fillStyle = dotColors[((x + y) / 64) % dotColors.length | 0];
      ctx.beginPath();
      ctx.arc(x + ((y / 64) % 2) * 20, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Main trading card frame
  drawStickerBox(ctx, 44, 44, width - 98, height - 98, 34, "#FFFFFF", 12, 5);

  ctx.direction = rtl ? "rtl" : "ltr";

  // Top banner pills (centered text inside each pill works cleanly in LTR & RTL)
  drawStickerBox(ctx, 84, 82, 340, 56, 28, "#FFD93D", 4, 3.5);
  ctx.fillStyle = "#1B1B1F";
  ctx.textAlign = "center";
  ctx.font = `900 24px ${bodyFont}`;
  ctx.fillText(t.shareCard.headerPill, 84 + 170, 118);

  drawStickerBox(ctx, width - 456, 82, 362, 56, 28, "#6BE3B5", 4, 3.5);
  ctx.fillStyle = "#1B1B1F";
  ctx.font = `800 22px ${bodyFont}`;
  const confidenceText = formatTemplate(t.shareCard.confidencePill, {
    pct: result.confidence.toFixed(1),
  });
  ctx.fillText(confidenceText, width - 456 + 181, 118);

  // 4 giant colored letter tiles on left (always LTR so P-P-L-O reads left-to-right) + Mascot on right
  ctx.save();
  ctx.direction = "ltr";
  ctx.textAlign = "center";
  const tileSize = 112;
  const tileGap = 18;
  const tilesStartX = 84;
  const tilesY = 172;
  result.code.split("").forEach((letter, idx) => {
    const tx = tilesStartX + idx * (tileSize + tileGap);
    drawStickerBox(
      ctx,
      tx,
      tilesY,
      tileSize,
      tileSize,
      22,
      TILE_COLORS[idx],
      6,
      4.5
    );
    ctx.fillStyle = "#1B1B1F";
    ctx.font = "900 70px 'Lilita One', Impact, sans-serif";
    ctx.fillText(letter, tx + tileSize / 2, tilesY + 80);
  });
  ctx.restore();

  // Mascot sticker medallion
  drawStickerBox(ctx, width - 344, 168, 250, 232, 28, "#5CC8FF", 7, 4.5);
  drawCanvasMascot(ctx, width - 219, 284, 1.55, result.code);

  // Nickname banner
  drawStickerBox(ctx, 84, 314, 594, 86, 22, "#FF9F43", 6, 4);
  ctx.fillStyle = "#1B1B1F";
  ctx.direction = rtl ? "rtl" : "ltr";
  ctx.textAlign = "center";
  ctx.font = `900 ${rtl ? 38 : 42}px ${displayFont}`;
  ctx.fillText(localizedType.nickname, 84 + 297, 372, 550);

  // Blurb speech card
  drawStickerBox(ctx, 84, 424, width - 178, 120, 22, "#FFF6E5", 5, 3.5);
  ctx.fillStyle = "#1B1B1F";
  ctx.textAlign = rtl ? "right" : "left";
  ctx.font = `700 ${rtl ? 22 : 24}px ${bodyFont}`;
  const blurbX = rtl ? width - 122 : 112;
  wrapText(ctx, localizedType.blurb, blurbX, 466, width - 234, 34);

  // Three sticker badges: Shape / Vibe / Habit
  const badgeY = 572;
  const badgeW = 286;
  const badgeGap = 22;
  const badges = [
    { label: t.shareCard.badgeBristol, value: bristolInfo.name, color: "#FF7AC6" },
    { label: t.shareCard.badgeMood, value: localizedType.moodLabel, color: "#FFD93D" },
    { label: t.shareCard.badgeStyle, value: localizedType.styleLabel, color: "#B997FF" },
  ];
  badges.forEach((b, i) => {
    const bx = 84 + i * (badgeW + badgeGap);
    drawStickerBox(ctx, bx, badgeY, badgeW, 92, 20, b.color, 5, 3.5);
    ctx.fillStyle = "#1B1B1F";
    ctx.textAlign = "center";
    ctx.font = `800 17px ${bodyFont}`;
    ctx.fillText(b.label, bx + badgeW / 2, badgeY + 34, badgeW - 24);
    ctx.font = `900 ${rtl ? 24 : 28}px ${displayFont}`;
    ctx.fillText(b.value, bx + badgeW / 2, badgeY + 72, badgeW - 24);
  });

  // Chunky 5 Super-Meters
  const bfY = 700;
  ctx.fillStyle = "#1B1B1F";
  ctx.textAlign = rtl ? "right" : "left";
  ctx.font = `900 24px ${displayFont}`;
  ctx.fillText(t.shareCard.bigFiveHeading, rtl ? width - 94 : 84, bfY);

  const traits: [string, number][] = [
    [t.result.bigFive.openness.label, result.bigFive.openness],
    [t.result.bigFive.conscientiousness.label, result.bigFive.conscientiousness],
    [t.result.bigFive.extraversion.label, result.bigFive.extraversion],
    [t.result.bigFive.agreeableness.label, result.bigFive.agreeableness],
    [t.result.bigFive.neuroticism.label, result.bigFive.neuroticism],
  ];

  const barX = rtl ? 186 : 316;
  const barW = 540;
  traits.forEach(([name, score], i) => {
    const rowY = bfY + 42 + i * 44;
    ctx.fillStyle = "#1B1B1F";
    ctx.font = `800 22px ${bodyFont}`;
    ctx.textAlign = rtl ? "right" : "left";
    ctx.fillText(name, rtl ? width - 94 : 84, rowY, 210);

    ctx.fillStyle = "#FFF6E5";
    drawRoundedRect(ctx, barX, rowY - 20, barW, 24, 12);
    ctx.fill();
    ctx.strokeStyle = "#1B1B1F";
    ctx.lineWidth = 3;
    ctx.stroke();

    const fillW = Math.max(24, (barW * score) / 100);
    ctx.fillStyle = METER_COLORS[i % METER_COLORS.length];
    drawRoundedRect(
      ctx,
      rtl ? barX + barW - fillW : barX,
      rowY - 20,
      fillW,
      24,
      12
    );
    ctx.fill();
    ctx.strokeStyle = "#1B1B1F";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.save();
    ctx.direction = "ltr";
    ctx.fillStyle = "#1B1B1F";
    ctx.textAlign = rtl ? "right" : "left";
    ctx.font = "900 22px 'Lilita One', Impact, sans-serif";
    ctx.fillText(`${score}%`, rtl ? barX - 18 : barX + barW + 18, rowY);
    ctx.restore();
  });

  // Optional opt-in EXIF-stripped photos (OFF by default!)
  let matchY = bfY + 286;
  if (hasOptInPhotos) {
    const photoY = bfY + 278;
    ctx.fillStyle = "#1B1B1F";
    ctx.textAlign = rtl ? "right" : "left";
    ctx.font = `800 18px ${bodyFont}`;
    ctx.fillText(t.shareCard.photosHeading, rtl ? width - 94 : 84, photoY);

    const photosToDraw = options.sanitizedPreviews.slice(0, 5);
    const thumbSize = 148;
    const gap = 22;
    for (let i = 0; i < photosToDraw.length; i++) {
      try {
        const img = await loadImage(photosToDraw[i]);
        const tx = 84 + i * (thumbSize + gap);
        const ty = photoY + 18;
        ctx.save();
        drawRoundedRect(ctx, tx, ty, thumbSize, thumbSize, 16);
        ctx.clip();
        const aspect = img.width / Math.max(1, img.height);
        let dw = thumbSize;
        let dh = thumbSize;
        let dx = tx;
        let dy = ty;
        if (aspect > 1) {
          dw = thumbSize * aspect;
          dx = tx - (dw - thumbSize) / 2;
        } else {
          dh = thumbSize / aspect;
          dy = ty - (dh - thumbSize) / 2;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
        ctx.strokeStyle = "#1B1B1F";
        ctx.lineWidth = 4;
        drawRoundedRect(ctx, tx, ty, thumbSize, thumbSize, 16);
        ctx.stroke();
      } catch {
        // Ignore broken preview frame cleanly
      }
    }
    matchY = photoY + 206;
  }

  // Matches strip
  drawStickerBox(ctx, 84, matchY - 30, 420, 52, 26, "#6BE3B5", 4, 3);
  ctx.fillStyle = "#1B1B1F";
  ctx.textAlign = "center";
  ctx.font = `900 22px ${bodyFont}`;
  ctx.fillText(
    `${t.shareCard.bestMatch}: ${result.profile.bestMatch}`,
    84 + 210,
    matchY + 4,
    380
  );

  drawStickerBox(ctx, 530, matchY - 30, 456, 52, 26, "#FF7AC6", 4, 3);
  ctx.fillStyle = "#1B1B1F";
  ctx.font = `900 22px ${bodyFont}`;
  ctx.fillText(
    `${t.shareCard.worstMatch}: ${result.profile.worstMatch}`,
    530 + 228,
    matchY + 4,
    420
  );

  // Footer disclaimer
  ctx.fillStyle = "#1B1B1F";
  ctx.textAlign = "center";
  ctx.font = `700 17px ${bodyFont}`;
  ctx.fillText(t.shareCard.footer, width / 2, height - 78, width - 160);

  return canvas.toDataURL("image/png");
}
