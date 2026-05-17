/* =========================================
   JULIANE CLINIC — JS
   ========================================= */

// Nav: scroll state
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Nav: mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Fade-in on scroll (IntersectionObserver)
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings by index within parent
        const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
        let delay = 0;
        siblings.forEach((s, idx) => { if (s === entry.target) delay = idx * 80; });
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
fadeEls.forEach(el => observer.observe(el));

// Form: WhatsApp redirect
const form = document.getElementById('agendarForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome         = form.nome.value.trim();
  const tel          = form.tel.value.trim();
  const procedimento = form.procedimento.value || 'Avaliação geral';
  const msg = encodeURIComponent(
    `Olá Juliane! Gostaria de agendar uma consulta.\n\nNome: ${nome}\nTelefone: ${tel}\nInteresse: ${procedimento}`
  );
  window.open(`https://wa.me/5584998131962?text=${msg}`, '_blank');
});

// Smooth scroll offset for sticky nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// Counter animation — triggered after fade-in completes
function animateCounter(el) {
  const raw = el.textContent.trim();
  const num = parseInt(raw.replace(/\D/g, ''), 10);
  const suffix = raw.replace(/[\d]/g, '');
  if (!num) return;
  let start = null;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = suffix.startsWith('+')
      ? `+${Math.floor(ease * num)}`
      : `${Math.floor(ease * num)}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsEl = document.querySelector('.stats');
if (statsEl) {
  const mo = new MutationObserver(() => {
    if (statsEl.classList.contains('visible')) {
      statsEl.querySelectorAll('.stat__num').forEach(animateCounter);
      mo.disconnect();
    }
  });
  mo.observe(statsEl, { attributes: true, attributeFilter: ['class'] });
}
