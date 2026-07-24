# Primary Mobile Flow Accessibility Audit

Last reviewed: 2026-07-24  
Scope: landing → calculator setup → participant entry → results → receipt actions

## Baseline

- The document declares its active Indonesian or English language.
- Form controls use visible labels; validation messages are connected with `aria-describedby` and invalid fields use `aria-invalid`.
- Touch targets for primary controls are at least 44px high.
- The workflow exposes a two-step progress indicator with an accessible name and current value.
- Receipt success messages use a polite status region. Failures use an alert region with user-safe recovery copy.
- The “How it works” dialog has a name, description, close control, Escape handling, scroll locking, initial focus, and focus return.
- Setup and results headings receive focus after navigation so keyboard and screen-reader users are placed at the new content.
- Motion respects the user's reduced-motion preference through the application motion provider.
- Icons that do not add meaning are hidden from assistive technology.

## Automated regression coverage

`src/routes/index.test.tsx` covers the no-login setup → participant → results flow using accessible roles and labels. It also checks focus placement and the safe clipboard failure state. These tests intentionally query the UI the way assistive technology does instead of using implementation-only selectors.

## Manual checks before a production release

- At a 320px viewport and 200% zoom, finish a two-participant calculation without horizontal scrolling or obscured controls.
- Navigate the full flow using only Tab, Shift+Tab, Enter, Space, and Escape.
- Verify the dialog focus order and focus return with VoiceOver on Safari/iOS or TalkBack on Chrome/Android.
- Check light and dark themes with a contrast analyzer, including muted receipt metadata and destructive alerts.
- Trigger download, copy, and share success, cancellation, unavailable-API, and permission-denied paths on a physical mobile device.

## Known limitation

The dialog currently provides initial focus, Escape handling, and focus return but does not yet trap Tab focus. Add a tested focus trap if the dialog gains interactive controls beyond its close and primary action buttons.
