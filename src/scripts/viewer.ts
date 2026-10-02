/**
 * Thumbnail viewer.
 * Reuses each card's own <picture> (same AVIF/WebP sources), only changing `sizes`,
 * so the browser picks a larger file for the viewer and small ones for the feed preview.
 */

// Every piece is shown at most at YouTube's upload width, so all of them appear at the same size.
const DISPLAY_MAX = 1280;
// Rendered width of the viewer image. Keep in sync with Viewer.astro:
// 88px stage padding per side from 900px up, image limited by height on short screens.
const FULL_SIZES = `(max-height: 560px) calc((100vh - 52px) * 1.78), (min-width: 900px) min(${DISPLAY_MAX}px, calc(100vw - 176px)), 100vw`;
const SWIPE_DISTANCE = 48;

const pad = (n: number) => String(n).padStart(2, '0');

export function initViewer() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-viewer]');
  const cards = [...document.querySelectorAll<HTMLElement>('[data-work]')];
  if (!dialog || !cards.length || typeof dialog.showModal !== 'function') return;

  const get = <T extends HTMLElement>(selector: string) => dialog.querySelector<T>(selector)!;
  const stage = get('[data-viewer-stage]');
  const fullView = get('[data-viewer-full]');
  const feedView = get('[data-viewer-feed]');
  const preload = get('[data-viewer-preload]');
  const status = get('[data-viewer-status]');
  const modeButton = get<HTMLButtonElement>('[data-viewer-mode]');
  const fields = {
    count: get('[data-viewer-count]'),
    title: get('[data-viewer-title]'),
    translation: get('[data-viewer-translation]'),
    tags: get('[data-viewer-tags]'),
    note: get('[data-viewer-note]'),
    process: get('[data-viewer-process]'),
  };

  let index = 0;
  let feedMode = false;
  let opener: HTMLElement | null = null;

  // The caption lines up with whatever is on screen: the image frame, or the feed preview.
  const sizeObserver = new ResizeObserver(([entry]) => {
    dialog.style.setProperty('--frame-w', `${Math.round(entry.borderBoxSize[0].inlineSize)}px`);
    if (feedMode) updateFeedLabels();
  });

  // On phones the 360px mockup is narrower than 360px — say so instead of claiming a size it isn't.
  function updateFeedLabels() {
    feedView.querySelectorAll<HTMLElement>('[data-feed-size]').forEach((label) => {
      const slot = label.closest('.feed__home')?.querySelector<HTMLElement>('[data-feed-slot]');
      const shown = slot ? Math.round(slot.getBoundingClientRect().width) : 360;
      label.textContent = shown < 358 ? `360 px (shown at ${shown} px)` : '360 px';
    });
  }

  /** Clones a card's <picture>, with `sizes` set for where it will be shown. */
  function pictureFor(card: HTMLElement, sizes: string, priority: 'high' | 'low' | 'auto' = 'auto') {
    const picture = card.querySelector('picture')!.cloneNode(true) as HTMLElement;
    picture.querySelectorAll('source').forEach((source) => source.setAttribute('sizes', sizes));
    const img = picture.querySelector('img')!;
    img.setAttribute('sizes', sizes);
    img.loading = 'eager';
    img.setAttribute('fetchpriority', priority);
    for (const attr of ['id', 'class', 'style']) img.removeAttribute(attr);
    return { picture, img };
  }

  function renderFull(card: HTMLElement) {
    const frame = document.createElement('div');
    frame.className = 'viewer__frame';
    const width = Number(card.dataset.width);
    const height = Number(card.dataset.height);
    // Same display size for every piece, never larger than the original file, real proportions.
    frame.style.setProperty('--w', `${Math.min(width || DISPLAY_MAX, DISPLAY_MAX)}px`);
    if (width && height) frame.style.setProperty('--ar', `${width} / ${height}`);

    // The card's already-loaded image fills the frame instantly while the larger file loads.
    const thumb = card.querySelector('img');
    if (thumb?.currentSrc) {
      const placeholder = document.createElement('img');
      placeholder.className = 'viewer__placeholder';
      placeholder.src = thumb.currentSrc;
      placeholder.alt = '';
      frame.append(placeholder);
    }

    const { picture, img } = pictureFor(card, FULL_SIZES, 'high');
    img.className = 'viewer__img';
    const loaded = () => {
      img.classList.add('is-loaded');
      warmNeighbours();
    };
    img.addEventListener('load', loaded, { once: true });
    img.addEventListener('error', loaded, { once: true });
    frame.append(picture);
    fullView.replaceChildren(frame);
    if (img.complete && img.naturalWidth) loaded();

    sizeObserver.disconnect();
    sizeObserver.observe(frame);
  }

  function renderFeed(card: HTMLElement) {
    feedView.querySelectorAll<HTMLElement>('[data-feed-slot]').forEach((slot) => {
      const { picture, img } = pictureFor(card, `${slot.dataset.feedSlot}px`);
      img.alt = '';
      slot.replaceChildren(picture);
    });
    updateFeedLabels();
    sizeObserver.disconnect();
    sizeObserver.observe(feedView);
  }

  /** Warms the cache for the previous and next pieces once the current one has loaded. */
  function warmNeighbours() {
    if (feedMode || !dialog!.open) return;
    const neighbours = [index + 1, index - 1]
      .map((i) => cards[(i + cards.length) % cards.length])
      .filter((card, i, list) => card !== cards[index] && list.indexOf(card) === i);
    preload.replaceChildren(...neighbours.map((card) => pictureFor(card, FULL_SIZES, 'low').picture));
  }

  function render() {
    const card = cards[index];
    const data = card.dataset;

    fields.count.textContent = `${pad(index + 1)} / ${pad(cards.length)}`;
    fields.title.textContent = data.title ?? '';
    if (data.lang) fields.title.lang = data.lang;
    else fields.title.removeAttribute('lang');

    fields.translation.replaceChildren();
    if (data.translation) {
      const label = document.createElement('span');
      label.className = 'caps';
      label.textContent = 'EN';
      fields.translation.append(label, ` ${data.translation}`);
    }
    fields.tags.textContent = [data.tags, data.lang?.toUpperCase()].filter(Boolean).join(' · ');
    fields.note.textContent = data.note ?? '';
    fields.process.textContent = data.process ? `Process: ${data.process}` : '';

    if (feedMode) renderFeed(card);
    else renderFull(card);
  }

  function setMode(feed: boolean) {
    feedMode = feed;
    modeButton.setAttribute('aria-pressed', String(feed));
    fullView.hidden = feed;
    feedView.hidden = !feed;
  }

  function go(step: number) {
    index = (index + step + cards.length) % cards.length;
    render();
    // Announce the new piece; the title keeps its own language (e.g. Portuguese).
    const { title = '', lang } = cards[index].dataset;
    const name = document.createElement('span');
    name.textContent = title;
    if (lang) name.lang = lang;
    status.replaceChildren(`${index + 1} of ${cards.length}: `, name);
    history.replaceState(null, '', `#${cards[index].id}`);
  }

  function open(i: number, from?: HTMLElement | null) {
    index = i;
    opener = from ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setMode(false);
    status.textContent = '';
    dialog!.showModal();
    render();
    // Focus the dialog itself: screen readers announce its title, and no button
    // shows a focus ring to mouse and touch users on open.
    dialog!.focus();
    history.replaceState(null, '', `#${cards[i].id}`);
  }

  // ── Wiring ───────────────────────────────────────────────
  cards.forEach((card, i) => {
    card.querySelector('a')?.addEventListener('click', (event) => {
      // Let modified clicks (new tab, etc.) open the full image as a normal link.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(i);
    });
  });

  get('[data-viewer-close]').addEventListener('click', () => dialog.close());
  get('[data-viewer-prev]').addEventListener('click', () => go(-1));
  get('[data-viewer-next]').addEventListener('click', () => go(1));
  modeButton.addEventListener('click', () => {
    setMode(!feedMode);
    render();
  });

  if (cards.length < 2) {
    dialog.querySelectorAll<HTMLElement>('.viewer__nav').forEach((btn) => (btn.hidden = true));
  }

  // Listen on the document so the arrows work wherever focus ended up while the viewer is open.
  document.addEventListener('keydown', (event) => {
    if (!dialog.open) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    }
  });

  // Clicking the empty area around the image closes the viewer.
  stage.addEventListener('click', (event) => {
    if (event.target === stage || event.target === fullView) dialog.close();
  });

  // Horizontal swipe on touch screens.
  let startX = 0;
  let startY = 0;
  let tracking = false;
  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' || !event.isPrimary) return;
    tracking = true;
    startX = event.clientX;
    startY = event.clientY;
  });
  stage.addEventListener('pointerup', (event) => {
    if (!tracking) return;
    tracking = false;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
  });
  stage.addEventListener('pointercancel', () => (tracking = false));

  dialog.addEventListener('close', () => {
    // Images stay in place while the dialog fades out; the next open replaces them.
    sizeObserver.disconnect();
    preload.replaceChildren();
    history.replaceState(null, '', location.pathname + location.search);
    opener?.focus({ preventScroll: true });
  });

  // Shared links (#work-<id>) open straight into that piece — also when only the hash changes.
  const openFromHash = () => {
    const i = cards.findIndex((card) => `#${card.id}` === location.hash);
    if (i >= 0 && !dialog.open) open(i, cards[i].querySelector('a'));
  };
  window.addEventListener('hashchange', openFromHash);
  // Wait for the page load: the browser's own jump to the fragment would otherwise take focus away.
  if (document.readyState === 'complete') openFromHash();
  else window.addEventListener('load', () => requestAnimationFrame(openFromHash), { once: true });
}
