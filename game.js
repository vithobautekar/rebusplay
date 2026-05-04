// ============================================
//  REBUS GAME — Game Logic
// ============================================

(function () {
  "use strict";

  // ── STATE ──────────────────────────────────
  let state = {
    queue: [],          // shuffled puzzle indices
    queuePos: 0,        // current position in queue
    current: null,      // current puzzle object
    answered: false,    // has user answered this round?
    score: 0,
    streak: 0,
    bestStreak: 0,
    totalPlayed: 0,
    totalCorrect: 0,
    totalForfeit: 0,
  };

  // ── HELPERS ────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function normalise(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/gi, "")   // strip punctuation
      .replace(/\s+/g, " ");
  }

  function isCorrect(input, answer) {
    return normalise(input) === normalise(answer);
  }

  // ── DOM REFS ───────────────────────────────
  const elClue        = document.getElementById("clueBox");
  const elPuzzleNum   = document.getElementById("puzzleNumber");
  const elPuzzleCount = document.getElementById("puzzleCount");
  const elScore       = document.getElementById("score");
  const elStreak      = document.getElementById("streak");
  const elFeedback    = document.getElementById("feedback");
  const elInput       = document.getElementById("answerInput");
  const elInputArea   = document.getElementById("inputArea");
  const elNextArea    = document.getElementById("nextArea");
  const elCard        = document.getElementById("puzzleCard");

  const elModal        = document.getElementById("modalOverlay");
  const elModalEmoji   = document.getElementById("modalEmoji");
  const elModalTitle   = document.getElementById("modalTitle");
  const elModalSub     = document.getElementById("modalSubtitle");
  const elMScore       = document.getElementById("mScore");
  const elMCorrect     = document.getElementById("mCorrect");
  const elMForfeit     = document.getElementById("mForfeit");
  const elMBestStreak  = document.getElementById("mBestStreak");

  // ── INIT ───────────────────────────────────
  function init() {
    state.queue    = shuffle(PUZZLES.map((_, i) => i));
    state.queuePos = 0;
    state.score    = 0;
    state.streak   = 0;
    state.bestStreak    = 0;
    state.totalPlayed   = 0;
    state.totalCorrect  = 0;
    state.totalForfeit  = 0;
    loadPuzzle();
  }

  function loadPuzzle() {
    if (state.queuePos >= state.queue.length) {
      showSummary();
      return;
    }

    state.current  = PUZZLES[state.queue[state.queuePos]];
    state.answered = false;

    // Update clue
    elClue.textContent = state.current.clue;

    // Update labels
    elPuzzleNum.textContent   = `#${String(state.current.id).padStart(3, "0")}`;
    elPuzzleCount.textContent = state.queuePos + 1;

    // Reset UI
    elCard.className = "card";
    setFeedback("", "");
    elInput.value    = "";
    elInput.disabled = false;
    elNextArea.style.display = "none";
    elInputArea.style.display = "flex";
    elInput.focus();
  }

  // ── SUBMIT ─────────────────────────────────
  window.submitAnswer = function () {
    if (state.answered) return;

    const userAnswer = elInput.value.trim();
    if (!userAnswer) {
      pulse(elInput);
      return;
    }

    state.answered   = true;
    state.totalPlayed++;
    elInput.disabled = true;

    if (isCorrect(userAnswer, state.current.answer)) {
      // Correct!
      state.score  += 10;
      state.streak++;
      state.totalCorrect++;
      if (state.streak > state.bestStreak) state.bestStreak = state.streak;

      elCard.classList.add("correct");
      setFeedback(`✓ Correct! +10 pts`, "correct");
      animatePop(elCard);
    } else {
      // Wrong
      state.streak = 0;
      elCard.classList.add("wrong");
      setFeedback(`✗ Not quite — the answer is: "${state.current.answer}"`, "wrong");
      animateShake(elCard);
    }

    updateStats();
    showNext();
  };

  // ── FORFEIT ────────────────────────────────
  window.forfeit = function () {
    if (state.answered) return;

    state.answered   = true;
    state.totalPlayed++;
    state.totalForfeit++;
    state.streak     = 0;
    elInput.disabled = true;

    elCard.classList.add("revealed");
    setFeedback(`Answer: "${state.current.answer}"`, "reveal");

    updateStats();
    showNext();
  };

  // ── NEXT ───────────────────────────────────
  window.nextPuzzle = function () {
    state.queuePos++;
    loadPuzzle();
  };

  // ── RESTART ────────────────────────────────
  window.restartGame = function () {
    elModal.style.display = "none";
    init();
  };

  // ── UI HELPERS ─────────────────────────────
  function setFeedback(msg, type) {
    elFeedback.textContent = msg;
    elFeedback.className   = "feedback " + type;
  }

  function showNext() {
    elNextArea.style.display = "block";
  }

  function updateStats() {
    elScore.textContent  = state.score;
    elStreak.textContent = state.streak;
  }

  function animateShake(el) {
    el.classList.remove("shake");
    void el.offsetWidth; // reflow
    el.classList.add("shake");
  }

  function animatePop(el) {
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }

  function pulse(el) {
    el.style.borderColor = "var(--accent2)";
    setTimeout(() => { el.style.borderColor = ""; }, 600);
  }

  // ── SUMMARY MODAL ──────────────────────────
  function showSummary() {
    const pct = state.totalPlayed
      ? Math.round((state.totalCorrect / state.totalPlayed) * 100)
      : 0;

    let emoji = "🧐";
    let title = "All Done!";
    let sub   = `You answered ${state.totalPlayed} puzzles.`;

    if (pct === 100) { emoji = "🏆"; title = "Perfect Score!"; }
    else if (pct >= 80) { emoji = "🎉"; title = "Excellent!"; }
    else if (pct >= 60) { emoji = "😎"; title = "Solid Run!"; }
    else if (pct >= 40) { emoji = "🤔"; title = "Keep Practising!"; }
    else { emoji = "😅"; title = "Better Luck Next Time!"; }

    sub = `You got ${state.totalCorrect} out of ${state.totalPlayed} correct (${pct}%).`;

    elModalEmoji.textContent  = emoji;
    elModalTitle.textContent  = title;
    elModalSub.textContent    = sub;
    elMScore.textContent      = state.score;
    elMCorrect.textContent    = state.totalCorrect;
    elMForfeit.textContent    = state.totalForfeit;
    elMBestStreak.textContent = state.bestStreak;

    elModal.style.display = "flex";
  }

  // ── KEYBOARD SHORTCUT ──────────────────────
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      if (!state.answered) {
        submitAnswer();
      } else {
        nextPuzzle();
      }
    }
  });

  // ── START ──────────────────────────────────
  init();

})();
