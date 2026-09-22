const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync(require('node:path').join(__dirname, '../js/analytics.js'), 'utf8');
function run(choice, blocked = false) {
  const handlers = {}, scripts = [], values = {};
  const control = name => ({ hidden: true, addEventListener: (_, fn) => { handlers[name] = fn; } });
  const accept = control('accept'), deny = control('deny'), settings = control('settings');
  const dialog = { open: false, showModal() { this.open = true; }, close() { this.open = false; }, querySelector: s => s.includes('accept') ? accept : deny };
  const status = {};
  const document = { cookie: '', getElementById: id => id === 'statistics-consent' ? dialog : status, querySelectorAll: () => [settings], createElement: () => ({}), head: { appendChild: s => scripts.push(s) } };
  let reloads = 0;
  const location = { protocol: 'https:', origin: 'https://wescaleit.com', hostname: 'wescaleit.com', pathname: '/index.html', reload: () => reloads++ };
  const window = { addEventListener: (name, fn) => { handlers[name] = fn; } };
  const localStorage = { getItem() { if (blocked) throw Error('blocked'); return choice; }, setItem(k,v) { if (blocked) throw Error('blocked'); values[k] = v; } };
  vm.runInNewContext(code, { document, location, window, localStorage, Date, Set });
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
