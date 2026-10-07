/* Paul Welsh Coaching. No dependencies. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Springs (interruptible, velocity aware) ---------- */
  // Apple-style parameters: response (seconds) and damping ratio.
  function spring({ from, to, velocity = 0, response = 0.4, damping = 1, onUpdate, onDone }) {
    const w = (2 * Math.PI) / response, k = w * w, c = 2 * damping * w;
    let x = from, v = velocity, last = performance.now(), raf = 0, dead = false;
    const step = (now) => {
      if (dead) return;
      let dt = Math.min((now - last) / 1000, 0.032); last = now;
      const sub = 4; dt /= sub;
      for (let i = 0; i < sub; i++) { v += (-k * (x - to) - c * v) * dt; x += v * dt; }
      onUpdate(x, v);
      if (Math.abs(x - to) < 0.0004 && Math.abs(v) < 0.004) { onUpdate(to, 0); onDone && onDone(); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return { stop() { dead = true; cancelAnimationFrame(raf); }, get v() { return v; } };
  }
  // Where a flick would come to rest (Apple's exponential-decay projection).
  const project = (v, d = 0.998) => ((v / 1000) * d) / (1 - d);
  const rubber = (o, dim = 1, c = 0.55) => (o * dim * c) / (dim + c * Math.abs(o));

  /* ---------- Nav ---------- */
  const nav = $('.nav');
  const toggle = $('.nav-toggle');
  const links = $('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', open);
      links.classList.toggle('open', open);
    });
    links.addEventListener('click', (e) => { if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); links.classList.remove('open'); } });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') { toggle.setAttribute('aria-expanded', 'false'); links.classList.remove('open'); } });
  }

  /* ---------- Single scroll loop ---------- */
  const hero = $('.hero');
  const heroPhoto = $('.hero-photo');
  const statement = $('.statement');
  const words = $$('.statement .sw');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY;
    nav && nav.classList.toggle('is-scrolled', y > 8);
    if (heroPhoto && !reduce && y < innerHeight * 1.2) heroPhoto.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
    if (statement && words.length && !statement.classList.contains('static')) {
      const r = statement.getBoundingClientRect();
      const total = r.height - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(total, 1)));
      const lit = Math.round(p * 1.12 * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < lit));
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  if (reduce && statement) statement.classList.add('static');
  onScroll();

  /* ---------- Sticky call button (phones) ---------- */
  const sticky = $('.sticky-cta');
  if (sticky) {
    const ctas = $$('.hero-actions, .final, .nav-links .btn, .cal').filter(Boolean);
    const seen = new Set();
    const upd = () => sticky.classList.toggle('show', scrollY > innerHeight * 0.7 && seen.size === 0 && toggle?.getAttribute('aria-expanded') !== 'true');
    const sio = new IntersectionObserver((en) => { en.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target))); upd(); }, { threshold: 0.2 });
    ctas.filter((c) => !c.closest('.nav-links')).forEach((c) => sio.observe(c));
    addEventListener('scroll', upd, { passive: true });
    toggle && toggle.addEventListener('click', () => setTimeout(upd, 0));
    upd();
  }

  /* ---------- Hero entrance ---------- */
  if (hero) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      hero.classList.add('is-ready');
      $$('.arcs', hero).forEach((a) => a.classList.add('drawn'));
    }));
  }

  /* ---------- Reveal on scroll, once ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('[data-reveal]').forEach((el) => io.observe(el));
  const arcIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('drawn'); arcIO.unobserve(e.target); } });
  }, { threshold: 0.1 });
  $$('.arcs').filter((a) => !a.closest('.hero')).forEach((a) => arcIO.observe(a));

  /* ---------- FAQ ---------- */
  $$('.q').forEach((q) => {
    const b = $('button', q);
    b.addEventListener('click', () => {
      const open = !q.classList.contains('open');
      q.classList.toggle('open', open);
      b.setAttribute('aria-expanded', open);
    });
  });

  /* ---------- Zero to first rep ---------- */
  const path = $('[data-path]');
  if (path) {
    const stages = JSON.parse($('#stages-data').textContent);
    const N = stages.length;
    const wrap = $('.rail-wrap', path), rail = $('.rail', path), knob = $('.knob', path);
    const holder = $('.rail-holder', path);
    const stopsEls = $$('.stop', path);
    const num = $('[data-step]', path), title = $('[data-title]', path), when = $('[data-when]', path), body = $('[data-body]', path);
    const swaps = $$('.swap', path);
    let x = 0, idx = -1, anim = null, hist = [];

    const render = () => {
      holder.style.setProperty('--x', Math.min(Math.max(x, 0), 1));
      const i = Math.round(Math.min(Math.max(x, 0), 1) * (N - 1));
      stopsEls.forEach((s, n) => { s.classList.toggle('passed', n <= i); s.classList.toggle('current', n === i); });
      knob.textContent = i + 1;
      knob.setAttribute('aria-valuenow', i + 1);
      knob.setAttribute('aria-valuetext', stages[i].title);
      if (i !== idx) setStage(i);
    };
    let swapTimer;
    function setStage(i) {
      const first = idx === -1; idx = i;
      const apply = () => {
        num.textContent = 'Step ' + (i + 1);
        title.textContent = stages[i].title; when.textContent = stages[i].when; body.textContent = stages[i].body;
        swaps.forEach((s) => s.classList.remove('out'));
      };
      if (first || reduce) return apply();
      swaps.forEach((s) => s.classList.add('out'));
      clearTimeout(swapTimer); swapTimer = setTimeout(apply, 140);
    }
    const toX = (clientX) => {
      const r = rail.getBoundingClientRect();
      return (clientX - r.left) / r.width;
    };
    const goTo = (target, v = 0, bounce = false) => {
      anim && anim.stop();
      if (reduce) { x = target; render(); return; }
      anim = spring({ from: x, to: target, velocity: v, response: 0.42, damping: bounce ? 0.78 : 1, onUpdate: (n) => { x = n; render(); } });
    };

    let grab = 0, dragging = false;
    wrap.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.stop') && !e.target.closest('.knob')) return;
      e.preventDefault();
      wrap.setPointerCapture(e.pointerId);
      anim && anim.stop(); // grab it mid-flight: start from the live value
      dragging = true; wrap.classList.add('grabbing');
      const onKnob = !!e.target.closest('.knob');
      grab = onKnob ? x - toX(e.clientX) : 0;
      if (!onKnob) x = toX(e.clientX);
      hist = [{ t: performance.now(), x }];
      render();
    });
    wrap.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      let nx = toX(e.clientX) + grab;
      if (nx < 0) nx = rubber(nx);
      else if (nx > 1) nx = 1 + rubber(nx - 1);
      x = nx;
      hist.push({ t: performance.now(), x }); if (hist.length > 6) hist.shift();
      render();
    });
    const end = () => {
      if (!dragging) return;
      dragging = false; wrap.classList.remove('grabbing');
      const a = hist[0], b = hist[hist.length - 1];
      const v = b && a && b.t > a.t ? (b.x - a.x) / ((b.t - a.t) / 1000) : 0;
      const proj = Math.min(1, Math.max(0, x + project(v) * 0.5));
      const target = Math.round(proj * (N - 1)) / (N - 1);
      goTo(target, v, Math.abs(v) > 0.8);
    };
    wrap.addEventListener('pointerup', end);
    wrap.addEventListener('pointercancel', end);
    stopsEls.forEach((s, n) => s.addEventListener('click', () => goTo(n / (N - 1))));
    knob.addEventListener('keydown', (e) => {
      const cur = Math.round(Math.min(Math.max(x, 0), 1) * (N - 1));
      let n = cur;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') n = Math.min(N - 1, cur + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') n = Math.max(0, cur - 1);
      else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = N - 1; else return;
      e.preventDefault(); goTo(n / (N - 1));
    });
    render();
    // Invite the first drag: a gentle nudge once the section is seen.
    if (!reduce) {
      const nudge = new IntersectionObserver((en) => {
        if (en[0].isIntersecting) { nudge.disconnect(); setTimeout(() => { if (!dragging && x === 0) goTo(0.25, 0, true); }, 700); }
      }, { threshold: 0.6 });
      nudge.observe(path);
    }
  }


  /* ---------- Slider of parts: drag with momentum, snap, arrows ---------- */
  const car = $('[data-car]');
  if (car) {
    const cards = $$('.part', car);
    const bar = $('.car-bar span');
    const prev = $('[data-car-prev]'), next = $('[data-car-next]');
    const maxScroll = () => car.scrollWidth - car.clientWidth;
    const snaps = () => cards.map((c) => Math.min(maxScroll(), c.offsetLeft - parseFloat(getComputedStyle(car).paddingLeft)));
    const nearest = (x) => snaps().reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a));
    let anim = null;
    const prog = () => { const m = maxScroll(); bar && bar.parentNode.style.setProperty('--prog', 0); bar && bar.style.setProperty('--prog', (0.25 + 0.75 * (m ? car.scrollLeft / m : 1)).toFixed(3)); if (prev) prev.disabled = car.scrollLeft < 4; if (next) next.disabled = car.scrollLeft > m - 4; };
    car.addEventListener('scroll', () => requestAnimationFrame(prog), { passive: true });
    const flyTo = (target, v = 0) => {
      anim && anim.stop();
      if (reduce) { car.scrollLeft = target; return; }
      car.classList.add('dragging');
      anim = spring({ from: car.scrollLeft, to: target, velocity: v, response: 0.5, damping: 0.9, onUpdate: (x) => { car.scrollLeft = x; }, onDone: () => car.classList.remove('dragging') });
    };
    // Spring works in 0..1 units normally; here we scale to pixels by wrapping.
    const flyPx = (target, vpx = 0) => {
      anim && anim.stop();
      if (reduce) { car.scrollLeft = target; return; }
      car.classList.add('dragging');
      const from = car.scrollLeft, span = target - from || 1;
      anim = spring({ from: 0, to: 1, velocity: vpx / span, response: 0.5, damping: 0.9, onUpdate: (t) => { car.scrollLeft = from + span * t; }, onDone: () => { car.scrollLeft = target; car.classList.remove('dragging'); } });
    };
    const step = (dir) => { const sn = snaps(); const i = sn.indexOf(nearest(car.scrollLeft)); flyPx(sn[Math.max(0, Math.min(sn.length - 1, i + dir))]); };
    prev && prev.addEventListener('click', () => step(-1));
    next && next.addEventListener('click', () => step(1));
    car.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); step(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } });
    // Mouse drag only; touch uses native scrolling with CSS snap.
    let down = false, sx = 0, sl = 0, hist = [];
    car.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      anim && anim.stop(); down = true; sx = e.clientX; sl = car.scrollLeft; hist = [{ t: performance.now(), x: sl }];
      car.setPointerCapture(e.pointerId); car.classList.add('dragging');
    });
    car.addEventListener('pointermove', (e) => {
      if (!down) return;
      let x = sl - (e.clientX - sx); const m = maxScroll();
      if (x < 0) x = rubber(x, 400); else if (x > m) x = m + rubber(x - m, 400);
      car.scrollLeft = x; hist.push({ t: performance.now(), x: car.scrollLeft }); if (hist.length > 6) hist.shift();
    });
    const up = (e) => {
      if (!down) return; down = false;
      const a = hist[0], b = hist[hist.length - 1];
      const v = b && a && b.t > a.t ? ((b.x - a.x) / (b.t - a.t)) * 1000 : 0;
      const proj = Math.max(0, Math.min(maxScroll(), car.scrollLeft + project(v) * 0.5));
      flyPx(nearest(proj), v);
    };
    car.addEventListener('pointerup', up); car.addEventListener('pointercancel', up);
    car.addEventListener('click', (e) => { if (Math.abs(car.scrollLeft - sl) > 6 && e.pointerType === 'mouse') e.preventDefault(); }, true);
    prog();
  }

  /* ---------- Tabs ---------- */
  $$('[data-tabs]').forEach((t) => {
    const tabs = $$('[role=tab]', t), panels = $$('[role=tabpanel]', t);
    const sel = (i, focus) => { tabs.forEach((b, n) => { b.setAttribute('aria-selected', n === i); b.tabIndex = n === i ? 0 : -1; }); panels.forEach((p, n) => (p.hidden = n !== i)); if (focus) tabs[i].focus(); };
    tabs.forEach((b, i) => { b.addEventListener('click', () => sel(i)); b.addEventListener('keydown', (e) => { const k = e.key; if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); sel((i + 1) % tabs.length, true); } else if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); sel((i - 1 + tabs.length) % tabs.length, true); } }); });
    sel(0);
  });

  /* ---------- Ticks ---------- */
  const tk = $('[data-ticks]');
  if (tk) {
    const msg = $('[data-tick-msg]'), box = $('.tick-result');
    const lines = ['Pick as many as you like.', 'Sounds like a good fit.', 'Sounds like a really good fit.', 'This is exactly who coaching is for.'];
    tk.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true');
      const n = $$('[aria-pressed=true]', tk).length;
      msg.textContent = lines[Math.min(n, lines.length - 1)] ; box.classList.toggle('on', n > 0);
    });
  }

  /* ---------- Calendly: loads only when the visitor asks, so no third-party cookies before consent ---------- */
  const cal = $('[data-calendly]');
  if (cal) {
    const url = cal.getAttribute('data-calendly');
    if (url && !url.includes('YOUR-CALENDLY')) {
      cal.innerHTML = '<div><h3>Choose a time</h3><p>The calendar is provided by Calendly. Loading it connects to their service, see our <a href="../cookies/">cookie notice</a>.</p><button type="button" class="btn" data-load-cal>Show available times</button></div>';
      $('[data-load-cal]', cal).addEventListener('click', () => {
        cal.innerHTML = '<div class="calendly-inline-widget" data-url="' + url + '?hide_gdpr_banner=1&background_color=f1f3f4&text_color=101820&primary_color=101820"></div>';
        const s = document.createElement('script'); s.src = 'https://assets.calendly.com/assets/external/widget.js'; s.async = true; document.body.appendChild(s);
      });
    }
  }
})();
