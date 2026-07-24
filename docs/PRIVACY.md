# Privacy implementation notes

The canonical user-facing notice and analytics control are available at `/privacy`. This document records the implementation boundary for maintainers.

- Product events pass through `src/routes/api/events.ts` and the runtime validator in `src/features/analytics/validation.ts`.
- Only the closed event schema in `src/features/analytics/events.ts` is accepted.
- Analytics Engine stores low-cardinality categories and a random per-tab session UUID; it never stores raw calculator inputs.
- The browser analytics client is no-op during SSR, after opt-out, when browser storage is unavailable, or when a session UUID cannot be generated.
- Network and provider failures are swallowed so the local-first calculator continues to work.
- Cloudflare Workers Logs is operational monitoring, separate from product analytics. Do not add request-body, participant, receipt, or monetary logging.

Any future addition of advertising identifiers, cross-device IDs, free-form feedback, account data, or a new provider requires a new privacy review and updated user notice before rollout.
