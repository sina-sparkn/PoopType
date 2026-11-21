import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzePixelBuffer,
  combinePortfolioAnalyses,
  decodeResultParams,
  encodeResultParams,
  sha256Hex,
  validateFileMeta,
  VIBE_ALERT_MESSAGE,
} from "./analyze";
import { ALL_POOP_CODES, POOP_TYPES } from "./types-data";

function makeCanvasBuffer(
  width: number,
  height: number,
  bg: [number, number, number]
): Uint8ClampedArray {
  const buf = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    buf[i * 4] = bg[0];
    buf[i * 4 + 1] = bg[1];
    buf[i * 4 + 2] = bg[2];
    buf[i * 4 + 3] = 255;
  }
  return buf;
}

function paintCircle(
  buf: Uint8ClampedArray,
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  color: [number, number, number]
) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (Math.hypot(x - cx, y - cy) <= radius) {
        const idx = (y * width + x) * 4;
        buf[idx] = color[0];
        buf[idx + 1] = color[1];
        buf[idx + 2] = color[2];
      }
    }
  }
}

function paintRect(
  buf: Uint8ClampedArray,
  width: number,
  height: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: [number, number, number]
) {
  for (let y = Math.max(0, y0); y < Math.min(height, y1); y++) {
    for (let x = Math.max(0, x0); x < Math.min(width, x1); x++) {
      const idx = (y * width + x) * 4;
      buf[idx] = color[0];
      buf[idx + 1] = color[1];
      buf[idx + 2] = color[2];
    }
  }
}

test("all 16 PoopType codes exist with valid matches and no real celebrities", () => {
  assert.equal(ALL_POOP_CODES.length, 16);
  assert.equal(POOP_TYPES.PPTO.nickname, "The Vault Keeper");
  assert.equal(POOP_TYPES.PPLO.nickname, "The Golden Planner");

  for (const code of ALL_POOP_CODES) {
    const t = POOP_TYPES[code];
    assert.equal(t.code, code);
    assert.ok(t.bestMatch in POOP_TYPES, `bestMatch valid for ${code}`);
    assert.ok(t.worstMatch in POOP_TYPES, `worstMatch valid for ${code}`);
    assert.equal(t.strengths.length, 2);
    assert.equal(t.flaws.length, 2);
    assert.match(t.famousFor, /fictional/i);
  }
});

test("deterministic SHA-256 hashing produces identical result for identical pixel buffer", async () => {
  const buf = makeCanvasBuffer(64, 64, [245, 245, 245]);
  paintRect(buf, 64, 64, 10, 26, 54, 38, [96, 62, 34]);
  const hash1 = await sha256Hex(new Uint8Array(buf.buffer));
  const hash2 = await sha256Hex(new Uint8Array(buf.buffer));
  assert.equal(hash1, hash2);

  const r1 = analyzePixelBuffer(buf, 64, 64, hash1);
  const r2 = analyzePixelBuffer(buf, 64, 64, hash2);
  assert.deepEqual(r1, r2);

  const p1 = await combinePortfolioAnalyses([r1]);
  const p2 = await combinePortfolioAnalyses([r2]);
  assert.deepEqual(p1, p2);
});

test("many small dark glossy pellets map to Packed (Bristol 1-2), Toasted, Oily", async () => {
  const buf = makeCanvasBuffer(96, 96, [245, 245, 242]);
  const centers: [number, number][] = [
    [24, 24],
    [48, 22],
    [72, 28],
    [30, 56],
    [54, 60],
    [72, 66],
  ];
  for (const [cx, cy] of centers) {
    paintCircle(buf, 96, 96, cx, cy, 8, [68, 42, 24]);
    // Specular glossy highlight dot inside each pellet
    paintCircle(buf, 96, 96, cx - 2, cy - 2, 3, [248, 246, 242]);
  }
  const hash = await sha256Hex(new Uint8Array(buf.buffer));
  const res = analyzePixelBuffer(buf, 96, 96, hash);

  assert.ok(res.bristolType <= 2, `Expected Bristol 1-2, got ${res.bristolType}`);
  assert.equal(res.code[0], "P");
  assert.equal(res.code[2], "T");
  assert.equal(res.code[3], "O");
  assert.equal(res.vibeAlert, false);
});

test("wide flat ragged golden matte mass maps to Free-flowing (Bristol 5-7), Light, Dry", async () => {
  const buf = makeCanvasBuffer(96, 96, [250, 250, 248]);
  // Wide irregular light-brown splatter with alternating high-frequency noise for raggedness
  for (let y = 20; y < 76; y++) {
    for (let x = 20; x < 76; x++) {
      const checker = (x + y) % 3 === 0;
      const inBlob = Math.hypot(x - 48, y - 48) < 26 + ((x * 7 + y * 13) % 7);
      if (inBlob) {
        const idx = (y * 96 + x) * 4;
        buf[idx] = checker ? 210 : 148;
        buf[idx + 1] = checker ? 174 : 112;
        buf[idx + 2] = checker ? 105 : 62;
      }
    }
  }
  const hash = await sha256Hex(new Uint8Array(buf.buffer));
  const res = analyzePixelBuffer(buf, 96, 96, hash);

  assert.ok(res.bristolType >= 5, `Expected Bristol 5-7, got ${res.bristolType}`);
  assert.equal(res.code[0], "F");
  assert.equal(res.code[1], "R");
  assert.equal(res.code[2], "L");
  assert.equal(res.code[3], "D");
});

test("Vibe Alert triggers on strongly red, black/tarry, and pale/clay specimens", async () => {
  // Red specimen
  const redBuf = makeCanvasBuffer(64, 64, [245, 245, 245]);
  paintCircle(redBuf, 64, 64, 32, 32, 16, [195, 24, 24]);
  const redRes = analyzePixelBuffer(redBuf, 64, 64, "aaaaaaaaaaaaaaaa");
  assert.equal(redRes.vibeAlert, true);
  assert.equal(redRes.vibeReason, "red");

  // Black/tarry specimen
  const blackBuf = makeCanvasBuffer(64, 64, [245, 245, 245]);
  paintCircle(blackBuf, 64, 64, 32, 32, 16, [14, 12, 12]);
  const blackRes = analyzePixelBuffer(blackBuf, 64, 64, "bbbbbbbbbbbbbbbb");
  assert.equal(blackRes.vibeAlert, true);
  assert.equal(blackRes.vibeReason, "black");

  // Pale/clay specimen
  const paleBuf = makeCanvasBuffer(64, 64, [40, 42, 46]);
  paintCircle(paleBuf, 64, 64, 32, 32, 16, [196, 194, 186]);
  const paleRes = analyzePixelBuffer(paleBuf, 64, 64, "cccccccccccccccc");
  assert.equal(paleRes.vibeAlert, true);
  assert.equal(paleRes.vibeReason, "pale");

  assert.match(VIBE_ALERT_MESSAGE, /talk to a medical professional/i);
});

test("URL param encoding and decoding reconstructs complete result without images", async () => {
  const buf = makeCanvasBuffer(64, 64, [248, 248, 248]);
  paintRect(buf, 64, 64, 10, 26, 54, 38, [120, 82, 46]);
  const hash = await sha256Hex(new Uint8Array(buf.buffer));
  const single = analyzePixelBuffer(buf, 64, 64, hash);
  const portfolio = await combinePortfolioAnalyses([single]);

  const params = encodeResultParams(portfolio);
  const obj: Record<string, string> = {};
  params.forEach((v, k) => {
    obj[k] = v;
  });

  const reconstructed = decodeResultParams(portfolio.code, obj);
  assert.ok(reconstructed);
  assert.equal(reconstructed.code, portfolio.code);
  assert.equal(reconstructed.bristolType, portfolio.bristolType);
  assert.equal(reconstructed.confidence, portfolio.confidence);
  assert.deepEqual(reconstructed.bigFive, portfolio.bigFive);

  // Direct PPTO and PPLO URLs with minimal params also reconstruct cleanly
  const ppto = decodeResultParams("ppto", { b: "2", c: "94.7" });
  assert.ok(ppto);
  assert.equal(ppto.code, "PPTO");
  assert.equal(ppto.profile.nickname, "The Vault Keeper");

  const pplo = decodeResultParams("PPLO", { b: "4", c: "96.1" });
  assert.ok(pplo);
  assert.equal(pplo.code, "PPLO");
  assert.equal(pplo.profile.nickname, "The Golden Planner");

  // Invalid code returns null
  assert.equal(decodeResultParams("INTJ", {}), null);
});

test("validateFileMeta enforces max 8 MB and allowed image formats", () => {
  assert.equal(validateFileMeta({ name: "specimen.jpg", type: "image/jpeg", size: 1024 }), null);
  assert.equal(validateFileMeta({ name: "photo.heic", type: "", size: 2048 }), null);
  assert.ok(validateFileMeta({ name: "huge.png", type: "image/png", size: 9 * 1024 * 1024 }));
  assert.ok(validateFileMeta({ name: "notes.pdf", type: "application/pdf", size: 1024 }));
});
