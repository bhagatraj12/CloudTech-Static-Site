/* script.js
   - theme toggle (persist)
   - mobile menu toggle
   - GSAP scroll animations & blob motion
   - card tilt (3D-ish) on mousemove
   - contact demo submit
*/

(() => {
  const body = document.body;
  const themeBtn = document.getElementById('themeToggle');
  const menuBtn = document.getElementById('menuToggle');
  const navList = document.getElementById('navList');
  const yearSpan = document.getElementById('year');

  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // THEME
  const THEME_KEY = 'cloudtech_theme';
  const applyTheme = (mode) => {
    if (mode === 'light') {
      body.classList.add('light');
      themeBtn.textContent = '☀️';
      themeBtn.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      body.classList.remove('light');
      themeBtn.textContent = '🌙';
      themeBtn.setAttribute('aria-label', 'Switch to light theme');
    }
  };
  const stored = localStorage.getItem(THEME_KEY);
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(stored || (prefersLight ? 'light' : 'dark'));

  themeBtn && themeBtn.addEventListener('click', () => {
    const current = body.classList.contains('light') ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // MOBILE MENU
  function closeMenu() {
    navList && navList.classList.remove('open');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    navList && navList.classList.add('open');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'true');
  }
  menuBtn && menuBtn.addEventListener('click', (e) => {
    if (!navList) return;
    const isOpen = navList.classList.contains('open');
    if (isOpen) closeMenu(); else openMenu();
  });

  // close menu on outside click (mobile)
  document.addEventListener('click', (e) => {
    if (!navList || !menuBtn) return;
    if (navList.contains(e.target) || menuBtn.contains(e.target)) return;
    if (navList.classList.contains('open')) closeMenu();
  });

  // close on escape
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && navList && navList.classList.contains('open')) closeMenu();
  });

  // smooth-scroll for same page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      if (href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navList && navList.classList.contains('open')) closeMenu();
      }
    });
  });

  // GSAP animations
  if (window.gsap && window.gsap.utils) {
    gsap.registerPlugin(ScrollTrigger);

    // reveal on scroll for elements with data-anim
    gsap.utils.toArray('[data-anim]').forEach((el, i) => {
      gsap.fromTo(el, { autoAlpha: 0, y: 28 }, {
        autoAlpha: 1, y: 0, duration: 0.8, delay: i * 0.06, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      });
    });

    // hero title entrance
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) gsap.from(heroTitle, { y: 18, autoAlpha: 0, duration: 1.1, ease: 'power3.out', delay: 0.08 });

    // floating blob subtle bobbing
    const blob = document.getElementById('blob1');
    if (blob) {
      gsap.to(blob, { x: 30, y: -18, repeat: -1, yoyo: true, duration: 6, ease: 'sine.inOut' });
      gsap.to(blob, { rotation: 10, repeat: -1, yoyo: true, duration: 18, ease: 'sine.inOut' });
    }

    // subtle floating for visual card
    const vc = document.getElementById('visualCard');
    if (vc) gsap.to(vc, { y: -12, repeat: -1, yoyo: true, duration: 4, ease: 'sine.inOut' });
  }

  // 3D tilt effect for elements with data-tilt
  function initTilt() {
    const tiltEls = document.querySelectorAll('[data-tilt]');
    tiltEls.forEach(el => {
      el.style.transformStyle = 'preserve-3d';
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotY = (x - 0.5) * 12; // -6 to 6
        const rotX = (0.5 - y) * 10; // -5 to 5
        el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0)`;
      });
    });
  }
  initTilt();

  // contact form demo behavior
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
      setTimeout(() => {
        if (btn) { btn.textContent = 'Message sent ✓'; }
        contactForm.reset();
      }, 900);
    });
  }

  // small accessibility: focus main when skip link used
  const skip = document.querySelector('.skip-link');
  if (skip) {
    skip.addEventListener('click', (e) => {
      const main = document.getElementById('main');
      if (main) main.setAttribute('tabindex', '-1'), main.focus();
    });
  }

  // re-init tilt when content changes or on resize
  window.addEventListener('resize', () => { initTilt(); });

})();
