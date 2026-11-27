import {
  MODULES,
  QUESTIONS,
  createInitialStudyState,
  getFilteredDeck,
  submitAnswer,
  toggleMistakeBookmark,
  recordEbbinghausReview,
  getEbbinghausQueue,
  exportMistakeReportMarkdown,
} from "./trap-cards-engine.js";

const STORAGE_STATE_KEY = "opc_exam_trap_study_v1";

let studyState = loadStudyState();
let isUnlocked = true;
let activeMode = "practice";
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
  } catch {}
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getDeck() {
  return getFilteredDeck({ moduleId: activeModule, unlocked: isUnlocked });
}

function renderStatsAndTabs() {
  const attemptedIds = Object.keys(studyState.attempts);
  const correctCount = attemptedIds.filter((id) => studyState.attempts[id]?.correct).length;
  const accuracy = attemptedIds.length > 0 ? `${Math.round((correctCount / attemptedIds.length) * 100)}%` : "--";
  const queue = getEbbinghausQueue(studyState);

  document.getElementById("statProgress").textContent = `${attemptedIds.length}/${QUESTIONS.length}`;
  document.getElementById("statAccuracy").textContent = accuracy;
  document.getElementById("statMistakes").textContent = String(queue.totalMistakes);
  document.getElementById("statDue").textContent = String(queue.due.length);

  const dueBadge = document.getElementById("dueBadge");
  dueBadge.hidden = queue.due.length === 0;
  if (queue.due.length > 0) dueBadge.textContent = String(queue.due.length);

  const mistBadge = document.getElementById("mistakeBadge");
  mistBadge.hidden = queue.totalMistakes === 0;
  if (queue.totalMistakes > 0) mistBadge.textContent = String(queue.totalMistakes);

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
      <div class="swipe-hint">手指左右滑卡切题 · 全部 40 道高频陷阱已免费解锁</div>
    </article>
  `;

  stageEl.querySelectorAll(".opt-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const res = submitAnswer(studyState, {
        questionId: card.id,
        choice: btn.dataset.choice,
        unlocked: true,
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
  const items = QUESTIONS.filter((q) => Boolean(studyState.mistakes[q.id]));

  const headerActions = `
    <div class="list-card" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
      <div>
        <div style="font-weight:800;font-size:15px;">📒 个人高频陷阱错题本（${items.length} 题）</div>
        <div style="font-size:12px;color:#94a3b8;">答错题目自动收录，考前免费导出 Markdown / 打印背诵单</div>
      </div>
      <button type="button" class="cta-primary-btn" id="btnExportMistakes" style="padding:8px 14px;font-size:12.5px;">
        📥 免费导出错题与口诀 (.md)
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
        <div style="font-weight:800;font-size:15px;">⚡ 考前 15 分钟秒杀口诀遮罩背诵卡（全 40 条免费全开）</div>
        <div style="font-size:12px;color:#94a3b8;">点击模糊口诀条即可翻开自测记忆</div>
      </div>
      <button type="button" class="cta-secondary-btn" id="btnToggleAllCram" style="padding:6px 12px;font-size:12px;">
        ${revealedCramSet.size > 0 ? "全部遮住自测" : "全部翻开速读"}
      </button>
    </div>
  `;

  const cardsHtml = deck
    .map((q) => {
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
      deck.forEach((q) => revealedCramSet.add(q.id));
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

function renderAll() {
  renderStatsAndTabs();
  renderModuleFilter();
  const stageEl = document.getElementById("mainStage");
  if (activeMode === "practice") renderPracticeView(stageEl);
  else if (activeMode === "mistakes") renderMistakesView(stageEl);
  else if (activeMode === "ebbinghaus") renderEbbinghausView(stageEl);
  else renderCramView(stageEl);
}

function init() {
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
    if (card) {
      studyState = toggleMistakeBookmark(studyState, { questionId: card.id });
      saveStudyState();
      renderAll();
    }
  });

  document.getElementById("btnCopyStudioMail")?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    const prev = btn.textContent;
    await navigator.clipboard.writeText("3152557994@qq.com");
    btn.textContent = "✅ 已复制";
    setTimeout(() => (btn.textContent = prev), 1500);
  });

  window.addEventListener("keydown", (e) => {
    if (activeMode !== "practice") return;
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
      if (card) {
        const res = submitAnswer(studyState, { questionId: card.id, choice, unlocked: true });
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
