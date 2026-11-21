import test from "node:test";
import assert from "node:assert/strict";
import { ALL_POOP_CODES } from "../types-data";
import {
  DICTIONARIES,
  formatTemplate,
  getDictionary,
  isRtl,
  parseStoredLanguage,
  toggleLanguage,
} from "./index";

test("language helpers toggle, detect RTL, and parse stored values safely", () => {
  assert.equal(isRtl("en"), false);
  assert.equal(isRtl("fa"), true);
  assert.equal(toggleLanguage("en"), "fa");
  assert.equal(toggleLanguage("fa"), "en");
  assert.equal(parseStoredLanguage("fa"), "fa");
  assert.equal(parseStoredLanguage("en"), "en");
  assert.equal(parseStoredLanguage(null), "en");
  assert.equal(parseStoredLanguage("unknown"), "en");
});

test("formatTemplate substitutes variables and leaves unknown tokens intact", () => {
  assert.equal(
    formatTemplate("{count} / {max} photos", { count: 2, max: 5 }),
    "2 / 5 photos"
  );
  assert.equal(
    formatTemplate("نمایش {count} از ۱۶", { count: 8 }),
    "نمایش 8 از ۱۶"
  );
  assert.equal(formatTemplate("Hello {missing}", {}), "Hello {missing}");
});

test("both English and Persian dictionaries cover all 16 types, 7 Bristol shapes, 4 axes, and 9 studies", () => {
  for (const lang of ["en", "fa"] as const) {
    const dict = getDictionary(lang);
    assert.equal(dict.lang, lang);
    assert.equal(dict.dir, lang === "fa" ? "rtl" : "ltr");
    assert.equal(dict.axes.length, 4);
    assert.equal(dict.home.heroStickers.length, 4);
    assert.equal(dict.analyzer.loadingMessages.length, 4);

    // All 16 PoopType codes
    for (const code of ALL_POOP_CODES) {
      const entry = dict.types[code];
      assert.ok(entry, `${lang} missing type ${code}`);
      assert.ok(entry.nickname.trim().length > 0, `${lang} empty nickname for ${code}`);
      assert.ok(entry.blurb.trim().length > 0, `${lang} empty blurb for ${code}`);
      assert.equal(entry.strengths.length, 2);
      assert.equal(entry.flaws.length, 2);
      assert.ok(entry.famousFor.trim().length > 0);
      assert.ok(entry.moodLabel.trim().length > 0);
      assert.ok(entry.styleLabel.trim().length > 0);
    }

    // All 7 Bristol shapes
    for (let n = 1; n <= 7; n++) {
      const b = dict.bristol[n];
      assert.ok(b, `${lang} missing Bristol ${n}`);
      assert.ok(b.name.trim().length > 0);
      assert.ok(b.shortLabel.trim().length > 0);
      assert.ok(b.traitNote.trim().length > 0);
    }

    // All 9 Science citations (#1 through #9)
    const allStudies = [
      ...dict.science.studies.history,
      ...dict.science.studies.bristol,
      ...dict.science.studies.microbiome,
      ...dict.science.studies.ibs,
    ];
    assert.equal(allStudies.length, 9);
    const ids = allStudies.map((s) => s.id);
    assert.deepEqual(ids, ["#1", "#2", "#3", "#4", "#5", "#6", "#7", "#8", "#9"]);
    for (const s of allStudies) {
      assert.ok(s.headline.trim().length > 0);
      assert.ok(s.citation.trim().length > 0);
      assert.ok(s.details.trim().length > 0);
    }

    // Frequently Asked Questions on main page
    assert.ok(dict.home.faq.title.trim().length > 0);
    assert.equal(dict.home.faq.items.length, 6);
    for (const faqItem of dict.home.faq.items) {
      assert.ok(faqItem.question.trim().length > 0);
      assert.ok(faqItem.answer.trim().length > 0);
    }
  }

  // English FAQ avoids dense technical jargon so a 5-year-old can understand it
  const enFaqText = DICTIONARIES.en.home.faq.items
    .map((item) => `${item.question} ${item.answer}`)
    .join(" ");
  assert.doesNotMatch(
    enFaqText,
    /\b(SHA-?256|Sobel|EXIF|Canvas|RGBA|heuristic|algorithm|pixel|deterministic|luminance)\b/i
  );

  // Persian dictionary actually contains Persian characters
  assert.match(DICTIONARIES.fa.home.heroTitleHighlight, /[\u0600-\u06FF]/);
  assert.match(DICTIONARIES.fa.home.faq.title, /[\u0600-\u06FF]/);
  assert.match(DICTIONARIES.fa.footer.disclaimer, /[\u0600-\u06FF]/);
});
