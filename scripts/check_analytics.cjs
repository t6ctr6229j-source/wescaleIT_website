const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync(require('node:path').join(__dirname, '../js/analytics.js'), 'utf8');
function run(choice, blocked = false, options = {}) {
  const handlers = {}, scripts = [], values = {};
  const control = name => ({ hidden: true, addEventListener: (_, fn) => { handlers[name] = fn; } });
  const accept = control('accept'), deny = control('deny'), settings = control('settings');
  const dialog = { open: false, showModal() { this.open = true; }, close() { this.open = false; }, querySelector: s => s.includes('accept') ? accept : deny };
  const status = {};
  const document = { cookie: '', referrer: options.referrer || '', getElementById: id => id === 'statistics-consent' ? dialog : status, querySelectorAll: () => [settings], createElement: () => ({}), head: { appendChild: s => scripts.push(s) } };
  let reloads = 0;
  const location = { protocol: 'https:', origin: 'https://wescaleit.com', hostname: 'wescaleit.com', pathname: '/index.html', reload: () => reloads++ };
  Object.assign(location, options.location || {});
  const window = { addEventListener: (name, fn) => { handlers[name] = fn; } };
  const localStorage = { getItem() { if (blocked) throw Error('blocked'); return choice; }, setItem(k,v) { if (blocked) throw Error('blocked'); values[k] = v; } };
  vm.runInNewContext(code, { document, location, window, localStorage, Date, Set, URL, setTimeout: () => 1, clearTimeout: () => {} });
  return { handlers, scripts, window, dialog, values, reloads: () => reloads };
}
const stored = (choice, expires = Date.now() + 10000) => JSON.stringify({choice,expires});
let x = run(null); assert.equal(x.scripts.length,0);assert.equal(x.dialog.open,true);assert.equal(x.window.dataLayer,undefined);
x.handlers.deny();assert.equal(x.scripts.length,0);assert.equal(x.dialog.open,false);
x.handlers.settings();assert.equal(x.dialog.open,true);x.handlers.accept();assert.equal(x.scripts.length,1);assert.match(x.scripts[0].src,/G-7QYEF752NM$/);
x.handlers.accept();assert.equal(x.scripts.length,1);x.handlers.deny();assert.equal(x.window['ga-disable-G-7QYEF752NM'],true);assert.equal(x.reloads(),1);
x=run(stored('granted'));assert.equal(x.scripts.length,1);assert.equal(x.dialog.open,false);
x=run(stored('denied'));assert.equal(x.scripts.length,0);assert.equal(x.dialog.open,false);
for (const value of [stored('granted',0),'{broken','null']) { x=run(value);assert.equal(x.scripts.length,0);assert.equal(x.dialog.open,true); }
x=run(null,true);assert.equal(x.scripts.length,0);x.handlers.accept();assert.equal(x.scripts.length,1);x.handlers.deny();assert.equal(x.window['ga-disable-G-7QYEF752NM'],true);
console.log('PASS: no Google load before consent or after denial; grant, repeat grant, saved choice, expiry, corrupt/blocked storage and revocation.');

const leadEvents = x => (x.window.dataLayer || []).filter(row => row[0] === 'event' && row[1] === 'generate_lead');
x = run(null);
assert.equal(x.window.WescaleITAnalytics.trackLead(), false);
x.handlers.accept();
assert.equal(leadEvents(x).length, 0, 'Consent must not replay earlier events');
assert.equal(x.window.WescaleITAnalytics.trackLead(), true);
assert.deepEqual(JSON.parse(JSON.stringify(leadEvents(x)[0][2])), {
  send_to: 'G-7QYEF752NM', form_id: 'ja1WdE', method: 'tally'
});
x.handlers.deny();
assert.equal(x.window.WescaleITAnalytics.trackLead(), false);
assert.equal(leadEvents(x).length, 1);
for (const hostname of ['wescaleit-website.pages.dev', 'preview.wescaleit-website.pages.dev', 'localhost', 'wescaleit.com.example.org']) {
  x = run(stored('granted'), false, { location: { hostname, origin: 'https://' + hostname } });
  assert.equal(x.scripts.length, 0, hostname);
  assert.equal(x.window.WescaleITAnalytics.trackLead(), false);
}
x = run(stored('granted'), false, { location: { protocol: 'http:' } });
assert.equal(x.scripts.length, 0);
for (const [referrer, expected] of [
  ['https://www.google.com/search?q=private#fragment', 'https://www.google.com/'],
  ['https://example.org/path?email=private@example.org', 'https://example.org/'],
  ['https://wescaleit.com/kontakt?private=yes', ''],
  ['javascript:alert(1)', ''], ['not a URL', ''], ['', '']
]) {
  x = run(stored('granted'), false, { referrer });
  const config = x.window.dataLayer.find(row => row[0] === 'config')[2];
  assert.equal(config.page_referrer, expected);
  assert.equal(config.page_location, 'https://wescaleit.com/index.html');
}
console.log('PASS: consent-gated lead event, no personal form parameters, no preview/HTTP collection, origin-only source attribution.');

