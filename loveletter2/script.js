// ===== LOVE COUNTER =====
function updateLoveCounter() {
  const start = new Date("2026-03-08T14:30:00");
  const now   = new Date();

  let mo = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) mo--;
  mo = Math.max(0, mo);

  const afterMonths = new Date(start);
  afterMonths.setMonth(afterMonths.getMonth() + mo);
  const remaining = now - afterMonths;

  const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const m = Math.floor((remaining / (1000 * 60)) % 60);
  const s = Math.floor((remaining / 1000) % 60);

  document.getElementById('months').innerText = mo.toString().padStart(2, '0');
  document.getElementById('days').innerText   = d.toString().padStart(2, '0');
  document.getElementById('hours').innerText  = h.toString().padStart(2, '0');
  document.getElementById('mins').innerText   = m.toString().padStart(2, '0');
  document.getElementById('secs').innerText   = s.toString().padStart(2, '0');
}
setInterval(updateLoveCounter, 1000);
updateLoveCounter();

// ===== TYPEWRITER LETTER =====
(function () {
  const LETTER = [
    "Dear Noey,\n\n",
    "Two months ago I tell you one of the most nervous\n",
    "message of my life.\n",
    "Month two taught me so much about you.\n",
    "I love every version of you I've met so far,\n",
    "and I can't wait to meet more of them.\n\n",
    "Happy 2nd Month, Noey. 💕\n\n",

  ];

  const output  = document.getElementById('twOutput');
  const cursor  = document.getElementById('twCursor');
  const replay  = document.getElementById('twReplay');

  let audioCtx  = null;
  let charIndex = 0;
  let timer     = null;
  let fullText  = LETTER.join('');

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window['webkitAudioContext'])();
    return audioCtx;
  }

  function playClick() {
    try {
      const ctx  = getAudioCtx();
      const buf  = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.04), ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 4);
      }
      const src  = ctx.createBufferSource();
      const gain = ctx.createGain();
      gain.gain.value = 0.12;
      src.buffer = buf;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch (_) {}
  }

  function typeNext() {
    if (charIndex >= fullText.length) {
      cursor.classList.add('hidden');
      replay.classList.add('visible');
      return;
    }

    const ch = fullText[charIndex];
    output.textContent += ch;
    charIndex++;

    if (ch !== ' ' && ch !== '\n') playClick();

    // scroll paper into view as it fills
    output.scrollIntoView({ block: 'nearest' });

    // pause longer at punctuation for natural rhythm
    const isPause = '.!?,\n'.includes(ch);
    const delay   = isPause ? 140 + Math.random() * 60 : 22 + Math.random() * 16;
    timer = setTimeout(typeNext, delay);
  }

  function startTyping() {
    clearTimeout(timer);
    output.textContent = '';
    charIndex = 0;
    cursor.classList.remove('hidden');
    replay.classList.remove('visible');
    // small delay before starting so page scroll settles
    setTimeout(typeNext, 600);
  }

  // click paper to skip to end instantly
  document.getElementById('paper').addEventListener('click', () => {
    if (charIndex >= fullText.length) return;
    clearTimeout(timer);
    output.textContent = fullText;
    charIndex = fullText.length;
    cursor.classList.add('hidden');
    replay.classList.add('visible');
  });

  // start when section scrolls into view
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      startTyping();
    }
  }, { threshold: 0.3 });

  observer.observe(document.getElementById('section-letter'));

  replay.addEventListener('click', startTyping);
})();

// ===== LOVE JAR =====
(function () {
  const NOTES = [
    "I love the way you smile when you're trying not to 😊",
    "I love how you make every ordinary moment feel special",
    "I love the sound of your laugh — genuinely 😄",
    "I love how caring you are without even realizing it",
    "I love waking up knowing I get to talk to you today",
    "I love the way you say my name",
    "I love how honest you are with me 💎",
    "I love that being with you feels like home 🏡",
    "I love your random late-night energy ✨",
    "I love how you notice small things that others miss",
    "I love the way you get excited about things you love",
    "I love that you're both soft and strong at the same time",
    "I love how you make me want to be better 💪",
    "I love your patience with me 🌸",
    "I love the tiny details that make you, you",
    "I love that you chose to let me in 🥺",
    "I love how your presence just... calms me",
    "I love that we can be silly together and serious too",
    "I love every version of you I've met so far",
    "I love you — simply, completely, every day 💕",
  ];

  const btn    = document.getElementById('jarBtn');
  const card   = document.getElementById('jarCard');
  const text   = document.getElementById('jarCardText');
  let lastIdx  = -1;

  function pickNote() {
    let idx;
    do { idx = Math.floor(Math.random() * NOTES.length); }
    while (idx === lastIdx && NOTES.length > 1);
    lastIdx = idx;
    return NOTES[idx];
  }

  btn.addEventListener('click', () => {
    card.classList.remove('show');

    setTimeout(() => {
      text.textContent = pickNote();
      card.classList.add('show');
      btn.textContent = 'Another one 💌';
    }, card.classList.contains('show') ? 300 : 0);
  });
})();

// ===== NIGHT SKY STARS =====
(function () {
  const canvas = document.getElementById('starCanvas');
  const ctx    = canvas.getContext('2d');

  const LOVES = [
    "Your smile 😊", "Your laugh 😄", "Your eyes ✨", "Your kindness 💗",
    "The way you text me 📱", "How you care ❤️", "Your voice 🎵",
    "Waking up to you ☀️", "Your warmth 🫂", "How you make me calm 🌙",
    "Your silly jokes 😂", "Your strength 💪", "The way you say my name",
    "Your curiosity 🌟", "Your honesty 💎", "Your patience 🌸",
    "The way you look at me 👀", "Your morning texts 📨",
    "How you get excited 🎉", "Every little thing about you 💕",
  ];

  let stars = [], shootingStars = [], W, H;
  let mouseX = -9999, mouseY = -9999;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor((W * H) / 5000);
    for (let i = 0; i < count; i++) {
      const hasLabel = i < LOVES.length;
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: hasLabel ? Math.random() * 1.5 + 1.5 : Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.02 + 0.005,
        dir: Math.random() > 0.5 ? 1 : -1,
        label: hasLabel ? LOVES[i] : null,
        pulse: 0,
      });
    }
  }

  function spawnShootingStar() {
    const angle = (Math.random() * 30 + 15) * (Math.PI / 180);
    shootingStars.push({
      x: Math.random() * W * 0.7,
      y: Math.random() * H * 0.3,
      vx: Math.cos(angle) * 8,
      vy: Math.sin(angle) * 8,
      life: 1,
    });
  }
  setInterval(() => { if (Math.random() < 0.4) spawnShootingStar(); }, 3000);

  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('touchmove', e => {
    mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.8);
    grad.addColorStop(0, '#0d0820');
    grad.addColorStop(1, '#04040f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // shooting stars
    shootingStars = shootingStars.filter(s => s.life > 0);
    for (const s of shootingStars) {
      ctx.save();
      ctx.globalAlpha = s.life;
      const g = ctx.createLinearGradient(s.x - s.vx*10, s.y - s.vy*10, s.x, s.y);
      g.addColorStop(0, 'transparent');
      g.addColorStop(1, '#fff');
      ctx.strokeStyle = g;
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(s.x - s.vx*10, s.y - s.vy*10);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.restore();
      s.x += s.vx; s.y += s.vy; s.life -= 0.018;
    }

    // stars
    for (const s of stars) {
      s.alpha += s.speed * s.dir;
      if (s.alpha > 0.9 || s.alpha < 0.15) s.dir *= -1;

      if (s.label) {
        const d = Math.hypot(mouseX - s.x, mouseY - s.y);
        s.pulse = d < 30
          ? Math.min(s.pulse + 0.15, 1)
          : Math.max(s.pulse - 0.1, 0);
      }

      const r = s.r + (s.pulse || 0) * 3;

      if (s.label && r > s.r) {
        const gg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 24);
        gg.addColorStop(0, `rgba(255,180,220,${s.alpha*0.4})`);
        gg.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.fillStyle = gg;
        ctx.arc(s.x, s.y, 24, 0, Math.PI*2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI*2);
      ctx.fillStyle = s.label
        ? `rgba(255,200,230,${s.alpha})`
        : `rgba(255,255,255,${s.alpha})`;
      ctx.fill();

      if (s.label && s.pulse > 0.3) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (s.pulse - 0.3) / 0.7);
        ctx.font        = '13px "Dancing Script", cursive';
        ctx.fillStyle   = '#ffd0e8';
        ctx.shadowColor = 'rgba(192,57,94,0.8)';
        ctx.shadowBlur  = 8;
        const onRight   = s.x < W * 0.8;
        ctx.textAlign   = onRight ? 'left' : 'right';
        ctx.fillText(s.label, onRight ? s.x + 14 : s.x - 14, s.y - 8);
        ctx.restore();
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ===== POLAROID WALL =====
(function () {
  const PHOTOS = [
    { src: 'img/2-1.jpg', caption: 'One whole month 🎉', rot: -9,  left: 18,  top: 30  },
    { src: 'img/2-2.jpg', caption: 'First Carbonara Together',            rot:  5,  left: 210, top: 18  },
    { src: 'img/2-3.jpg', caption: 'Best friend Vs Boyfriend ♡',             rot: -4,  left: 400, top: 28  },
    { src: 'img/2-4.JPG', caption: 'First Songkran w U ',             rot:  8,  left: 600, top: 16  },
    { src: 'img/2-5.jpg', caption: 'So Cutee waaa',            rot:-11,  left: 30,  top: 280 },
    { src: 'img/2-6.jpg', caption: 'Drunk Girl',             rot:  6,  left: 220, top: 265 },
    { src: 'img/2-7.jpg', caption: 'First Kra Pao',               rot: -5,  left: 420, top: 275 },
    { src: 'img/2-8.JPG', caption: 'Happy 2nd Month ✨',             rot:  9,  left: 620, top: 262 },
  ];

  const board    = document.getElementById('corkboard');
  const lightbox = document.getElementById('polaroidLightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');

  if (!board) return;

  PHOTOS.forEach((p) => {
    const el = document.createElement('div');
    el.className = 'polaroid';
    el.style.cssText = `--rot:${p.rot}deg; left:${p.left}px; top:${p.top}px;`;

    const imgDiv = document.createElement('div');
    imgDiv.className = 'polaroid-photo';

    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.caption;
    img.onerror = () => imgDiv.classList.add('no-img');

    imgDiv.appendChild(img);

    const pin     = document.createElement('div');
    pin.className = 'polaroid-pin';

    const caption = document.createElement('div');
    caption.className = 'polaroid-caption';
    caption.textContent = p.caption;

    el.append(pin, imgDiv, caption);

    el.addEventListener('click', () => {
      lbImg.src = p.src;
      lbCaption.textContent = p.caption;
      lightbox.classList.add('open');
    });

    board.appendChild(el);
  });

  // close lightbox
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });

  // drag-to-scroll on the corkboard outer
  const outer = document.querySelector('.corkboard-outer');
  if (!outer) return;
  let isDown = false, startX = 0, scrollLeft = 0;

  outer.addEventListener('mousedown',  (e) => { isDown = true; startX = e.pageX - outer.offsetLeft; scrollLeft = outer.scrollLeft; });
  outer.addEventListener('mouseleave', ()  => { isDown = false; });
  outer.addEventListener('mouseup',    ()  => { isDown = false; });
  outer.addEventListener('mousemove',  (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - outer.offsetLeft;
    const walk = (x - startX) * 1.4;
    outer.scrollLeft = scrollLeft - walk;
  });
})();
