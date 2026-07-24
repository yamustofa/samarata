# Primary Mobile Flow Accessibility Audit

Last reviewed: 2026-07-24  
Scope: landing → calculator setup → participant entry → results → receipt actions

## Baseline

- The document declares its active Indonesian or English language.
- Form controls use visible labels; validation messages are connected with `aria-describedby` and invalid fields use `aria-invalid`.
- Touch targets for primary controls, disclosure controls, destructive participant actions, and footer links are at least 44px in both dimensions where applicable.
- The workflow exposes a two-step progress indicator with an accessible name and current value.
- Receipt success messages use a polite status region. Failures use an alert region with user-safe recovery copy.
- The “How it works” dialog has a name, description, close control, Escape handling, scroll locking, initial focus, and focus return.
- Setup and results headings receive focus after navigation so keyboard and screen-reader users are placed at the new content.
- Motion respects the user's reduced-motion preference through the application motion provider.
- Icons that do not add meaning are hidden from assistive technology.

## Automated regression coverage

`src/routes/-index.test.tsx` covers the no-login setup → participant → results flow using accessible roles and labels. It also checks focus placement and the safe clipboard failure state. These tests intentionally query the UI the way assistive technology does instead of using implementation-only selectors.

A headless Chrome 150 audit at a 320×800 mobile viewport covered landing, setup, and calculated results with a 200% page-scale pass. It found:

- no document-level horizontal overflow at normal scale;
- Indonesian document language and named headings, controls, and form fields in the browser accessibility tree;
- focus on the setup and results headings after each animated transition;
- no primary-flow interactive target below 44px after remediation;
- a 160px visual viewport at 200% page scale, as expected, while document layout remains 320px without document-level overflow.

The TanStack Devtools launcher appears in development accessibility output and screenshots but is removed from production builds.

## Optional real-device QA

Samarata is a web application, so the automated browser audit above is the Phase 0 accessibility gate. The following checks are optional release QA when representative devices are available; they do not block the roadmap:

- At a 320px viewport and 200% zoom, finish a two-participant calculation without unintended document-level horizontal scrolling or obscured controls.
- Navigate the full flow using only Tab, Shift+Tab, Enter, Space, and Escape.
- Verify the dialog focus order and focus return with VoiceOver on Safari/iOS or TalkBack on Chrome/Android.
- Check light and dark themes with a contrast analyzer, including muted receipt metadata and destructive alerts.
- Trigger download, copy, and share success, cancellation, unavailable-API, and permission-denied paths on a physical mobile device.

## Known limitation

The dialog currently provides initial focus, Escape handling, and focus return but does not yet trap Tab focus. Add a tested focus trap if the dialog gains interactive controls beyond its close and primary action buttons.
