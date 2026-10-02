import { initViewer } from './viewer';

/** Gives the sticky header a background once the page has scrolled. */
function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  let queued = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    queued = false;
  };

  update();
  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
}

/**
 * Fades sections in as they enter the viewport.
 * Anything already on screen is marked visible *before* the hiding class is applied,
 * so above-the-fold content never flickers — and without JS nothing is ever hidden.
 */
function initReveal() {
  const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!elements.length || reducedMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
  );

  for (const el of elements) {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.94) el.classList.add('is-in');
    else observer.observe(el);
  }

  document.documentElement.classList.add('reveal-ready');
}

initHeader();
initReveal();
initViewer();
