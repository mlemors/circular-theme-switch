import { test } from 'node:test';
import assert from 'node:assert/strict';
import { revealTheme, createThemeToggle } from '../src/index.js';
function setup({ reduced = false, supported = true } = {}) {
  const classes = new Set(); const props = new Map(); const calls = [];
  const root = { classList: { contains: v => classes.has(v), add: v => classes.add(v), remove: (...vs) => vs.forEach(v => classes.delete(v)) },
    style: { setProperty: (k,v) => props.set(k,v), removeProperty: k => props.delete(k) }, animate: (...a) => calls.push(a) };
  globalThis.document = { documentElement: root };
  globalThis.matchMedia = () => ({ matches: reduced });
  globalThis.innerWidth = 800; globalThis.innerHeight = 600;
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  if (supported) document.startViewTransition = apply => {
    const done = Promise.resolve().then(apply);
    return { ready: done, updateCallbackDone: done, finished: done, skipTransition() {} };
  };
  return { root, classes, props, calls };
}
test('pointer origin at zero and farthest-corner coverage', async () => {
  const s = setup(); let applied = false;
  await revealTheme(() => { applied = true; }, { event: { detail: 1, clientX: 0, clientY: 0 } });
  assert.ok(applied); assert.deepEqual(s.calls[0][0].clipPath, ['circle(0px at 0px 0px)', 'circle(1000px at 0px 0px)']);
  assert.equal(s.calls[0][1].pseudoElement, '::view-transition-new(root)');
  assert.equal(s.classes.size, 0); assert.equal(s.props.size, 0);
});
test('keyboard starts at trigger center', async () => {
  const s = setup();
  await revealTheme(() => {}, { event: { detail: 0, clientX: 0, clientY: 0, currentTarget: { getBoundingClientRect: () => ({ left: 20, top: 30, width: 40, height: 40 }) } } });
  assert.equal(s.calls[0][0].clipPath[0], 'circle(0px at 40px 50px)');
});
for (const options of [{ reduced: true }, { supported: false }]) test(`instant fallback ${JSON.stringify(options)}`, async () => {
  const s = setup(options); let applied = 0;
  assert.equal(await revealTheme(async () => { applied++; }), true);
  assert.equal(applied, 1); assert.equal(s.calls.length, 0);
});
test('overlapping toggles are ignored', async () => {
  setup(); let release; let count = 0;
  const first = revealTheme(() => new Promise(resolve => { count++; release = resolve; }));
  await Promise.resolve();
  assert.equal(await revealTheme(() => { count++; }), false);
  release(); await first; assert.equal(count, 1);
});
test('failed DOM update propagates and releases temporary styles', async () => {
  const s = setup(); await assert.rejects(revealTheme(() => { throw new Error('update failed'); }), /update failed/);
  assert.equal(s.classes.size, 0); assert.equal(s.props.size, 0);
});
test('controller toggles both directions when storage is blocked', async () => {
  const s = setup({ supported: false }); globalThis.localStorage = { getItem() { throw Error(); }, setItem() { throw Error(); } };
  const theme = createThemeToggle(); assert.ok(s.classes.has('dark'));
  await theme.toggle(); assert.equal(theme.theme, 'light'); assert.ok(s.classes.has('light'));
  await theme.toggle(); assert.equal(theme.theme, 'dark'); assert.ok(s.classes.has('dark'));
});
