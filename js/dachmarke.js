/* Small, dependency-free additions; original Webflow interactions are retained. */
(() => {
  'use strict';
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
  document.querySelectorAll('.current-year').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
