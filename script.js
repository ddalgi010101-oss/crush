let highestZ = 100;

const giftOverlay = document.getElementById('gift-overlay');
const questionOverlay = document.getElementById('question-overlay');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const noNote = document.getElementById('no-note');
const catGif = document.getElementById('cat-gif');
const catFallback = document.getElementById('cat-fallback');
const envelopeStage = document.getElementById('envelope-stage');
const envelopeBtn = document.getElementById('envelope-btn');
const letterModal = document.getElementById('letter-modal');
const letterClose = document.getElementById('letter-close');
let noMoves = 0;
let noHasFlown = false;
let noWingSequenceStarted = false;
let flyingNoClone = null;
let envelopeShown = false;

const catGifSources = [
  'assets/cat.gif'
];
let catGifSourceIndex = 0;

const noMessages = [
  'Uy wag yan, practice button lang yan.',
  'No is under maintenance. Yes lang available today.',
  'Nagre-resign na yung No button, ayaw na niya.',
  'System update: bawal tumanggi. Yes mode only.',
  'Wait... may tumutubo na pakpak si No!'
];

function startNoWingSequence() {
  if (!noBtn || noWingSequenceStarted || noHasFlown) return;

  noWingSequenceStarted = true;
  const rect = noBtn.getBoundingClientRect();

  // Create a visual clone pinned exactly where "No" stopped.
  flyingNoClone = noBtn.cloneNode(true);
  flyingNoClone.id = 'no-btn-clone';
  flyingNoClone.classList.add('no-btn-clone', 'has-wings', 'wing-grow');
  flyingNoClone.style.position = 'fixed';
  flyingNoClone.style.left = `${Math.round(rect.left)}px`;
  flyingNoClone.style.top = `${Math.round(rect.top)}px`;
  flyingNoClone.style.right = 'auto';
  flyingNoClone.style.bottom = 'auto';
  flyingNoClone.style.width = `${Math.round(rect.width)}px`;
  flyingNoClone.style.height = `${Math.round(rect.height)}px`;
  flyingNoClone.style.margin = '0';
  flyingNoClone.style.transform = 'translate3d(0, 0, 0)';
  flyingNoClone.style.zIndex = '9800';
  flyingNoClone.style.pointerEvents = 'none';
  document.body.appendChild(flyingNoClone);

  // Hide original button so only the pinned clone is visible.
  noBtn.classList.add('gone');

  if (noNote) {
    noNote.textContent = 'Wait... may tumutubo na pakpak si No!';
    noNote.classList.add('show');
  }

  // Let wings grow first.
  window.setTimeout(() => {
    if (!flyingNoClone) return;
    flyingNoClone.classList.remove('wing-grow');
    flyingNoClone.classList.add('fly-away');
    flyingNoClone.style.animation = 'none';

    // Force layout so browser commits the pinned position first.
    void flyingNoClone.offsetWidth;

    // Start flight on next frame so it begins exactly where the button stopped.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!flyingNoClone) return;
        flyingNoClone.style.animation = '';
        flyingNoClone.classList.add('is-flying');
      });
    });

    if (noNote) {
      noNote.textContent = 'Ayan na, lumipad na si No. Yes na lang naiwan.';
      noNote.classList.add('show');
    }
  }, 850);

  // Hide permanently after flight.
  window.setTimeout(() => {
    noHasFlown = true;
    if (flyingNoClone) {
      flyingNoClone.classList.add('gone');
      window.setTimeout(() => {
        if (flyingNoClone) {
          flyingNoClone.remove();
          flyingNoClone = null;
        }
      }, 260);
    }
  }, 4400);
}

function setCatFallbackVisible(show) {
  if (!catFallback) return;
  catFallback.hidden = !show;
}

if (catGif) {
  catGif.hidden = false;
  setCatFallbackVisible(false);

  catGif.addEventListener('load', () => {
    catGif.hidden = false;
    setCatFallbackVisible(false);
  });

  catGif.addEventListener('error', () => {
    catGifSourceIndex += 1;
    if (catGifSourceIndex < catGifSources.length) {
      catGif.src = catGifSources[catGifSourceIndex];
    } else {
      catGif.hidden = true;
      setCatFallbackVisible(true);
    }
  });

  catGif.src = catGifSources[0];
}

function showQuestion() {
  if (!questionOverlay) return;
  questionOverlay.classList.add('show');
  questionOverlay.setAttribute('aria-hidden', 'false');
}

function revealConfession() {
  if (document.body.classList.contains('unwrapped')) return;

  if (questionOverlay) {
    questionOverlay.classList.remove('show');
    questionOverlay.setAttribute('aria-hidden', 'true');
  }

  window.setTimeout(() => {
    if (questionOverlay) {
      questionOverlay.style.display = 'none';
    }
    document.body.classList.add('unwrapped');
  }, 320);
}

function showEnvelopeStage() {
  if (!envelopeStage || envelopeShown) return;
  envelopeShown = true;
  envelopeStage.classList.add('show');
  envelopeStage.setAttribute('aria-hidden', 'false');
  if (envelopeBtn) {
    envelopeBtn.disabled = false;
  }
}

function openLetterModal() {
  if (!letterModal) return;
  letterModal.classList.add('show');
  letterModal.setAttribute('aria-hidden', 'false');
  if (envelopeStage) {
    envelopeStage.classList.add('opened');
  }
}

function closeLetterModal() {
  if (!letterModal) return;
  letterModal.classList.remove('show');
  letterModal.setAttribute('aria-hidden', 'true');
}

function moveNoButton() {
  if (!noBtn || noHasFlown || noWingSequenceStarted) return;

  noMoves += 1;

  if (noMoves >= 5) {
    startNoWingSequence();
    return;
  }

  const rangeX = 210;
  const rangeY = 90;
  const x = Math.round(Math.random() * rangeX - rangeX / 2);
  const y = Math.round(Math.random() * rangeY - rangeY / 2);
  const rot = Math.round(Math.random() * 18 - 9);
  noBtn.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;

  if (noNote) {
    const idx = Math.min(noMoves - 1, noMessages.length - 1);
    noNote.textContent = noMessages[idx];
    noNote.classList.add('show');
  }
}

function openGift() {
  if (!giftOverlay || giftOverlay.classList.contains('opening') || document.body.classList.contains('unwrapped')) {
    return;
  }

  giftOverlay.classList.add('opening');

  window.setTimeout(() => {
    giftOverlay.style.display = 'none';
    showQuestion();
  }, 850);
}

if (giftOverlay) {
  giftOverlay.addEventListener('click', openGift);
  giftOverlay.addEventListener('touchstart', openGift, { passive: true });
  giftOverlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGift();
    }
  });
}

if (yesBtn) {
  yesBtn.addEventListener('click', revealConfession);
}

if (noBtn) {
  noBtn.addEventListener('mouseenter', moveNoButton);
  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
  });
  noBtn.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault();
      moveNoButton();
    },
    { passive: false }
  );
}

if (envelopeBtn) {
  envelopeBtn.disabled = true;
  envelopeBtn.addEventListener('click', openLetterModal);
}

if (letterClose) {
  letterClose.addEventListener('click', closeLetterModal);
}

if (letterModal) {
  letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) {
      closeLetterModal();
    }
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLetterModal();
  }
});

class Paper {
  constructor(paper, onFirstDrag) {
    this.paper = paper;
    this.onFirstDrag = onFirstDrag;
  }

  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  startPaperX = 0;
  startPaperY = 0;
  hasMarkedDragged = false;
  rotating = false;

  markDragged() {
    if (this.hasMarkedDragged) return;

    const movedX = Math.abs(this.currentPaperX - this.startPaperX);
    const movedY = Math.abs(this.currentPaperY - this.startPaperY);
    if (movedX < 12 && movedY < 12) return;

    this.hasMarkedDragged = true;
    if (this.paper) {
      this.paper.classList.add('is-dragged');
    }
    if (typeof this.onFirstDrag === 'function') {
      this.onFirstDrag(this.paper);
    }
  }

  init() {
    const paper = this.paper;
    if (!paper) return;

    document.addEventListener('mousemove', (e) => {
      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
          this.markDragged();
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        this.startPaperX = this.currentPaperX;
        this.startPaperY = this.currentPaperY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
const unlockPapers = papers.filter((paper) => !paper.classList.contains('heart'));
const draggedUnlockPapers = new Set();
const stackScale = window.innerWidth <= 768 ? 0.78 : 1;
const paperPresets = [
  { x: -22, y: -28, rot: -7 },
  { x: -16, y: -19, rot: -5 },
  { x: -10, y: -10, rot: -3 },
  { x: -4, y: -2, rot: -1 },
  { x: 4, y: 6, rot: 2 },
  { x: 10, y: 14, rot: 4 },
  { x: 16, y: 22, rot: 6 }
];

function markPaperDragged(paper) {
  if (!paper || paper.classList.contains('heart')) return;
  if (draggedUnlockPapers.has(paper)) return;

  draggedUnlockPapers.add(paper);
  if (draggedUnlockPapers.size === unlockPapers.length) {
    showEnvelopeStage();
  }
}

papers.forEach((paper, index) => {
  const p = new Paper(paper, markPaperDragged);

  const preset = paperPresets[Math.min(paperPresets.length - 1, index)];
  p.currentPaperX = Math.round(preset.x * stackScale);
  p.currentPaperY = Math.round(preset.y * stackScale);
  p.rotation = preset.rot;
  paper.style.transform = `translateX(${p.currentPaperX}px) translateY(${p.currentPaperY}px) rotateZ(${p.rotation}deg)`;

  p.init();
});
