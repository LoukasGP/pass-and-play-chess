# Ticket 01: Playwright Setup & Configuration

**Parent:** [Epic: E2E Testing with Playwright](./00-epic-overview.md)  
**Date:** 2026-05-09  
**Status:** ✅ Done  
**Dependencies:** None

---

## 📋 Objective

Install and configure Playwright for cross-browser E2E testing. Establish browser matrix (Chrome, Firefox, Safari + mobile variants), configure webServer to auto-start Next.js dev server, and add npm scripts for running tests locally and in CI.

**Success:** `npm run test:e2e` executes placeholder test across 5 browser projects and passes.

## 🎯 What This Ticket Delivers

1. Playwright installed as devDependency in `package.json`
2. Configuration file `playwright.config.ts` with 5 browser projects
3. npm scripts for E2E testing (`test:e2e`, `test:e2e:ui`, `test:e2e:debug`, `test:e2e:headed`)
4. Updated `ci:validate` script to include E2E tests
5. Directory `tests/e2e/` with placeholder test verifying setup

## 📦 Prerequisites

- [x] Next.js dev server runs on port 3000 — [package.json](../../package.json#L5)
- [x] Jest unit tests already use `tests/` convention — consistent structure
- [x] TypeScript configured — [tsconfig.json](../../tsconfig.json)

## 🔧 Interface Design

No new TypeScript interfaces — Playwright provides `@playwright/test` types for test fixtures and assertions.

## 🔨 Implementation Steps

### Step 1: Install Playwright

```bash
npm install --save-dev @playwright/test
npx playwright install --with-deps
```

**Package:** `@playwright/test@^1.51.1`  
**Browser binaries:** Installed to global cache (~1GB total) — not in `node_modules`

### Step 2: Create `playwright.config.ts`

Create config file at repo root with 5 browser projects (3 desktop, 2 mobile):

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 12"] } },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

**Key settings:**

- `fullyParallel: true` — tests run concurrently across browsers
- `retries: 2` in CI — handles flaky drag-and-drop
- `webServer.reuseExistingServer` — prevents port conflicts in local dev

### Step 3: Update `package.json` Scripts

Add E2E scripts to `scripts` section:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "ci:validate": "npm run test && npm run lint && npm run format && npm run tsc && npm run build && npm run test:e2e"
  }
}
```

**Script purposes:**

- `test:e2e` — headless run (CI mode)
- `test:e2e:ui` — interactive UI for debugging
- `test:e2e:debug` — step-through debugger
- `test:e2e:headed` — visible browser windows
- `ci:validate` — full validation including E2E

### Step 4: Create Placeholder Test

Create `tests/e2e/setup-verification.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Playwright Setup Verification", () => {
  test("should load homepage and render chessboard", async ({ page }) => {
    await page.goto("/");

    // Verify page title
    await expect(page).toHaveTitle(/Chess Offline/);

    // Verify chessboard container exists
    const boardContainer = page.locator("main");
    await expect(boardContainer).toBeVisible();
  });

  test("should work across all browser projects", async ({
    page,
    browserName,
  }) => {
    await page.goto("/");
    console.log(`✓ Test passed in ${browserName}`);
  });
});
```

**Purpose:** Validates Playwright can start Next.js dev server, load homepage, and run across all 5 browser projects.

## 📁 Affected Files

| Action | Path                                   | Role                                               |
| ------ | -------------------------------------- | -------------------------------------------------- |
| Modify | `package.json`                         | Add `@playwright/test` devDependency + E2E scripts |
| Create | `playwright.config.ts`                 | Browser matrix, webServer config, test settings    |
| Create | `tests/e2e/setup-verification.spec.ts` | Placeholder test verifying setup works             |

## ✅ Acceptance Criteria

- [x] `@playwright/test` installed in `devDependencies`
- [x] `playwright.config.ts` exists at repo root with 5 browser projects
- [x] `tests/e2e/` directory created
- [x] `npm run test:e2e` executes placeholder test across all browsers
- [x] All 5 browser projects pass (chromium, firefox, webkit, mobile-chrome, mobile-safari)
- [x] `npm run test:e2e:ui` launches Playwright UI
- [x] `npm run ci:validate` includes E2E tests and passes
- [x] No console errors during test execution
- [x] [NEGATIVE] E2E tests do NOT run during `npm test` (Jest only)

## 🚫 Out of Scope

- Writing actual feature tests (covered in tickets #02–#05)
- CI integration in GitHub Actions (covered in ticket #06)
- Adding `data-testid` attributes to app code (covered in ticket #06)

## 🧪 Test Cases

- [x] Test: Run `npm run test:e2e` → 2 tests pass across 5 browsers (10 total test runs)
- [x] Test: Run `npm run test:e2e -- --project=chromium` → tests run only in Chrome
- [x] Test: Run `npm run test:e2e:ui` → Playwright UI opens with test list
- [x] Test: Run `npm test` → Playwright tests NOT executed (Jest only)

## ✅ Verification

```bash
npm run test:e2e          # Should pass: 10/10 tests (2 tests × 5 browsers)
npm run ci:validate       # Full validation including E2E
```

**Expected output:**

```
Running 10 tests using 5 workers
  10 passed (Xs)
```
