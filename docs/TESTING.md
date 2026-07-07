# Testing Guide

The project uses **Vitest**. Tests live in `tests/` and run in a Node
environment with the `@/` path alias resolved (see `vitest.config.ts`).

```bash
npm test              # run everything once
npm run test:watch    # watch mode
npm run test:coverage # V8 coverage for src/lib
```

## Layout

```
tests/
├── unit/
│   ├── pairing.test.ts      # matching priorities, capacity, tie-breaks
│   ├── validators.test.ts   # Zod schemas (registration, meetings, …)
│   ├── csv.test.ts          # RFC 4180 encode/parse round-trips
│   ├── sanitize.test.ts     # input sanitization + HTML escaping
│   ├── rate-limit.test.ts   # sliding-window limiter
│   └── utils.test.ts        # WhatsApp link builder, initials
└── integration/
    ├── register-api.test.ts # POST /api/register with mocked Prisma
    └── pairing-flow.test.ts # attemptPairing() end-to-end with mocks
```

## Philosophy

- **Unit tests** target the pure logic that the programme rules depend on
  — especially `rankMentors`, which encodes the matching priority
  (department → interests → availability → random) and the capacity
  guarantee.
- **Integration tests** exercise API route handlers and the pairing
  service against a mocked `@/lib/db`, asserting status codes, side
  effects (waitlisting, notifications) and email dispatch — no database
  required, so they run in CI without secrets.

## Writing new tests

1. Import route handlers directly (`import { POST } from "@/app/api/..."`)
   and call them with a standard `Request`.
2. Mock modules with `vi.mock("@/lib/db", …)` **before** importing the
   module under test.
3. Prefer deterministic inputs — `rankMentors` accepts an injectable
   `random` function for tie-break tests.

## Manual test checklist

- Register mentor & mentee → both land on the pending screen.
- Login before approval is refused; after approval it succeeds.
- Approving a mentee auto-pairs (or waitlists + notifies admins).
- Approving a new mentor drains the waitlist.
- Mentor logs a meeting → appears in admin meeting logs.
- Messaging: send, unread badge, mark unread, email & WhatsApp buttons.
- Semester: close registration → public registration is blocked.
- CSV export downloads; CSV import creates approved users.
