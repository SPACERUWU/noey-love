// ===== LOVE COUNTER =====
(function () {
  const start = new Date("2026-03-08T14:30:00");
  function update() {
    const now = new Date();
    let mo = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (now.getDate() < start.getDate()) mo--;
    mo = Math.max(0, mo);
    const after = new Date(start);
    after.setMonth(after.getMonth() + mo);
    const rem = now - after;
    const pad = n => n.toString().padStart(2, '0');
    document.getElementById('months').innerText = pad(mo);
    document.getElementById('days').innerText   = pad(Math.floor(rem / 86400000));
    document.getElementById('hours').innerText  = pad(Math.floor((rem / 3600000) % 24));
    document.getElementById('mins').innerText   = pad(Math.floor((rem / 60000) % 60));
    document.getElementById('secs').innerText   = pad(Math.floor((rem / 1000) % 60));
  }
  setInterval(update, 1000);
  update();
})();

// ===== MONTHLY NOTE — scroll reveal =====
(function () {
  const blocks = document.querySelectorAll('.note-block');
  if (!blocks.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.i || 0) * 160;
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  blocks.forEach(b => obs.observe(b));
})();

// ===== WISHLIST — Firebase real-time sync =====
(function () {
  const items = document.querySelectorAll('.wish-item');
  if (!items.length) return;

  const DB = 'https://noey-3b12d-default-rtdb.asia-southeast1.firebasedatabase.app/wishlist';

  // ── Apply a single key's state to the UI ──────────────────────────
  function applyState(key, val) {
    const item = document.querySelector(`.wish-item[data-key="${key}"]`);
    if (item) item.classList.toggle('done', !!val);
  }

  // ── Real-time listener: SSE from Firebase ─────────────────────────
  const es = new EventSource(`${DB}.json`);
  es.addEventListener('put', (e) => {
    const { path, data } = JSON.parse(e.data);
    if (path === '/' && data && typeof data === 'object') {
      // initial load — full snapshot
      Object.entries(data).forEach(([k, v]) => applyState(k, v));
    } else if (path.startsWith('/') && path.length > 1) {
      // single key update from either device
      applyState(path.slice(1), data);
    }
  });

  // ── Scroll reveal + click handlers ────────────────────────────────
  items.forEach((item) => {
    const key = item.dataset.key;
    const btn = item.querySelector('.wish-check');

    const idx = [...items].indexOf(item);
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => item.classList.add('visible'), idx * 80);
        obs.unobserve(item);
      }
    }, { threshold: 0.2 });
    obs.observe(item);

    function toggle() {
      const done = item.classList.toggle('done'); // optimistic update
      fetch(`${DB}/${key}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(done),
      }).catch(() => item.classList.toggle('done', !done)); // revert on error
    }

    item.addEventListener('click', toggle);
    if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  });
})();

// ===== VINYL RECORD + LIVE LYRICS =====
(function () {
  const record        = document.getElementById('record');
  const recordWrap    = record?.closest('.record-wrap');
  const tonearm       = document.getElementById('tonearm');
  const lyricsIdle   = document.getElementById('lyricsIdle');
  const lyricsDisplay= document.getElementById('lyricsDisplay');
  const lyricPrev    = document.getElementById('lyricPrev');
  const lyricCurr    = document.getElementById('lyricCurr');
  if (!record) return;

  // ── Timed lyrics (ms from song start) ──────────────────────────────
  // Adjust timestamps if Spotify skips into the song
  const LYRICS = [
    { t:     0, text: '',                                        chorus: false },
    { t: 15500, text: 'ฉันโชคดีแค่ไหนที่ได้รู้จักเธอ',          chorus: false },
    { t: 21000, text: 'ในค่ำคืนอันอบอุ่นที่ฉันไม่เคยได้พบเจอ',   chorus: false },
    { t: 27000, text: 'ภายใต้ดวงดาวที่สวยงามราวกับความฝัน',      chorus: false },
    { t: 33000, text: 'เธอเอนกายมาคล้องแขนไว้ข้างกายฉัน',       chorus: false },
    { t: 39500, text: 'ราวกับมันเป็นเรื่องที่เขียนไว้ในนิยาย',   chorus: false },
    { t: 45500, text: 'ที่ตัวเอกหัวใจไม่เคยหยุดเต้น',           chorus: false },
    { t: 51500, text: 'เพราะเธอทำให้ฉันรู้สึกแบบนั้น',          chorus: false },
    { t: 57000, text: 'ทุกครั้งที่เธออยู่ตรงหน้า',              chorus: false },
    { t: 63000, text: 'ฉันอาจไม่เก่ง ไม่หล่อ ไม่สมบูรณ์แบบ',   chorus: true  },
    { t: 69000, text: 'เหมือนโนบิตะที่ไม่เคยเก่งในเรื่องใด',    chorus: true  },
    { t: 75000, text: 'แต่ฉันจะรักเธอ ด้วยสิ่งที่ฉันมี',        chorus: true  },
    { t: 81000, text: 'จะอยู่ข้างเธอไปตลอด ไม่ไปไหน',          chorus: true  },
    { t: 88000, text: 'เธอคือโชคดีที่สุดในชีวิตฉัน',            chorus: false },
    { t: 94000, text: 'และฉันจะไม่ปล่อยให้เธอไปจากกัน',         chorus: false },
    { t:100000, text: 'ขอแค่อยู่ตรงนี้ ข้างๆ กัน',             chorus: false },
    { t:106000, text: 'นั่นคือทุกอย่างที่ฉันต้องการ',           chorus: false },
    { t:114000, text: 'ฉันโชคดีแค่ไหนที่ได้รู้จักเธอ',          chorus: false },
    { t:120000, text: 'ในค่ำคืนอันอบอุ่นที่ฉันไม่เคยได้พบเจอ',   chorus: false },
    { t:126000, text: 'ภายใต้ดวงดาวที่สวยงามราวกับความฝัน',      chorus: false },
    { t:132000, text: 'เธอเอนกายมาคล้องแขนไว้ข้างกายฉัน',       chorus: false },
    { t:139000, text: 'ฉันอาจไม่เก่ง ไม่หล่อ ไม่สมบูรณ์แบบ',   chorus: true  },
    { t:145000, text: 'เหมือนโนบิตะที่ไม่เคยเก่งในเรื่องใด',    chorus: true  },
    { t:151000, text: 'แต่ฉันจะรักเธอ ด้วยสิ่งที่ฉันมี',        chorus: true  },
    { t:157000, text: 'จะอยู่ข้างเธอไปตลอด ไม่ไปไหน',          chorus: true  },
    { t:165000, text: 'เธอคือโชคดีที่สุดในชีวิตฉัน',            chorus: false },
    { t:171000, text: 'และฉันจะไม่ปล่อยให้เธอไปจากกัน',         chorus: false },
    { t:177000, text: 'ขอแค่อยู่ตรงนี้ ข้างๆ กัน',             chorus: false },
    { t:183000, text: 'นั่นคือทุกอย่างที่ฉันต้องการ',           chorus: false },
    { t:192000, text: '♡',                                       chorus: true  },
  ];

  let currentIdx = -1;
  let isPlaying  = false;
  let localPos   = 0;
  let lastTick   = null;
  let ticker     = null;
  let angle      = 0;
  let rafId      = null;

  function spinFrame() {
    angle = (angle + 0.36) % 360;   // ~2 RPM at 60 fps
    record.style.transform = `rotate(${angle}deg)`;
    rafId = requestAnimationFrame(spinFrame);
  }

  function showLyric(idx) {
    if (idx === currentIdx) return;
    currentIdx = idx;
    const line = LYRICS[idx];
    if (!line) return;
    if (lyricPrev) lyricPrev.textContent = lyricCurr?.textContent ?? '';
    if (lyricCurr) {
      lyricCurr.textContent = line.text;
      lyricCurr.className   = 'lyric-curr' + (line.chorus ? ' chorus' : '');
      lyricCurr.style.animation = 'none';
      void lyricCurr.offsetWidth;
      lyricCurr.style.animation = '';
    }
  }

  function getLyricIdx(posMs) {
    let idx = 0;
    for (let i = 0; i < LYRICS.length; i++) {
      if (posMs >= LYRICS[i].t) idx = i; else break;
    }
    return idx;
  }

  function setPlaying(playing) {
    isPlaying = playing;

    // JS-driven rotation — guaranteed to work, no CSS needed
    if (playing) {
      if (!rafId) spinFrame();
    } else {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    record.style.boxShadow = playing
      ? '0 0 0 2px #2a2a2a, 0 16px 60px rgba(0,0,0,0.7), 0 0 60px rgba(244,162,97,0.25), 0 0 100px rgba(244,162,97,0.1)'
      : '';

    if (tonearm) tonearm.style.transform = playing ? 'rotate(-12deg)' : '';
    if (lyricsIdle)    lyricsIdle.classList.toggle('hidden', playing);
    if (lyricsDisplay) lyricsDisplay.classList.toggle('visible', playing);

    if (playing) {
      lastTick = performance.now();
      if (!ticker) {
        ticker = setInterval(() => {
          if (!isPlaying) { clearInterval(ticker); ticker = null; return; }
          const now = performance.now();
          localPos += now - lastTick;
          lastTick  = now;
          showLyric(getLyricIdx(localPos));
        }, 500);
      }
    } else {
      clearInterval(ticker);
      ticker = null;
    }
  }

  // ── Click record → spin/stop (purely visual, independent of Spotify) ─
  const clickTarget = recordWrap || record;
  clickTarget.style.cursor = 'pointer';
  clickTarget.addEventListener('click', () => setPlaying(!isPlaying));
})();

// ===== FIREFLY CANVAS =====
(function () {
  const canvas = document.getElementById('fireflyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, flies = [];

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function build() {
    flies = [];
    const n = Math.floor((W * H) / 9000);
    for (let i = 0; i < n; i++) {
      flies.push({
        x: rand(0, W), y: rand(0, H),
        r: rand(1.2, 2.8),
        a: rand(0.2, 0.8), as: rand(0.006, 0.022) * (Math.random() > 0.5 ? 1 : -1),
        vx: rand(-0.25, 0.25), vy: rand(-0.4, -0.08),
        hue: rand(28, 68),
      });
    }
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    build();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createRadialGradient(W/2, H*0.4, 0, W/2, H*0.4, Math.max(W,H)*0.9);
    bg.addColorStop(0, '#090316');
    bg.addColorStop(1, '#04040f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    for (const f of flies) {
      f.a += f.as;
      if (f.a > 0.9 || f.a < 0.08) f.as *= -1;
      f.x += f.vx; f.y += f.vy;
      if (f.y < -10) { f.y = H + 10; f.x = rand(0, W); }
      if (f.x < -10) f.x = W + 10;
      if (f.x > W + 10) f.x = -10;

      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 9);
      g.addColorStop(0, `hsla(${f.hue},95%,72%,${f.a * 0.28})`);
      g.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.fillStyle = g;
      ctx.arc(f.x, f.y, f.r * 9, 0, Math.PI * 2); ctx.fill();

      ctx.save();
      ctx.globalAlpha = f.a;
      ctx.shadowColor = `hsl(${f.hue},95%,78%)`; ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${f.hue},95%,82%)`; ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();
