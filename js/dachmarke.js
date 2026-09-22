/* Shared navigation; all content and destination links work without JavaScript. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const header = document.querySelector('.site-nav');
  const menu = document.querySelector('#main-navigation');
  const toggle = document.querySelector('.menu-toggle');
  const mobile = window.matchMedia('(max-width: 760px)');
  function closeMenu(focus = false) {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (focus) toggle.focus();
  }
  toggle.hidden = !mobile.matches;
  mobile.addEventListener('change', () => {
    toggle.hidden = !mobile.matches;
    closeMenu();
  });
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(true);
  });
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  document.querySelectorAll('.current-year').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
