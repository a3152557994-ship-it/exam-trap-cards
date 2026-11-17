import {
  PRODUCT_SLUG,
  FREE_QUESTION_LIMIT,
  ORDER_CHANNELS,
  MODULES,
  QUESTIONS,
  createInitialStudyState,
  getFilteredDeck,
  submitAnswer,
  toggleMistakeBookmark,
  recordEbbinghausReview,
  getEbbinghausQueue,
  exportMistakeReportMarkdown,
  verifyLicenseToken,
} from "./trap-cards-engine.js";

const STORAGE_STATE_KEY = "opc_exam_trap_study_v1";
const STORAGE_LICENSE_KEY = "opc_exam_trap_license_v1";

let studyState = loadStudyState();
let isUnlocked = Boolean(globalThis.__OPC_OFFLINE_UNLOCKED__);
let licenseEmail = isUnlocked ? "离线完整版授权买家" : "";
let activeMode = "practice"; // "practice" | "mistakes" | "ebbinghaus" | "cram"
let activeModule = "all";
let currentCardPos = 0;
let revealedCramSet = new Set();

function loadStudyState() {
  try {
    const raw = localStorage.getItem(STORAGE_STATE_KEY);
    if (!raw) return createInitialStudyState();
    const parsed = JSON.parse(raw);
    return {
      attempts: parsed.attempts || {},
      mistakes: parsed.mistakes || {},
    };
  } catch {
    return createInitialStudyState();
  }
}

function saveStudyState() {
  try {
    localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(studyState));
  } catch {
    // Ignore storage quota errors in private mode
  }
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function restoreSavedLicense() {
  if (isUnlocked) return;
  try {
    const saved = localStorage.getItem(STORAGE_LICENSE_KEY);
    if (!saved) return;
    const res = await verifyLicenseToken(saved, { expectedProduct: PRODUCT_SLUG });
    if (res.valid) {
      isUnlocked = true;
      licenseEmail = res.payload?.e || "Pro已解锁";
    }
  } catch {
    // Ignore
  }
}

function getDeck() {
  return getFilteredDeck({ moduleId: activeModule, unlocked: isUnlocked });
}

function renderStatsAndTabs() {
  const attemptedIds = Object.keys(studyState.attempts);
  const correctCount = attemptedIds.filter((id) => studyState.attempts[id]?.correct).length;
  const accuracy = attemptedIds.length > 0 ? `${Math.round((correctCount / attemptedIds.length) * 100)}%` : "--";
  const queue = getEbbinghausQueue(studyState);

  document.getElementById("statProgress").textContent = `${attemptedIds.length}/${ isUnlocked ? QUESTIONS.length : FREE_QUESTION_LIMIT }`;
  document.getElementById("statAccuracy").textContent = accuracy;
  document.getElementById("statMistakes").textContent = String(queue.totalMistakes);
  document.getElementById("statDue").textContent = String(queue.due.length);

  const dueBadge = document.getElementById("dueBadge");
  if (queue.due.length > 0) {
    dueBadge.hidden = false;
    dueBadge.textContent = String(queue.due.length);
  } else {
    dueBadge.hidden = true;
  }

  const mistBadge = document.getElementById("mistakeBadge");
  if (queue.totalMistakes > 0) {
    mistBadge.hidden = false;
    mistBadge.textContent = String(queue.totalMistakes);
  } else {
    mistBadge.hidden = true;
  }

  const unlockBtn = document.getElementById("btnOpenUnlock");
  if (isUnlocked) {
    unlockBtn.textContent = "✓ 全40题已解锁";
    unlockBtn.classList.add("is-unlocked");
  } else {
    unlockBtn.textContent = "解锁全40题 · ¥19.9";
    unlockBtn.classList.remove("is-unlocked");
  }

  document.querySelectorAll(".mode-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === activeMode);
  });
}

function renderModuleFilter() {
  const bar = document.getElementById("moduleBar");
  if (activeMode !== "practice" && activeMode !== "cram") {
    bar.style.display = "none";
    return;
  }
  bar.style.display = "flex";
  const items = [
    { id: "all", label: `全部 (${QUESTIONS.length})` },
    ...MODULES.map((m) => ({
      id: m.id,
      label: `${m.shortName} (${QUESTIONS.filter((q) => q.module === m.id).length})`,
    })),
  ];

  bar.innerHTML = items
    .map(
      (it) =>
        `<button type="button" class="mod-chip ${activeModule === it.id ? "active" : ""}" data-mod="${it.id}">${escapeHtml(it.label)}</button>`
    )
    .join("");

  bar.querySelectorAll(".mod-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeModule = btn.dataset.mod;
      currentCardPos = 0;
      renderAll();
    });
  });
}

function renderPracticeView(stageEl) {
  const deck = getDeck();
  if (currentCardPos >= deck.length) currentCardPos = Math.max(0, deck.length - 1);
  const card = deck[currentCardPos];
  const bottomNav = document.getElementById("bottomNav");
  bottomNav.style.display = "block";

  document.getElementById("btnPrevCard").disabled = currentCardPos <= 0;
  document.getElementById("btnNextCard").disabled = currentCardPos >= deck.length - 1;
  document.getElementById("btnQuickStar").textContent =
    card && studyState.mistakes[card.id] ? "★ 已在错题本" : "☆ 加入待复习";

  if (!card) {
    stageEl.innerHTML = `<div class="list-card">暂无题目</div>`;
    return;
  }

  if (card.locked) {
    stageEl.innerHTML = `
      <div class="lock-gate-card" id="swipeSurface">
        <div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">第 ${currentCardPos + 1} / ${deck.length} 题 · ${escapeHtml(card.examTag)}</div>
        <h2 class="lock-gate-title">🔒 已刷完前 ${FREE_QUESTION_LIMIT} 道免费高频陷阱体验卡</h2>
        <p class="lock-gate-desc">
          本题属于完整版深度易错库（考场错选率 <strong>${escapeHtml(card.errorRate)}</strong>）。<br>
          解锁完整版即可畅刷全部 <strong>40 道真题级高频挖坑题 + 40 条 5 秒秒杀口诀 + 个人错题本一键导出打印</strong>！
        </p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <button type="button" class="cta-primary-btn" id="gateUnlockBtn">输入激活码 / ¥19.9 自动秒发解锁</button>
          <button type="button" class="cta-secondary-btn" id="gateBackFreeBtn">回到第 1 题重刷</button>
        </div>
        <p class="swipe-hint">支持左右滑动切换卡片 · 键盘 ← / → 翻页</p>
      </div>
    `;
    document.getElementById("gateUnlockBtn").addEventListener("click", openUnlockModal);
    document.getElementById("gateBackFreeBtn").addEventListener("click", () => {
      currentCardPos = 0;
      renderAll();
    });
    attachSwipeHandlers(document.getElementById("swipeSurface"));
    return;
  }

  const attempt = studyState.attempts[card.id];
  const isStarred = Boolean(studyState.mistakes[card.id]);

  const optionsHtml = ["A", "B", "C", "D"]
    .map((key) => {
      let cls = "opt-btn";
      let baitBadge = "";
      if (attempt) {
        if (key === card.answer) cls += " is-correct";
        else if (key === attempt.choice && !attempt.correct) cls += " is-wrong";
        if (key === card.commonWrong) {
          baitBadge = `<span class="opt-bait-tag">⚠️ ${escapeHtml(card.errorRate)}考生误选坑</span>`;
        }
      }
      return `
        <button type="button" class="${cls}" data-choice="${key}">
          <span class="opt-key">${key}</span>
          <span>${escapeHtml(card.options[key])}${baitBadge}</span>
        </button>
      `;
    })
    .join("");

  const analysisHtml = attempt
    ? `
      <div class="analysis-panel">
        <div class="verdict-banner ${attempt.correct ? "ok" : "bad"}">
          ${
            attempt.correct
              ? `✅ 稳准避坑！正确答案 ${card.answer}`
              : `❌ 掉进出题人陷阱（你选了 ${attempt.choice}，正确答案是 ${card.answer}，已自动收入错题本）`
          }
        </div>
        <div class="trap-box"><strong>🎯 出题人挖坑点：</strong>${escapeHtml(card.trapPoint)}</div>
        <div class="mnemonic-box">⚡ 5秒秒杀口诀：${escapeHtml(card.mnemonic)}</div>
      </div>
    `
    : "";

  stageEl.innerHTML = `
    <article class="question-card" id="swipeSurface">
      <div class="card-meta-row">
        <div class="meta-left">
          <span class="q-index-pill">${escapeHtml(card.id)} · ${currentCardPos + 1}/${deck.length}</span>
          <span class="q-tag-pill">${escapeHtml(card.examTag)}</span>
          <span class="q-err-pill">错选率 ${escapeHtml(card.errorRate)}</span>
        </div>
        <button type="button" class="bookmark-btn ${isStarred ? "starred" : ""}" id="cardStarBtn">
          ${isStarred ? "★ 已入错题本" : "☆ 收藏陷阱"}
        </button>
      </div>
      <h2 class="q-stem">${escapeHtml(card.stem)}</h2>
      <div class="options-list">${optionsHtml}</div>
      ${analysisHtml}
      <div class="swipe-hint">手指左右滑卡切题 · 点选选项秒判分并自动建立艾宾浩斯复习</div>
    </article>
  `;

  stageEl.querySelectorAll(".opt-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const res = submitAnswer(studyState, {
        questionId: card.id,
        choice: btn.dataset.choice,
        unlocked: isUnlocked,
      });
      if (res.allowed) {
        studyState = res.state;
        saveStudyState();
        renderAll();
      }
    });
  });

  document.getElementById("cardStarBtn").addEventListener("click", () => {
    studyState = toggleMistakeBookmark(studyState, { questionId: card.id });
    saveStudyState();
    renderAll();
  });

  attachSwipeHandlers(document.getElementById("swipeSurface"));
}

function renderMistakesView(stageEl) {
  document.getElementById("bottomNav").style.display = "none";
  const mistakeIds = Object.keys(studyState.mistakes);
  const items = QUESTIONS.filter((q) => Boolean(studyState.mistakes[q.id]));

  const headerActions = `
    <div class="list-card" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
      <div>
        <div style="font-weight:800;font-size:15px;">📒 个人高频陷阱错题本（${items.length} 题）</div>
        <div style="font-size:12px;color:#94a3b8;">答错题目自动收录，考前一键导出 Markdown / 打印背诵单</div>
      </div>
      <button type="button" class="cta-primary-btn" id="btnExportMistakes" style="padding:8px 14px;font-size:12.5px;">
        ${isUnlocked ? "📥 导出错题与口诀 (.md)" : "🔒 导出错题本 (需激活码)"}
      </button>
    </div>
  `;

  if (items.length === 0) {
    stageEl.innerHTML = `
      ${headerActions}
      <div class="list-card" style="text-align:center;color:#94a3b8;padding:28px 16px;">
        还没有收录错题。去「沉浸刷题」做几道试试，答错或点击「☆ 收藏陷阱」会自动收纳到这里！
      </div>
    `;
  } else {
    stageEl.innerHTML =
      headerActions +
      items
        .map((q) => {
          const m = studyState.mistakes[q.id];
          return `
            <div class="list-card">
              <div class="list-card-head">
                <span class="q-index-pill">${escapeHtml(q.id)} · ${escapeHtml(q.examTag)}</span>
                <button type="button" class="bookmark-btn" data-remove-id="${q.id}">移出</button>
              </div>
              <div style="font-weight:700;font-size:14px;margin:6px 0;">${escapeHtml(q.stem)}</div>
              <div style="font-size:13px;color:#34d399;margin-bottom:6px;">✅ 正解 ${q.answer}：${escapeHtml(q.options[q.answer])}</div>
              <div style="font-size:12.5px;color:#cbd5e1;margin-bottom:8px;">🎯 ${escapeHtml(q.trapPoint)}</div>
              <div class="mnemonic-box" style="font-size:12.5px;">⚡ ${escapeHtml(q.mnemonic)}</div>
              <div style="font-size:11px;color:#94a3b8;margin-top:6px;">记忆进度：${m.mastered ? "已彻底吃透" : `第 ${m.stage + 1}/6 轮`}</div>
            </div>
          `;
        })
        .join("");
  }

  document.getElementById("btnExportMistakes").addEventListener("click", () => {
    if (!isUnlocked) {
      openUnlockModal();
      return;
    }
    const exp = exportMistakeReportMarkdown(studyState, { unlocked: true });
    if (exp.allowed) {
      const blob = new Blob([exp.markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `2026考公教资高频陷阱错题本_${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });

  stageEl.querySelectorAll("[data-remove-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      studyState = toggleMistakeBookmark(studyState, { questionId: btn.dataset.removeId });
      saveStudyState();
      renderAll();
    });
  });
}

function renderEbbinghausView(stageEl) {
  document.getElementById("bottomNav").style.display = "none";
  const queue = getEbbinghausQueue(studyState);

  const summaryHtml = `
    <div class="list-card">
      <div style="font-weight:800;font-size:15px;margin-bottom:4px;">🧠 艾宾浩斯抗遗忘待复习队列</div>
      <div style="font-size:12.5px;color:#94a3b8;">
        按 <strong>5分钟 → 1天 → 2天 → 4天 → 7天 → 15天</strong> 科学排期：当前到点待复习 <strong style="color:#fca5a5;">${queue.due.length}</strong> 题 ｜ 排队中 ${queue.upcoming.length} 题 ｜ 已彻底吃透 ${queue.mastered.length} 题
      </div>
    </div>
  `;

  const activeList = queue.due.length > 0 ? queue.due : queue.upcoming;
  if (activeList.length === 0) {
    stageEl.innerHTML = `
      ${summaryHtml}
      <div class="list-card" style="text-align:center;color:#94a3b8;padding:26px 14px;">
        ${queue.mastered.length > 0 ? "🎉 太强了！错题本所有陷阱均已完成 6 轮艾宾浩斯记忆闭环！" : "暂无待复习错题，先去「沉浸刷题」捕获你的知识盲区吧！"}
      </div>
    `;
    return;
  }

  stageEl.innerHTML =
    summaryHtml +
    activeList
      .map(
        (item) => `
        <div class="list-card">
          <div class="list-card-head">
            <span class="q-index-pill">${escapeHtml(item.question.id)} · ${escapeHtml(item.stageLabel)}</span>
            <span class="q-err-pill">${queue.due.includes(item) ? "⏰ 已到复习点" : "⏳ 计划待复习"}</span>
          </div>
          <div style="font-weight:700;font-size:14.5px;margin:8px 0;">${escapeHtml(item.question.stem)}</div>
          <div class="mnemonic-box" style="margin-top:8px;">
            正解 <strong>${item.question.answer}</strong>（诱饵项 ${item.question.commonWrong}）<br>
            ⚡ 口诀：${escapeHtml(item.question.mnemonic)}
          </div>
          <div class="review-actions">
            <button type="button" class="cta-secondary-btn" data-rev-id="${item.question.id}" data-rem="0" style="border-color:rgba(239,68,68,0.45);color:#fca5a5;">
              模糊了 · 重回第1轮
            </button>
            <button type="button" class="cta-primary-btn" data-rev-id="${item.question.id}" data-rem="1" style="padding:9px 12px;font-size:13px;">
              秒答稳了 · 进下一轮
            </button>
          </div>
        </div>
      `
      )
      .join("");

  stageEl.querySelectorAll("[data-rev-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      studyState = recordEbbinghausReview(studyState, {
        questionId: btn.dataset.revId,
        remembered: btn.dataset.rem === "1",
      });
      saveStudyState();
      renderAll();
    });
  });
}

function renderCramView(stageEl) {
  document.getElementById("bottomNav").style.display = "none";
  const deck = getDeck();

  const topBanner = `
    <div class="list-card" style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
      <div>
        <div style="font-weight:800;font-size:15px;">⚡ 考前 15 分钟秒杀口诀遮罩背诵卡</div>
        <div style="font-size:12px;color:#94a3b8;">点击模糊口诀条即可翻开自测记忆（免费开放前 ${FREE_QUESTION_LIMIT} 条，完整版全 40 条）</div>
      </div>
      <button type="button" class="cta-secondary-btn" id="btnToggleAllCram" style="padding:6px 12px;font-size:12px;">
        ${revealedCramSet.size > 0 ? "全部遮住自测" : "全部翻开速读"}
      </button>
    </div>
  `;

  const cardsHtml = deck
    .map((q) => {
      if (q.locked) {
        return `
          <div class="list-card" style="opacity:0.82;">
            <div class="list-card-head">
              <span class="q-tag-pill">${escapeHtml(q.id)} · ${escapeHtml(q.examTag)}</span>
              <span class="q-err-pill">🔒 Pro完整版口诀</span>
            </div>
            <div style="font-size:13px;color:#94a3b8;">解锁 ¥19.9 完整版即可查看全部 40 条高频陷阱秒杀口诀与离线打印包</div>
          </div>
        `;
      }
      const revealed = revealedCramSet.has(q.id);
      return `
        <div class="list-card">
          <div class="list-card-head">
            <span class="q-index-pill">${escapeHtml(q.id)} · ${escapeHtml(q.examTag)}</span>
            <span style="font-size:11px;color:#94a3b8;">${revealed ? "点击遮住" : "点击翻开"}</span>
          </div>
          <div class="cram-mask ${revealed ? "" : "blurred"}" data-cram-id="${q.id}">
            <span>⚡ ${escapeHtml(q.mnemonic)}</span>
          </div>
        </div>
      `;
    })
    .join("");

  stageEl.innerHTML = topBanner + cardsHtml;

  document.getElementById("btnToggleAllCram").addEventListener("click", () => {
    if (revealedCramSet.size > 0) {
      revealedCramSet.clear();
    } else {
      deck.filter((q) => !q.locked).forEach((q) => revealedCramSet.add(q.id));
    }
    renderAll();
  });

  stageEl.querySelectorAll("[data-cram-id]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.dataset.cramId;
      if (revealedCramSet.has(id)) revealedCramSet.delete(id);
      else revealedCramSet.add(id);
      renderAll();
    });
  });
}

function attachSwipeHandlers(el) {
  if (!el) return;
  let startX = 0;
  let startY = 0;
  el.addEventListener(
    "touchstart",
    (e) => {
      startX = e.changedTouches[0].clientX;
      startY = e.changedTouches[0].clientY;
    },
    { passive: true }
  );
  el.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        const deck = getDeck();
        if (dx < 0 && currentCardPos < deck.length - 1) {
          currentCardPos += 1;
          renderAll();
        } else if (dx > 0 && currentCardPos > 0) {
          currentCardPos -= 1;
          renderAll();
        }
      }
    },
    { passive: true }
  );
}

function openUnlockModal() {
  const modal = document.getElementById("unlockModal");
  modal.hidden = false;
  const statusEl = document.getElementById("licenseStatusMsg");
  statusEl.textContent = isUnlocked
    ? `当前已解锁完整版（授权：${licenseEmail}）`
    : "输入 OPC1. 开头的激活码，浏览器本地毫秒级 Ed25519 公钥验签即刻解锁全 40 题与错题导出。";
}

function closeUnlockModal() {
  document.getElementById("unlockModal").hidden = true;
}

function renderAll() {
  renderStatsAndTabs();
  renderModuleFilter();
  const stageEl = document.getElementById("mainStage");
  if (activeMode === "practice") renderPracticeView(stageEl);
  else if (activeMode === "mistakes") renderMistakesView(stageEl);
  else if (activeMode === "ebbinghaus") renderEbbinghausView(stageEl);
  else renderCramView(stageEl);
}

async function init() {
  await restoreSavedLicense();

  document.querySelectorAll(".mode-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeMode = btn.dataset.mode;
      renderAll();
    });
  });

  document.getElementById("btnPrevCard").addEventListener("click", () => {
    if (currentCardPos > 0) {
      currentCardPos -= 1;
      renderAll();
    }
  });

  document.getElementById("btnNextCard").addEventListener("click", () => {
    const deck = getDeck();
    if (currentCardPos < deck.length - 1) {
      currentCardPos += 1;
      renderAll();
    }
  });

  document.getElementById("btnQuickStar").addEventListener("click", () => {
    const deck = getDeck();
    const card = deck[currentCardPos];
    if (card && !card.locked) {
      studyState = toggleMistakeBookmark(studyState, { questionId: card.id });
      saveStudyState();
      renderAll();
    }
  });

  document.getElementById("btnOpenUnlock").addEventListener("click", openUnlockModal);
  document.getElementById("btnCloseModal").addEventListener("click", closeUnlockModal);
  document.getElementById("unlockModal").addEventListener("click", (e) => {
    if (e.target.id === "unlockModal") closeUnlockModal();
  });

  document.getElementById("btnVerifyToken").addEventListener("click", async () => {
    const input = document.getElementById("licenseTokenInput").value.trim();
    const statusEl = document.getElementById("licenseStatusMsg");
    const res = await verifyLicenseToken(input, { expectedProduct: PRODUCT_SLUG });
    if (res.valid) {
      isUnlocked = true;
      licenseEmail = res.payload?.e || "Pro用户";
      try {
        localStorage.setItem(STORAGE_LICENSE_KEY, input);
      } catch {}
      statusEl.style.color = "#34d399";
      statusEl.textContent = `✅ Ed25519 验签通过！已解锁全部 40 道真题级陷阱卡与错题导出（${licenseEmail}）`;
      renderAll();
      setTimeout(closeUnlockModal, 900);
    } else {
      statusEl.style.color = "#f87171";
      statusEl.textContent = `❌ 验签未通过：${res.message || res.reason}`;
    }
  });

  document.getElementById("btnCopyOrderInfo").addEventListener("click", async () => {
    const orderText = `你好，购买【2026考公教资高频陷阱刷题卡 (${PRODUCT_SLUG})】完整版（${ORDER_CHANNELS.priceText}，含 OPC1. 激活码 + 离线完整解锁包），接收邮箱：`;
    try {
      await navigator.clipboard.writeText(orderText);
      document.getElementById("btnCopyOrderInfo").textContent = "✅ 已复制下单口令";
    } catch {
      // Fallback ignored
    }
  });

  window.addEventListener("keydown", (e) => {
    if (activeMode !== "practice" || !document.getElementById("unlockModal").hidden) return;
    const deck = getDeck();
    if (e.key === "ArrowRight" && currentCardPos < deck.length - 1) {
      currentCardPos += 1;
      renderAll();
    } else if (e.key === "ArrowLeft" && currentCardPos > 0) {
      currentCardPos -= 1;
      renderAll();
    } else if (["1", "2", "3", "4", "a", "b", "c", "d", "A", "B", "C", "D"].includes(e.key)) {
      const map = { "1": "A", "2": "B", "3": "C", "4": "D" };
      const choice = map[e.key] || e.key.toUpperCase();
      const card = deck[currentCardPos];
      if (card && !card.locked) {
        const res = submitAnswer(studyState, { questionId: card.id, choice, unlocked: isUnlocked });
        if (res.allowed) {
          studyState = res.state;
          saveStudyState();
          renderAll();
        }
      }
    }
  });

  renderAll();
}

init();
