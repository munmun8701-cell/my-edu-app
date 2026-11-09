/* =====================================================================
   むんラボ 演出  lab-fx.js
   ・効果音は、その場で音をつくって鳴らします（音のファイルや通信はなし）
   ・音のオン・オフは画面右上のボタン。記録は mun_lab_sfx（この端末だけ）
   ・「視差効果を減らす（動きを減らす）」設定の端末では、紙ふぶきなどを出しません
===================================================================== */
(function () {
  'use strict';
  const KEY = 'mun_lab_sfx';
  const RM = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  let on = true; try { on = localStorage.getItem(KEY) !== '0'; } catch (e) {}
  let ac = null, master = null;
  function ctx() {
    if (!on) return null;
    try {
      if (!ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ac = new C(); master = ac.createGain(); master.gain.value = .22; master.connect(ac.destination); }
      if (ac.state === 'suspended') ac.resume();
      return ac;
    } catch (e) { return null; }
  }
  // 1つの音：周波数 f（配列なら順に変化）、長さ d 秒、波形 w、音量 v、開始 t
  function tone(f, d = .12, w = 'sine', v = .6, t = 0, slide) {
    const a = ctx(); if (!a) return;
    const t0 = a.currentTime + t, o = a.createOscillator(), g = a.createGain();
    o.type = w; o.frequency.setValueAtTime(f, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + d);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + .012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + d + .02);
  }
  function noise(d = .2, v = .5, t = 0, hp = 800) {
    const a = ctx(); if (!a) return;
    const n = Math.floor(a.sampleRate * d), b = a.createBuffer(1, n, a.sampleRate), ch = b.getChannelData(0);
    for (let i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = b; f.type = 'highpass'; f.frequency.value = hp; g.gain.value = v;
    s.connect(f); f.connect(g); g.connect(master); s.start(a.currentTime + t);
  }
  const arp = (fs, step = .08, w = 'triangle', v = .5, d = .18) => fs.forEach((f, i) => tone(f, d, w, v, i * step));
  const SFX = {
    tap: () => tone(660, .05, 'square', .18),
    ok: () => { tone(880, .09, 'triangle', .5); tone(1318, .16, 'triangle', .45, .07); },
    ng: () => { tone(220, .18, 'sawtooth', .18); tone(196, .22, 'sawtooth', .16, .09); },
    coin: () => { tone(1318, .07, 'square', .22); tone(1760, .2, 'square', .2, .06); },
    step: () => tone(520, .05, 'triangle', .25),
    turn: () => tone(390, .05, 'triangle', .2),
    hit: () => { noise(.16, .5, 0, 600); tone(150, .16, 'square', .35, 0, 60); },
    crit: () => { noise(.28, .6, 0, 300); tone(110, .3, 'sawtooth', .4, 0, 40); arp([1046, 1318, 1568], .04, 'square', .25, .1); },
    combo: n => tone(440 + Math.min(n, 12) * 60, .09, 'square', .25),
    door: () => { tone(200, .5, 'sawtooth', .2, 0, 800); noise(.4, .2, .1, 2000); arp([523, 659, 784, 1046], .09, 'triangle', .4, .3); },
    key: () => arp([988, 1318], .06, 'triangle', .4, .14),
    crash: () => { noise(.3, .6, 0, 200); tone(120, .3, 'square', .35, 0, 50); },
    win: () => arp([523, 659, 784, 1046, 1318], .09, 'triangle', .5, .25),
    fanfare: () => { arp([523, 659, 784], .1, 'square', .28, .16); tone(1046, .5, 'square', .3, .32); tone(784, .5, 'triangle', .3, .32); tone(1318, .6, 'triangle', .25, .45); },
    trophy: () => { arp([784, 988, 1175, 1568, 1976], .07, 'triangle', .4, .3); tone(2637, .5, 'sine', .2, .38); },
    tick: () => tone(1200, .03, 'square', .15),
    go: () => tone(1046, .25, 'square', .3),
    chime: () => { [0, .5, 1].forEach(t => { tone(1046, 1.2, 'sine', .4, t); tone(1568, 1.2, 'sine', .2, t + .02); }); },
    boss: () => { tone(80, .6, 'sawtooth', .35, 0, 50); noise(.6, .25, 0, 120); },
    defeat: () => { noise(.8, .7, 0, 80); tone(200, .8, 'sawtooth', .3, 0, 30); arp([523, 659, 784, 1046, 1318, 1568], .1, 'square', .25, .3); },
    draw: () => tone(330 + Math.random() * 200, .04, 'sine', .12),
    buy: () => { tone(988, .08, 'square', .22); tone(1318, .08, 'square', .22, .07); tone(1976, .2, 'triangle', .25, .14); }
  };
  function play(name, arg) { if (!on) return; try { SFX[name] && SFX[name](arg); } catch (e) {} }
  function setOn(v) { on = !!v; try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {} if (on) play('ok'); }

  /* ---------- 紙ふぶき ---------- */
  function confetti(n = 120, colors) {
    if (RM()) return;
    const cv = document.createElement('canvas'); cv.className = 'fx-confetti'; cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    const dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight; cv.width = W * dpr; cv.height = H * dpr;
    const c = cv.getContext('2d'); c.scale(dpr, dpr);
    const C = colors || ['#00e5ff', '#f472b6', '#fbbf24', '#a855f7', '#34d399', '#ffffff'];
    const ps = Array.from({ length: n }, () => ({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, s: 4 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: C[Math.floor(Math.random() * C.length)] }));
    let t = 0;
    (function f() {
      c.clearRect(0, 0, W, H); t++;
      ps.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c; c.globalAlpha = Math.max(0, 1 - t / 150); c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore(); });
      if (t < 150) requestAnimationFrame(f); else cv.remove();
    })();
  }
  /* ---------- お祝いの画面（つぎつぎに出す） ---------- */
  const queue = []; let showing = false;
  function celebrate(o) { queue.push(o); if (!showing) nextCel(); }
  function nextCel() {
    const o = queue.shift(); if (!o) { showing = false; return; } showing = true;
    const m = document.createElement('div'); m.className = 'fx-cel'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', o.title);
    m.style.setProperty('--cc', o.color || '#fbbf24');
    m.innerHTML = `<div class="fx-box"><div class="fx-ray" aria-hidden="true"></div><div class="fx-ic">${o.html || `<i class="fa-solid ${o.icon || 'fa-star'}"></i>`}</div><small>${o.kicker || 'CONGRATULATIONS'}</small><h2>${o.title}</h2>${o.sub ? `<p>${o.sub}</p>` : ''}<button class="btn gold" type="button">OK</button></div>`;
    document.body.appendChild(m);
    play(o.sound || 'fanfare'); confetti(o.big ? 180 : 90, o.colors);
    const b = m.querySelector('button'); setTimeout(() => b.focus(), 50);
    let done = false; const close = () => { if (done) return; done = true; m.classList.add('out'); setTimeout(() => { m.remove(); nextCel(); }, 220); };
    b.addEventListener('click', close); m.addEventListener('click', e => { if (e.target === m) close(); });
    addEventListener('keydown', function k(e) { if (e.key === 'Escape') { removeEventListener('keydown', k); close(); } });
    if (o.auto) setTimeout(close, o.auto);
  }
  /* ---------- 文字がふわっと出る ---------- */
  function pop(el, text, color, cls) {
    if (!el) return;
    const r = el.getBoundingClientRect(), d = document.createElement('div');
    d.className = 'fx-pop ' + (cls || ''); d.textContent = text; d.style.left = (r.left + r.width / 2) + 'px'; d.style.top = (r.top + r.height * .3) + 'px'; if (color) d.style.color = color;
    document.body.appendChild(d); setTimeout(() => d.remove(), 1000);
  }
  function shake(el) { if (!el || RM()) return; el.classList.remove('fx-shake'); void el.offsetWidth; el.classList.add('fx-shake'); }
  function flash(color) { if (RM()) return; const d = document.createElement('div'); d.className = 'fx-flash'; if (color) d.style.background = color; document.body.appendChild(d); setTimeout(() => d.remove(), 400); }
  // 数字をカウントアップ
  function count(el, to, ms = 600) { if (!el) return; const from = parseInt(String(el.textContent).replace(/\D/g, '')) || 0; if (from === to || RM()) { el.textContent = to.toLocaleString(); return; } const t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / ms), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); el.textContent = v.toLocaleString(); if (k < 1) requestAnimationFrame(f); })(t0); }
  /* ---------- 全画面（大画面モード用） ---------- */
  function fullscreen() { const d = document, e = d.documentElement; try { if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d); else (e.requestFullscreen || e.webkitRequestFullscreen).call(e); } catch (x) {} }
  window.LAB_FX = { play, setOn, isOn: () => on, confetti, celebrate, pop, shake, flash, count, fullscreen, reduced: RM };
})();
