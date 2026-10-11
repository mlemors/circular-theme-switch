# API


- `revealTheme(apply, { event?, duration?, easing? })`: update any theme inside `apply`; async callbacks must resolve after the DOM is updated. Returns `true` when applied, `false` when a theme transition is already active. Errors from `apply` propagate.
- `createThemeToggle({ initialTheme?, storageKey?, onChange? })`: initializes root `dark` / `light` classes, restores a saved theme, and returns `{ theme, toggle(event?, options?) }`. Defaults: `dark`, storage key `theme`. Pass `storageKey: null` to disable persistence. Call this only in the browser after the button exists.
- Default animation: `500` milliseconds, `ease-out`. A keyboard click starts at the button center; pointer coordinates including `0` are preserved.

The root snapshot covers the current document viewport, including app panels and DOM modals. It cannot animate native OS title bars, other windows, or other documents. Compatible Tauri/Electron webviews can use the same code; older engines switch immediately. Reduced-motion preferences also switch immediately. Avoid starting other document view transitions while this one is running. Keep `apply` focused on DOM updates and give the page an opaque background. Do not assign separate `view-transition-name` values to elements you want inside the single circular root reveal.


[Back to README](../README.md)
