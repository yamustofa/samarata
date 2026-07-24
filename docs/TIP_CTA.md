# Voluntary Tip CTA

The optional results-page tip CTA links to `https://saweria.co/yamustofa`. It appears only after a successful calculation and remains visually secondary to receipt download, copy, and share actions.

## Configuration

- Rollout flag: `tipCta` in `src/lib/feature-flags.ts`.
- Destination: `tipDestinationUrl` in `src/lib/tip-config.ts`.
- Allowed destination host: `saweria.co` over HTTPS.
- Indonesian and English copy: the locale dictionaries in `src/routes/index.tsx`.

The destination validator fails closed for invalid URLs, HTTP, credentials, lookalike hosts, query parameters, fragments, and an empty profile path. Do not add receipt content, participant data, monetary values, or analytics identifiers to the URL.

## Measurement

A link activation is only an outbound click, not a confirmed tip. No analytics event is emitted until Phase 2 provides the approved privacy-safe analytics boundary. Confirmed support can be reviewed in the provider dashboard; never infer a payment from client navigation.
