# Circular Theme Switch ◐

**Circular expanding dark/light theme switch.** A circular dark/light reveal that expands from your click across the entire application window.

![Circular website and app theme switches in action](assets/demo.gif)

[**Live demo →**](https://mlemors.github.io/circular-theme-switch/demo/)

Zero runtime dependencies. Framework independent. Includes TypeScript declarations, keyboard origins, reduced-motion support, optional persistence, and a fallback for environments without same-document View Transitions.

## Try it

```sh
git clone https://github.com/mlemors/circular-theme-switch.git
cd circular-theme-switch
npm run demo
# Open http://localhost:4173/demo/
```

Click the circular switch in the website header or in the app title bar. The new theme expands over the whole page in both directions, using the original 500 ms ease-out animation. The demo simulates a website and an embedded music app. Each has its own independent theme switch. The app runs in a same-origin iframe, so its circular reveal stays inside its window. Website and app preferences use separate storage keys.

## Reuse it

Install from GitHub (this package is not published on npm):

```sh
npm install github:mlemors/circular-theme-switch#v1.1.1
```

```js
import { createThemeToggle } from '@mlemors/circular-theme-switch';
import '@mlemors/circular-theme-switch/style.css';

const theme = createThemeToggle({ initialTheme: 'dark' });
document.querySelector('#theme-button').addEventListener('click', e => theme.toggle(e));
```

Provide your own button, accessible label, and colors:

```css
:root.dark { color-scheme: dark; --bg: #111313; --fg: #f2f2e9; }
:root.light { color-scheme: light; --bg: #f5f4ed; --fg: #22291d; }
body { background: var(--bg); color: var(--fg); }
```

Or copy `src/index.js` and `src/style.css` into your project. No build step is required.

## Vue

Use the low-level API with your existing reactive state. Wait for Vue's DOM update inside the snapshot callback:

```vue
<script setup>
import { ref, nextTick } from 'vue';
import { revealTheme } from '@mlemors/circular-theme-switch';
import '@mlemors/circular-theme-switch/style.css';
const dark = ref(true);
async function toggle(event) {
  await revealTheme(async () => {
    dark.value = !dark.value;
    document.documentElement.classList.toggle('dark', dark.value);
    document.documentElement.classList.toggle('light', !dark.value);
    await nextTick();
  }, { event });
}
</script>
<template><button @click="toggle" aria-label="Farbschema wechseln">◐</button></template>
```

Initialize the root theme in your application's existing theme setup.

## React

Commit React state before the browser takes its new snapshot:

```jsx
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { revealTheme } from '@mlemors/circular-theme-switch';
import '@mlemors/circular-theme-switch/style.css';

export function ThemeButton() {
  const [dark, setDark] = useState(true);
  function toggle(event) {
    // React currentTarget is only available during the event handler.
    const origin = { detail: event.detail, clientX: event.clientX,
      clientY: event.clientY, currentTarget: event.currentTarget };
    return revealTheme(() => {
      flushSync(() => setDark(!dark));
      document.documentElement.classList.toggle('dark', !dark);
      document.documentElement.classList.toggle('light', dark);
    }, { event: origin });
  }
  return <button onClick={toggle} aria-label="Farbschema wechseln">{dark ? '☾' : '☀'}</button>;
}
```

Initialize the root theme in your application's existing theme setup. For TypeScript, pass the native MouseEvent with a captured origin using your own button wrapper, or use `createThemeToggle` for a DOM-controlled theme.

## API

- `revealTheme(apply, { event?, duration?, easing? })`: update any theme inside `apply`; async callbacks must resolve after the DOM is updated. Returns `true` when applied, `false` when a theme transition is already active. Errors from `apply` propagate.
- `createThemeToggle({ initialTheme?, storageKey?, onChange? })`: initializes root `dark` / `light` classes, restores a saved theme, and returns `{ theme, toggle(event?, options?) }`. Defaults: `dark`, storage key `theme`. Pass `storageKey: null` to disable persistence. Call this only in the browser after the button exists.
- Default animation: `500` milliseconds, `ease-out`. A keyboard click starts at the button center; pointer coordinates including `0` are preserved.

The root snapshot covers the current document viewport, including app panels and DOM modals. It cannot animate native OS title bars, other windows, or other documents. Compatible Tauri/Electron webviews can use the same code; older engines switch immediately. Reduced-motion preferences also switch immediately. Avoid starting other document view transitions while this one is running. Keep `apply` focused on DOM updates and give the page an opaque background. Do not assign separate `view-transition-name` values to elements you want inside the single circular root reveal.

## How it works

1. Capture the old document with `document.startViewTransition`.
2. Apply the new theme and capture the new document.
3. Put the new snapshot above the old one, initially clipped to a zero-radius circle.
4. Animate that circle to the farthest viewport corner using the Web Animations API.
5. Remove the temporary styles when the transition finishes.

The snapshot group duration is explicitly synchronized with the reveal duration (the browser default is only 250 ms). This prevents the parent animation ending halfway through the default 500 ms reveal. See [CHANGELOG.md](CHANGELOG.md) for the end-of-animation freeze investigation.

The initial CSS clip prevents a full-frame flash before the animation attaches. CSS is scoped to the active ripple so other transitions keep their default behavior.

## License

MIT. See [LICENSE](LICENSE).
