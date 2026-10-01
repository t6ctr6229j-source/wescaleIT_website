/* One original Spline scene per page, with a local, always-available poster. */
(() => {
  'use strict';
  const scene = document.querySelector('[data-blob-scene]');
  if (!scene) return;
  const canvas = scene.querySelector('canvas');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let app;
  let loading = false;
  let failed = false;
  let visible = true;
  let ready = false;
  function resize() {
    if (!ready || !window.matchMedia('(max-width: 760px)').matches) return;
    const stage = canvas.parentElement;
    app.setSize(stage.clientWidth, stage.clientHeight);
  }
  function update() {
    const animate = ready && !motion.matches;
    scene.classList.toggle('is-ready', animate);
    if (!ready) return;
    if (animate && visible && !document.hidden) app.play();
    else app.stop();
  }
  async function load() {
    if (motion.matches || loading || ready || failed) return;
    loading = true;
    let timeout;
    try {
      const task = (async () => {
        const { Application } = await import('https://cdn.jsdelivr.net/npm/@splinetool/runtime@2.0.63/build/runtime.js');
        if (failed || motion.matches) return;
        app = new Application(canvas);
        await app.load(scene.dataset.blobScene);
        if (failed) { app.dispose(); return; }
        ready = true;
        resize();
      })();
      await Promise.race([task, new Promise((_, reject) => {
        timeout = window.setTimeout(() => reject(new Error('Spline timeout')), 20000);
      })]);
    } catch (_) {
      failed = true;
      ready = false;
      if (app) app.dispose();
    } finally {
      window.clearTimeout(timeout);
      loading = false;
      update();
    }
  }
  canvas.addEventListener('webglcontextlost', () => {
    failed = true;
    ready = false;
    scene.classList.remove('is-ready');
  });
  motion.addEventListener('change', () => { update(); load(); });
  document.addEventListener('visibilitychange', update);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas.parentElement);
  else window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }).observe(scene);
  }
  load();
})();
