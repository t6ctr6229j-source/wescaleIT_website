/* Small, dependency-free additions; original Webflow interactions are retained. */
(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nav = document.querySelector('.navbar_component');
  const menu = document.querySelector('.draft-menu');
  const toggle = document.querySelector('.draft-menu-toggle');
  function closeMenu(returnFocus = false) {
    menu?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Menü öffnen');
    if (returnFocus) toggle?.focus();
  }
  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });
  menu?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.classList.contains('is-open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (nav && !nav.contains(event.target)) closeMenu();
  });
  const updateNav = () => nav?.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', updateNav, { passive: true }); updateNav();
  window.matchMedia('(min-width: 992px)').addEventListener('change', () => closeMenu());

  const panels = [...document.querySelectorAll('.brand-panel')];
  const buttons = panels.map(panel => panel.querySelector('.solutions_column'));
  function activate(panel) {
    panels.forEach(item => {
      const active = item === panel;
      item.classList.toggle('active', active);
      item.querySelector('.solutions_column').setAttribute('aria-expanded', String(active));
      item.querySelector('.solutions_column-content').inert = !active;
    });
  }
  buttons.forEach((button, i) => {
    button.addEventListener('click', () => activate(panels[i]));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (i + 1) % buttons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (i + buttons.length - 1) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); activate(panels[next]); buttons[next].focus(); }
    });
  });
  function hashPanel() {
    const id = location.hash.slice(1);
    const panel = panels.find(item => item.id === id);
    if (panel) activate(panel);
  }
  window.addEventListener('hashchange', hashPanel); hashPanel();

  document.querySelectorAll('.motion-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const marquee = button.previousElementSibling;
      const paused = marquee.classList.toggle('is-paused');
      button.setAttribute('aria-pressed', String(paused));
      button.textContent = paused ? 'Animation fortsetzen' : 'Animation pausieren';
    });
  });
  document.querySelectorAll('.wall_track').forEach(track => {
    const items = [...track.children];
    items.forEach(item => {
      const clone = item.cloneNode(true); clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      clone.querySelectorAll('a,button').forEach(el => el.setAttribute('tabindex', '-1'));
      track.appendChild(clone);
    });
  });
  if (!reduceMotion.matches && window.gsap && window.ScrollTrigger && window.SplitType && document.querySelector('.quote_text')) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    const split = new window.SplitType('.quote_text', { types: 'words' });
    window.gsap.from(split.words, {
      opacity: 0.25, stagger: 0.1,
      scrollTrigger: { trigger: '.section_quote', start: 'top 75%', end: 'bottom 70%', scrub: 1 }
    });
  }
  document.querySelectorAll('.current-year').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
