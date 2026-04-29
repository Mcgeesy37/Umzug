/* ══════════════════════════════════════════════════
   MOVEELITE – app.js
   Full interactive experience — Mobile-safe
══════════════════════════════════════════════════ */
'use strict';

/* ── 1. Loader ───────────────────────────────────── */
(function () {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  document.body.style.overflow = 'hidden';
  let v = 0;
  const t = setInterval(() => {
    v += Math.random() * 16 + 5;
    if (v >= 100) { v = 100; clearInterval(t); }
    fill.style.width = v + '%';
    if (v === 100) setTimeout(() => {
      loader.classList.add('out');
      document.body.style.overflow = '';
      animateBars();
    }, 500);
  }, 60);
})();

function animateBars() {
  setTimeout(() => {
    document.querySelectorAll('.hvc-bar-fill').forEach(b => { b.style.width = b.dataset.width + '%'; });
  }, 400);
}

/* ── 2. Scroll Progress ──────────────────────────── */
(function () {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  }, { passive: true });
})();

/* ── 3. Custom Cursor (Desktop) ──────────────────── */
(function () {
  if ('ontouchstart' in window) return;
  const c = document.getElementById('cursor');
  const f = document.getElementById('cursorFollower');
  if (!c || !f) return;
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    c.style.left = mx + 'px'; c.style.top = my + 'px';
  }, { passive: true });
  (function loop() {
    fx += (mx - fx) * 0.1; fy += (my - fy) * 0.1;
    f.style.left = fx + 'px'; f.style.top = fy + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('[data-cursor="large"], button, a').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-lg'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-lg'));
  });
})();

/* ── 4. Hero Canvas — Golden Particle Field ──────── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [], mouse = { x: -999, y: -999 };

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

  const N = window.innerWidth < 768 ? 40 : 80;
  for (let i = 0; i < N; i++) {
    pts.push({
      x: Math.random() * 1920, y: Math.random() * 1080,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.35 + 0.05,
      pulse: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.6
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(201,168,76,${(1 - d / 130) * 0.06})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    // Particles
    pts.forEach(p => {
      p.pulse += 0.018;
      const r = p.r + Math.sin(p.pulse) * 0.4;
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) { const f = (110 - d) / 110; p.vx += (dx / d) * f * 0.35; p.vy += (dy / d) * f * 0.35; }
      p.vx *= 0.98; p.vy *= 0.98;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold ? `rgba(201,168,76,${p.o})` : `rgba(255,255,255,${p.o * 0.4})`;
      if (p.gold) { ctx.shadowColor = 'rgba(201,168,76,0.4)'; ctx.shadowBlur = 6; }
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 5. Navigation ───────────────────────────────── */
(function () {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = '';
  }));
})();

/* ── 6. Trust Bar Duplicate ──────────────────────── */
(function () {
  const el = document.getElementById('tbItems');
  if (el) el.parentNode.appendChild(el.cloneNode(true));
})();

/* ── 7. Data — Leistungen ────────────────────────── */
(function () {
  fetch('data.json')
    .then(r => r.json())
    .then(data => {
      const grid = document.getElementById('leistungenGrid');
      if (!grid) return;
      data.leistungen.forEach((s, i) => {
        const card = document.createElement('div');
        card.className = 'l-card stagger';
        card.setAttribute('data-reveal', '');
        card.setAttribute('data-delay', i * 80);
        card.innerHTML = `
          <span class="lc-num">${String(i + 1).padStart(2, '0')}</span>
          <div class="lc-icon">${s.icon}</div>
          <h3>${s.titel}</h3>
          <p>${s.beschreibung}</p>
          <ul class="lc-features">${s.features.map(f => `<li>${f}</li>`).join('')}</ul>
          <a href="#kontakt" class="lc-link" data-cursor="link">Anfragen →</a>`;
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
          card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
        grid.appendChild(card);
      });
      initReveal();
      initCounters();
    })
    .catch(() => { initReveal(); initCounters(); });
})();

/* ── 8. Scroll Reveal ────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('on'), delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
}

/* ── 9. Counters ─────────────────────────────────── */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseFloat(el.dataset.target);
      let v = 0;
      const inc = end / (2000 / 16);
      const t = setInterval(() => {
        v += inc;
        if (v >= end) { v = end; clearInterval(t); }
        el.textContent = String(end).includes('.') ? v.toFixed(1) : Math.floor(v);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter[data-target], .sb-n.counter[data-target], .counter-big[data-target]').forEach(el => obs.observe(el));
}

/* ── 10. Hero Trust Counters ─────────────────────── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = parseFloat(el.dataset.target);
      let v = 0;
      const inc = end / (1800 / 16);
      const t = setInterval(() => {
        v += inc;
        if (v >= end) { v = end; clearInterval(t); }
        el.textContent = Math.floor(v);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.ht-val.counter[data-target]').forEach(el => obs.observe(el));
})();

/* ── 11. Parallax (Desktop only) ─────────────────── */
(function () {
  if (window.innerWidth < 900 || 'ontouchstart' in window) return;
  const els = document.querySelectorAll('.vr-card-stack, .hv-main-card');
  window.addEventListener('scroll', () => {
    els.forEach((el, i) => { el.style.transform = `translateY(${window.scrollY * (i + 1) * 0.03}px)`; });
  }, { passive: true });
})();

/* ── 12. Smooth Anchors ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── 13. Magnetic Buttons ────────────────────────── */
(function () {
  if ('ontouchstart' in window) return;
  document.querySelectorAll('.btn-primary, .btn-submit, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });
})();

/* ── 14. Form Submit ─────────────────────────────── */
(function () {
  const form    = document.getElementById('kontaktForm');
  const btn     = document.getElementById('submitBtn');
  const success = document.getElementById('kfSuccess');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fname = form.querySelector('#fname')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const von   = form.querySelector('#von')?.value.trim();
    const nach  = form.querySelector('#nach')?.value.trim();
    const dsgvo = form.querySelector('#dsgvo')?.checked;
    if (!fname || !email || !von || !nach || !dsgvo) {
      [form.querySelector('#fname'), form.querySelector('#email'), form.querySelector('#von'), form.querySelector('#nach')]
        .filter(el => el && !el.value.trim())
        .forEach(el => { el.style.borderColor = '#e74c3c'; setTimeout(() => el.style.borderColor = '', 2500); });
      return;
    }
    btn.classList.add('loading');
    await new Promise(r => setTimeout(r, 1800));
    btn.classList.remove('loading');
    const strong = success.querySelector('strong');
    if (strong) strong.textContent = `Vielen Dank, ${fname}!`;
    success.classList.add('show');
    setTimeout(() => { success.classList.remove('show'); form.reset(); }, 6000);
  });
})();

/* ── 15. Page Transitions ────────────────────────── */
(function () {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
    a.addEventListener('click', e => {
      e.preventDefault(); overlay.classList.add('enter');
      setTimeout(() => window.location.href = href, 500);
    });
  });
  window.addEventListener('pageshow', () => {
    if (overlay.classList.contains('enter')) { overlay.classList.remove('enter'); overlay.classList.add('leave'); setTimeout(() => overlay.classList.remove('leave'), 500); }
  });
})();

/* ── 16. Nav Active Section ──────────────────────── */
(function () {
  const secs  = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const l = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (l) l.classList.add('active');
      }
    });
  }, { threshold: 0.4 }).observe !== undefined && secs.forEach(s => new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      const l = document.querySelector(`.nav-links a[href="#${s.id}"]`);
      if (l) l.classList.add('active');
    }
  }, { threshold: 0.4 }).observe(s));
})();

/* ── 17. Keyboard ESC ────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const m = document.getElementById('mobileMenu');
    const b = document.getElementById('burger');
    if (m?.classList.contains('open')) { m.classList.remove('open'); b?.classList.remove('open'); document.body.style.overflow = ''; }
  }
});

/* ── Init ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => { initReveal(); initCounters(); });
