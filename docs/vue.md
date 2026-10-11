# Vue


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


[Back to README](../README.md)
