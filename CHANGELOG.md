# Changelog

## 1.1.0

- Rename the repository and package to circular-theme-switch.
- Replace the explanatory landing page with a minimal editorial website simulation.
- Add an independently themed embedded music app; its reveal is confined to the app document.
- Remove visible project-origin references and feature copy. Preserve required MIT copyright.

## 1.0.1

- Synchronize `::view-transition-group(root)` with the requested reveal duration instead of relying on the browser's 250 ms default. Previously the group finished halfway through the default 500 ms clip-path animation.
- Remove the temporary duration property on completion and errors.
- Add a regression test for custom duration propagation and cleanup.

### Investigation and verification limits

A supplied 120 fps recording shows a stationary circular boundary for about 225 ms (1.283–1.508 s), followed by an abrupt completed theme. The reverse transition shows a similar pause (2.375–2.583 s). This is a real visible freeze, not simply ease-out deceleration.

The freeze starts around the default group's completion, making mismatched parent/child animation lifetimes a plausible trigger. The recording does not establish a specific browser-engine defect. JavaScript requestAnimationFrame intervals were normal, so they cannot establish smooth compositor output. Browser automation screenshots also did not reliably reproduce the original freeze.

Verified locally: group duration is 0.5 s during the default reveal, transition cleanup occurs at about 519 ms, and all eight tests pass. A before/after recording from the affected Chrome rendering path has not been obtained; resolution of that exact freeze remains unverified.
