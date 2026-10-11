# React


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


[Back to README](../README.md)
