const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(require('node:path').join(__dirname, '../js/contact-form.js'), 'utf8');
const controls = new Map();
function control(selector) {
  if (!controls.has(selector)) controls.set(selector, {
    hidden: false, style: {}, handlers: {}, attributes: {},
    addEventListener(name, handler) { this.handlers[name] = handler; },
    setAttribute(name, value) { this.attributes[name] = value; },
    focus() {}, appendChild(frame) { this.frame = frame; },
    replaceChildren() { this.frame = null; }
  });
  return controls.get(selector);
}
let message, accepted = false, leads = 0, attempts = 0;
const frames = [];
const window = {
  addEventListener(name, handler) { if (name === 'message') message = handler; },
  WescaleITAnalytics: { trackLead(...args) {
    assert.equal(args.length, 0, 'Do not forward Tally fields or submission identifiers');
    attempts++;
    if (!accepted) return false;
    leads++;
    return true;
  } }
};
const document = {
  querySelector() { return { querySelector: control }; },
  createElement() {
    const frame = { style: {}, contentWindow: {}, focus() {} };
    frames.push(frame);
    return frame;
  }
};
vm.runInNewContext(code, { window, document, Set, JSON, Number });
const load = control('[data-form-load]');
const unload = control('[data-form-unload]');
assert.equal(frames.length, 0, 'No Tally request before explicit form activation');
load.handlers.click();
load.handlers.click();
assert.equal(frames.length, 1);
assert.match(frames[0].src, /^https:\/\/tally\.so\/embed\/ja1WdE\?/);
function send(data, overrides = {}) {
  message({ data, origin: 'https://tally.so', source: frames.at(-1).contentWindow, ...overrides });
}
const height = { event: 'Tally.FormHeight', payload: { formId: 'ja1WdE', height: 640 } };
send(height);
assert.equal(frames[0].style.height, '640px');
send({ ...height, payload: { ...height.payload, height: 100000 } });
assert.equal(frames[0].style.height, '640px');
const submission = id => ({ event: 'Tally.FormSubmitted', payload: {
  formId: 'ja1WdE', id, fields: [{ label: 'email', value: 'test@example.invalid' }]
} });
send(submission('before-consent'));
assert.equal(attempts, 1);
assert.equal(leads, 0);
accepted = true;
send(submission('before-consent'));
assert.equal(leads, 0, 'No later replay of a pre-consent submission');
send(submission('success'));
send(JSON.stringify(submission('success')));
assert.equal(leads, 1, 'A confirmed submission counts once');
for (const origin of ['https://example.org', 'https://tally.so.example.org', 'null']) send(submission('wrong-origin'), { origin });
send(submission('wrong-source'), { source: {} });
send({ event: 'Tally.FormSubmitted', payload: { formId: 'other', id: 'wrong-form' } });
send({ event: 'Tally.FormSubmitted', payload: { formId: 'ja1WdE' } });
send({ event: 'Tally.FormSubmitted', payload: { formId: 'ja1WdE', id: {} } });
send({ event: 'Tally.FormLoaded', payload: { formId: 'ja1WdE', id: 'not-a-submission' } });
send('{broken');
send(null);
assert.equal(leads, 1);
const oldSource = frames[0].contentWindow;
unload.handlers.click();
send(submission('unloaded'), { source: oldSource });
assert.equal(leads, 1);
load.handlers.click();
send(submission('old-frame'), { source: oldSource });
assert.equal(leads, 1);
send(submission('new-frame'));
assert.equal(leads, 2);
accepted = false;
send(submission('revoked'));
assert.equal(leads, 2);
delete window.WescaleITAnalytics;
send(submission('no-analytics'));
console.log('PASS: opt-in embed, trusted Tally origin/source/form, confirmed completion only, dedup, unload and consent boundaries; no real submission.');
