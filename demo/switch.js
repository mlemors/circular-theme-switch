import { createThemeToggle } from '../src/index.js';

// Parent and iframe snapshots must not overlap. Both documents are same-origin.
export function bindThemeSwitch(button, options) {
  const controller = createThemeToggle({ ...options, onChange(value) {
    button.setAttribute('aria-pressed', String(value === 'dark'));
  } });
  button.addEventListener('click', async event => {
    const host = window.top;
    if (host.circularThemeDemoBusy) return;
    host.circularThemeDemoBusy = true;
    try { await controller.toggle(event); }
    finally { host.circularThemeDemoBusy = false; }
  });
}
