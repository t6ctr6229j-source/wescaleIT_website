/* Basic consent: no Google requests until statistics consent is granted. */
(() => {
  'use strict';
  const id = 'G-7QYEF752NM';
  const key = 'wescaleit.statistics.v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const dialog = document.getElementById('statistics-consent');
  const status = document.getElementById('statistics-status');
  const controls = document.querySelectorAll('[data-statistics-settings]');
  let loaded = false;
  let accepted = false;
  window['ga-disable-' + id] = true;
  function readChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value && ['granted', 'denied'].includes(value.choice) && value.expires > Date.now()) return value.choice;
    } catch (_) { /* Storage can be unavailable; default remains off. */ }
    return null;
  }
  function clearCookies() {
    const domains = location.hostname.split('.').map((_, i, parts) => parts.slice(i).join('.'));
    const parts = location.pathname.split('/');
    const paths = new Set(['/']);
    for (let i = 1; i < parts.length; i++) paths.add(parts.slice(0, i).join('/') || '/');
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      for (const path of paths) {
        const expired = name + '=; Max-Age=0; path=' + path + '; SameSite=Lax';
        document.cookie = expired;
        for (const domain of domains) document.cookie = expired + '; domain=' + domain;
      }
    });
  }
  function start() {
    if (loaded || location.protocol !== 'https:') return;
    loaded = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', id, {
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_expires: 15552000, cookie_update: false,
      page_location: location.origin + location.pathname,
      page_referrer: '', send_page_view: true
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  function show() {
    status.textContent = accepted ? 'Deine aktuelle Auswahl: Statistik erlaubt.' : 'Deine aktuelle Auswahl: Statistik ausgeschaltet.';
    if (!dialog.open) dialog.showModal();
  }
  function choose(choice) {
    const wasLoaded = loaded;
    accepted = choice === 'granted';
    try { localStorage.setItem(key, JSON.stringify({ choice, expires: Date.now() + lifetime })); } catch (_) {}
    if (accepted) start();
    else {
      window['ga-disable-' + id] = true;
      clearCookies();
    }
    dialog.close();
    if (!accepted && wasLoaded) location.reload();
  }
  controls.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', show);
  });
  dialog.querySelector('[data-statistics-accept]').addEventListener('click', () => choose('granted'));
  dialog.querySelector('[data-statistics-deny]').addEventListener('click', () => choose('denied'));
  // Escape closes the dialog without granting consent.
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      window['ga-disable-' + id] = true;
      location.reload();
    }
  });
  const choice = readChoice();
  accepted = choice === 'granted';
  if (accepted) start();
  else if (!choice) show();
  else clearCookies();
})();
