(() => {
  'use strict';
  const shell = document.querySelector('[data-contact-form]');
  if (!shell) return;
  const load = shell.querySelector('[data-form-load]');
  const unload = shell.querySelector('[data-form-unload]');
  const consent = shell.querySelector('[data-form-consent]');
  const container = shell.querySelector('#contact-form-embed');
  let frame = null;
  load.hidden = false;
  load.addEventListener('click', () => {
    if (frame) return;
    frame = document.createElement('iframe');
    frame.title = 'Kontakt zur wescaleIT AG: FCTH, Silverback oder Psoydo';
    frame.src = 'https://tally.so/embed/ja1WdE?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1';
    frame.referrerPolicy = 'no-referrer';
    container.appendChild(frame);
    container.hidden = false;
    consent.hidden = true;
    unload.hidden = false;
    load.setAttribute('aria-expanded', 'true');
    frame.focus();
  });
  unload.addEventListener('click', () => {
    container.replaceChildren();
    frame = null;
    container.hidden = true;
    consent.hidden = false;
    unload.hidden = true;
    load.setAttribute('aria-expanded', 'false');
    load.focus();
  });
  window.addEventListener('message', event => {
    if (!frame || event.origin !== 'https://tally.so' || event.source !== frame.contentWindow) return;
    let data = event.data;
    try { if (typeof data === 'string') data = JSON.parse(data); } catch { return; }
    if (data?.event !== 'Tally.FormHeight' || data.payload?.formId !== 'ja1WdE') return;
    const height = Number(data.payload.height);
    if (Number.isFinite(height) && height >= 200 && height <= 6000) frame.style.height = height + 'px';
  });
})();
