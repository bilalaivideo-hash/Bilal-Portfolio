/* =========================================================
   Muhammad Bilal — Portfolio
   Vanilla JS: no dependencies
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('done'), 300);
  });
  // Fallback in case 'load' already fired before this script ran
  setTimeout(() => loader && loader.classList.add('done'), 1800);

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  root.setAttribute('data-theme', 'dark'); // dark by default, per design brief

  themeToggle && themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
  });

  /* ---------- Sticky navbar ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 24) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle && menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks && navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const navAnchors = document.querySelectorAll('[data-nav]');
  const sections = Array.from(navAnchors)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id;
        const link = document.querySelector(`[data-nav][href="${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

    sections.forEach(sec => navObserver.observe(sec));
  }

  /* ---------- Hero card: mouse-reactive tilt + gentle float ---------- */
  const heroVisual = document.querySelector('.hero-visual');
  const heroCardEl = document.querySelector('.hero-card');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroVisual && heroCardEl && !prefersReducedMotion) {
    let tiltX = 0, tiltY = 0, targetTiltX = 0, targetTiltY = 0;
    const start = performance.now();

    const floatLoop = (now) => {
      const t = (now - start) / 1000;
      const bob = Math.sin(t * 1.1) * 8;
      tiltX += (targetTiltX - tiltX) * 0.08;
      tiltY += (targetTiltY - tiltY) * 0.08;
      heroCardEl.style.transform = `translateY(${bob}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      requestAnimationFrame(floatLoop);
    };
    requestAnimationFrame(floatLoop);

    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = px * 14;
      targetTiltX = -py * 14;
    }, { passive: true });

    heroVisual.addEventListener('mouseleave', () => {
      targetTiltX = 0; targetTiltY = 0;
    });
  }

  /* ---------- Custom cursor: instant dot + lagging glow ---------- */
  const glow = document.getElementById('cursorGlow');
  const dot = document.getElementById('cursorDot');
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (isFinePointer && glow && dot) {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    }, { passive: true });

    // Glow trails the dot slightly for a softer, premium feel
    const animateGlow = () => {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateGlow);
    };
    requestAnimationFrame(animateGlow);

    // Scale cursor up over interactive elements
    document.querySelectorAll('a, button, .card, .work-card, .chip-card').forEach(el => {
      el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
      el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
    });
  } else {
    if (glow) glow.style.display = 'none';
    if (dot) dot.style.display = 'none';
  }

  /* ---------- Typing effect for hero role ---------- */
  const typedEl = document.getElementById('typedRole');
  if (typedEl) {
    const roles = ['Shopify Developer', 'Social Media Marketer', 'AI Web Developer'];
    let roleIndex = 0, charIndex = roles[0].length, deleting = false;

    const tick = () => {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        if (charIndex > current.length) { deleting = true; setTimeout(tick, 1400); return; }
      } else {
        charIndex--;
        if (charIndex < 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; charIndex = 0; }
      }
      typedEl.textContent = current.slice(0, charIndex);
      setTimeout(tick, deleting ? 40 : 70);
    };
    setTimeout(tick, 1200);
  }

  /* ---------- Button ripple on click ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'btn-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Subtle hero parallax on the ambient orbs ---------- */
  const hero = document.getElementById('hero');
  const orbs = document.querySelectorAll('.orb');
  if (hero && orbs.length && isFinePointer) {
    hero.addEventListener('mousemove', (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const dx = (e.clientX / w - 0.5) * 24;
      const dy = (e.clientY / h - 0.5) * 24;
      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.6;
        orb.style.marginLeft = `${dx * factor}px`;
        orb.style.marginTop = `${dy * factor}px`;
      });
    }, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Contact form (front-end demo handling) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    if (!name) return;
    formNote.textContent = `Thanks, ${name.split(' ')[0]} — message captured. For a faster reply, use WhatsApp above.`;
    form.reset();
  });

});
