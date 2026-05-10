# Epic: E2E Testing with Playwright

**Date:** 2026-05-09  
**Status:** ✅ Done  
**Spike:** [e2e-testing-playwright.md](../../spike/e2e-testing-playwright.md)

---

## 📋 Overview

Implement end-to-end browser tests using Playwright to validate core user stories across Chrome, Firefox, and Safari. Currently, app has 61 unit tests but zero E2E coverage — critical flows like drag-and-drop moves, game state persistence on refresh, audio playback, and responsive layout are mocked but never tested in real browsers. This epic establishes cross-browser regression protection for 6 core features before pushing to production users.

## 🏗️ Architecture Decisions

| Decision           | Choice                                            | Rationale                                                                                                  |
| ------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **E2E Framework**  | Playwright over Cypress/Selenium                  | Safari support required (iOS-critical), auto-waiting reduces flakiness, parallel execution across browsers |
| **Test Directory** | `tests/e2e/` (separate from `app/`)               | Follows Next.js conventions, keeps E2E isolated from unit tests                                            |
| **Browser Matrix** | Chrome, Firefox, Safari desktop + mobile variants | Covers 3 engines (Chromium, Gecko, WebKit) — P0 browsers per qa-review.instructions.md                     |
| **CI Execution**   | Run E2E on every PR (not every commit)            | Balance coverage vs. CI time — E2E slower than unit tests                                                  |
| **Selectors**      | Add `data-testid` to page.tsx only where needed   | Minimize DOM pollution — use ARIA roles first, fallback to data-testid for react-chessboard squares        |

## 📊 Type Changes

None — Playwright tests use `@playwright/test` types, no changes to app TypeScript interfaces.

## 🗺️ Test Suite Architecture

```
tests/e2e/
├── chess-moves.spec.ts          — Legal/illegal move validation, turn enforcement
├── game-persistence.spec.ts     — sessionStorage → refresh → resume modal flow
├── audio-feedback.spec.ts       — check.mp3/checkmate.mp3 loading (not playback)
├── victory-modal.spec.ts        — Checkmate → modal + confetti + PGN download
└── responsive-layout.spec.ts    — Mobile/tablet/desktop viewport adaptation
```

**Browser execution matrix:**

- Each test runs across 5 browser projects: `chromium`, `firefox`, `webkit`, `mobile-chrome`, `mobile-safari`
- Total: 5 test files × 5 browsers = 25 test runs per PR

## 📦 New Dependencies

| Package            | Purpose                                   | Size                                            |
| ------------------ | ----------------------------------------- | ----------------------------------------------- |
| `@playwright/test` | E2E testing framework, browser automation | ~1MB (devDependency only, no production impact) |

**Browser binaries:** Chromium (~350MB), Firefox (~350MB), WebKit (~350MB) — installed globally via `npx playwright install`, not in `node_modules`.

## 🎫 Ticket Index

| #   | Title                                                          | Category | Dependencies       |
| --- | -------------------------------------------------------------- | -------- | ------------------ |
| 01  | [Playwright Setup & Configuration](./01-playwright-setup.md)   | Testing  | None               |
| 02  | [Chess Moves E2E Tests](./02-chess-moves-tests.md)             | Testing  | #01                |
| 03  | [Game Persistence E2E Tests](./03-game-persistence-tests.md)   | Testing  | #01                |
| 04  | [Audio & Victory Modal E2E Tests](./04-audio-victory-tests.md) | Testing  | #01                |
| 05  | [Responsive Layout E2E Tests](./05-responsive-layout-tests.md) | Testing  | #01                |
| 06  | [CI Integration & Stable Selectors](./06-ci-integration.md)    | Testing  | #02, #03, #04, #05 |

## 🔀 Dependency Graph

**Phase 1: Setup (blocking)**

```
#01 Playwright Setup
```

↓

**Phase 2: Test Implementation (parallel — all depend on #01)**

```
#02 Chess Moves Tests
#03 Game Persistence Tests
#04 Audio & Victory Tests
#05 Responsive Layout Tests
```

↓

**Phase 3: CI Integration (blocking — requires all tests passing locally)**

```
#06 CI Integration
```

## ✅ Verification

```bash
# After all tickets complete:
npm run test:e2e          # All E2E tests pass locally
npm run ci:validate       # Full validation including E2E
```

**CI validation:**

- GitHub Actions runs E2E tests on every PR
- Tests execute across all 5 browser projects
- Failures block merge via required status checks
