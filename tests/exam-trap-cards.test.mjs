import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  PUBLIC_SPKI_BASE64,
  PRODUCT_SLUG,
  FREE_QUESTION_LIMIT,
  MODULES,
  QUESTIONS,
  EBBINGHAUS_STAGES,
  createInitialStudyState,
  getFilteredDeck,
  submitAnswer,
  toggleMistakeBookmark,
  recordEbbinghausReview,
  getEbbinghausQueue,
  exportMistakeReportMarkdown,
  verifyLicenseToken,
} from "../src/trap-cards-engine.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function toBase64Url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function signTestToken(payloadObj, privateKey) {
  const payloadB64 = toBase64Url(Buffer.from(JSON.stringify(payloadObj), "utf8"));
  const sig = crypto.sign(null, Buffer.from(`OPC1.${payloadB64}`, "utf8"), privateKey);
  return `OPC1.${payloadB64}.${toBase64Url(sig)}`;
}

test("1. Public docs mirror matches src byte-identically and never leaks pre-unlocked flag", () => {
  const srcText = fs.readFileSync(path.join(ROOT, "src", "trap-cards-engine.mjs"), "utf8");
  const docsText = fs.readFileSync(path.join(ROOT, "docs", "trap-cards-engine.js"), "utf8");
  assert.equal(srcText, docsText);

  const publicHtml = fs.readFileSync(path.join(ROOT, "docs", "index.html"), "utf8");
  const publicApp = fs.readFileSync(path.join(ROOT, "docs", "app.js"), "utf8");
  assert.ok(!publicHtml.includes("__OPC_OFFLINE_UNLOCKED__ = true"), "Public index.html must NOT pre-unlock full bank");
  assert.ok(!publicApp.includes("__OPC_OFFLINE_UNLOCKED__ = true"), "Public app.js must NOT pre-unlock full bank");
});

test("2. Question bank contains exactly 40 authentic questions (10 per module) with rich trap analysis & mnemonics", () => {
  assert.equal(PRODUCT_SLUG, "exam-trap-cards");
  assert.equal(FREE_QUESTION_LIMIT, 12);
  assert.equal(QUESTIONS.length, 40);
  assert.equal(MODULES.length, 4);

  const ids = new Set();
  const byModule = { verbal_logic: 0, data_analysis: 0, shenlun_format: 0, teacher_law: 0 };

  for (const q of QUESTIONS) {
    assert.ok(!ids.has(q.id), `Duplicate question id: ${q.id}`);
    ids.add(q.id);
    assert.ok(q.module in byModule, `Invalid module ${q.module}`);
    byModule[q.module] += 1;

    assert.ok(q.stem.length >= 25, `${q.id} stem too short`);
    for (const opt of ["A", "B", "C", "D"]) {
      assert.ok(q.options[opt] && q.options[opt].length >= 2, `${q.id} missing option ${opt}`);
    }
    assert.ok(["A", "B", "C", "D"].includes(q.answer), `${q.id} invalid answer`);
    assert.ok(["A", "B", "C", "D"].includes(q.commonWrong), `${q.id} invalid commonWrong`);
    assert.notEqual(q.answer, q.commonWrong, `${q.id} answer and commonWrong must differ`);
    assert.ok(q.trapPoint.length >= 45, `${q.id} trapPoint must be detailed`);
    assert.ok(q.mnemonic.length >= 15, `${q.id} mnemonic must be substantive`);
  }

  assert.deepEqual(byModule, {
    verbal_logic: 10,
    data_analysis: 10,
    shenlun_format: 10,
    teacher_law: 10,
  });

  // First 12 free questions cover 3 from each of the 4 modules
  const free12 = QUESTIONS.slice(0, 12);
  const freeByMod = { verbal_logic: 0, data_analysis: 0, shenlun_format: 0, teacher_law: 0 };
  for (const q of free12) freeByMod[q.module] += 1;
  assert.deepEqual(freeByMod, {
    verbal_logic: 3,
    data_analysis: 3,
    shenlun_format: 3,
    teacher_law: 3,
  });
});

test("3. Free 12-question trial gate, grading, automatic mistake collection, Ebbinghaus 6-stage curve & export", () => {
  let state = createInitialStudyState();
  const baseNow = 1_760_000_000_000;

  const freeDeck = getFilteredDeck({ unlocked: false });
  assert.equal(freeDeck.filter((q) => !q.locked).length, 12);
  assert.equal(freeDeck.filter((q) => q.locked).length, 28);

  // Attempting Q13 while locked must be blocked
  const blocked = submitAnswer(state, { questionId: "Q13", choice: "B", unlocked: false, nowMs: baseNow });
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.reason, "LOCKED_PRO_QUESTION");

  // Answering Q01 wrong (picking trap bait A instead of B) auto-collects into mistake book at stage 0
  const wrongRes = submitAnswer(state, { questionId: "Q01", choice: "A", unlocked: false, nowMs: baseNow });
  assert.equal(wrongRes.allowed, true);
  assert.equal(wrongRes.isCorrect, false);
  assert.equal(wrongRes.hitBait, true);
  state = wrongRes.state;
  assert.ok(state.mistakes.Q01);
  assert.equal(state.mistakes.Q01.stage, 0);

  // Before 5 min, Q01 is in upcoming; at +6 min, Q01 moves to due
  assert.equal(getEbbinghausQueue(state, baseNow + 60_000).due.length, 0);
  assert.equal(getEbbinghausQueue(state, baseNow + 6 * 60_000).due.length, 1);

  // Progress through all 6 Ebbinghaus stages to mastered
  let t = baseNow + 6 * 60_000;
  for (let i = 0; i < EBBINGHAUS_STAGES.length; i += 1) {
    state = recordEbbinghausReview(state, { questionId: "Q01", remembered: true, nowMs: t });
    t += 20 * 24 * 3600 * 1000;
  }
  assert.equal(state.mistakes.Q01.mastered, true);
  assert.equal(getEbbinghausQueue(state, t).mastered.length, 1);

  // Resetting when forgotten puts back to stage 0
  state = recordEbbinghausReview(state, { questionId: "Q01", remembered: false, nowMs: t });
  assert.equal(state.mistakes.Q01.stage, 0);
  assert.equal(state.mistakes.Q01.mastered, false);

  // Bookmark toggle & Markdown export gating
  state = toggleMistakeBookmark(state, { questionId: "Q04", nowMs: t });
  assert.ok(state.mistakes.Q04);

  const lockedExport = exportMistakeReportMarkdown(state, { unlocked: false });
  assert.equal(lockedExport.allowed, false);

  const unlockedExport = exportMistakeReportMarkdown(state, { unlocked: true });
  assert.equal(unlockedExport.allowed, true);
  assert.equal(unlockedExport.count, 2);
  assert.ok(unlockedExport.markdown.includes("Q01"));
  assert.ok(unlockedExport.markdown.includes("Q04"));
});

test("4. Ed25519 OPC1. license verification validates genuine tokens and rejects tampered/mismatched/expired tokens", async () => {
  // Ephemeral Ed25519 keypair test
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
  const testSpkiB64 = publicKey.export({ format: "der", type: "spki" }).toString("base64");
  const nowSec = 1_790_000_000;

  const validToken = signTestToken(
    { v: 1, p: "exam-trap-cards", e: "student@example.com", plan: "pro", iat: nowSec, exp: 0 },
    privateKey
  );
  const okRes = await verifyLicenseToken(validToken, {
    expectedProduct: "exam-trap-cards",
    publicSpkiBase64: testSpkiB64,
    nowSec,
  });
  assert.equal(okRes.valid, true);
  assert.equal(okRes.payload.e, "student@example.com");

  // Wildcard "*" product token
  const wildcardToken = signTestToken({ v: 1, p: "*", e: "all@example.com", iat: nowSec, exp: 0 }, privateKey);
  const wildRes = await verifyLicenseToken(wildcardToken, {
    expectedProduct: "exam-trap-cards",
    publicSpkiBase64: testSpkiB64,
    nowSec,
  });
  assert.equal(wildRes.valid, true);

  // Wrong product slug
  const wrongProd = signTestToken({ v: 1, p: "geo-doctor", e: "a@b.com", iat: nowSec, exp: 0 }, privateKey);
  const wrongRes = await verifyLicenseToken(wrongProd, {
    expectedProduct: "exam-trap-cards",
    publicSpkiBase64: testSpkiB64,
    nowSec,
  });
  assert.equal(wrongRes.valid, false);
  assert.equal(wrongRes.reason, "PRODUCT_MISMATCH");

  // Expired token
  const expiredTok = signTestToken(
    { v: 1, p: "exam-trap-cards", e: "a@b.com", iat: nowSec - 86400, exp: nowSec - 10 },
    privateKey
  );
  const expRes = await verifyLicenseToken(expiredTok, {
    expectedProduct: "exam-trap-cards",
    publicSpkiBase64: testSpkiB64,
    nowSec,
  });
  assert.equal(expRes.valid, false);
  assert.equal(expRes.reason, "EXPIRED");

  // Tampered signature against production PUBLIC_SPKI_BASE64
  const badRes = await verifyLicenseToken(validToken, {
    expectedProduct: "exam-trap-cards",
    publicSpkiBase64: PUBLIC_SPKI_BASE64,
    nowSec,
  });
  assert.equal(badRes.valid, false);
  assert.equal(badRes.reason, "BAD_SIGNATURE");
});
