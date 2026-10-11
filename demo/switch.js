import { createThemeToggle } from '../src/index.js';

// Parent and iframe snapshots must not overlap. Both documents are same-origin.
export function bindThemeSwitch(button, options) {
  const controller = createThemeToggle({ ...options, onChange(value) {
    button.setAttribute('aria-pressed', String(value === 'dark'));
    const scope = button.id === 'app-theme' ? 'app' : 'website';
    const label = `Switch ${scope} to ${value === 'dark' ? 'light' : 'dark'} mode`;
    button.setAttribute('aria-label', label);
    button.title = label;
    const shape = value === 'dark'
      ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>'
      : '<path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"/>';
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${shape}</svg>`;
  } });
  button.addEventListener('click', async event => {
    const host = window.top;
    if (host.circularThemeDemoBusy) return;
    host.circularThemeDemoBusy = true;
    try { await controller.toggle(event); }
    finally { host.circularThemeDemoBusy = false; }
  });
}
