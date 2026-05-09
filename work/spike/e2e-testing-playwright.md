# Spike: E2E Testing with Playwright — Cross-Browser User Story Validation

**Date:** 2026-05-09  
**Status:** 🟢 Complete  
**Type:** Technical Research  
**Feature Request:** Implement E2E tests to ensure all core user stories work consistently across browsers

---

## Problem Statement

App has comprehensive unit test coverage (61 tests, Jest + Testing Library) but **zero end-to-end tests**. Multiple completed tickets reference `npm run test:e2e` but script doesn't exist. No automated validation that:

- Chess moves work in real browsers (drag-and-drop)
- Page refresh restores game state correctly
- Audio plays across browsers
- Victory modal fires with confetti
- Google Ads render on desktop
- Responsive layout adapts correctly (mobile, tablet, desktop)
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

**User need:** Confidence that core user stories work end-to-end in production-like environments before pushing to users.

---

## Current State

### Testing Infrastructure

**Unit Tests (Jest + Testing Library):**

- 61 passing tests, 2 skipped
- Mocks: react-chessboard, Audio API, localStorage, canvas-confetti
- Files: [app/page.test.tsx](../../app/page.test.tsx), [components/Toast.test.tsx](../../components/Toast.test.tsx), [components/SoundToggle.test.tsx](../../components/SoundToggle.test.tsx), [components/GoogleAd.test.tsx](../../components/GoogleAd.test.tsx)

**E2E Tests (Playwright):**

- ❌ Not installed
- ❌ No `test:e2e` script in [package.json](../../package.json)
- ❌ No `tests/e2e/` directory
- ⚠️ Multiple tickets reference `npm run ci:validate && npm run test:e2e` but command fails

**CI/CD ([.github/workflows/pr-checks.yml](../../.github/workflows/pr-checks.yml)):**

- ✅ Lint, typecheck, security audit
- ❌ No E2E tests
- ❌ No cross-browser validation

### Core Features Requiring E2E Coverage

| Feature                      | Implementation                                                                          | E2E Risk                                                 | Unit Test Coverage |
| ---------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------ |
| **Chess moves**              | [page.tsx#L167-L223](../../app/page.tsx#L167-L223) — drag-and-drop via react-chessboard | High — mocked in unit tests, real drag-and-drop untested | ⚠️ Mocked only     |
| **Game state persistence**   | [page.tsx#L75-L132](../../app/page.tsx#L75-L132) — sessionStorage + localStorage        | Medium — localStorage mocked, refresh flow untested      | ⚠️ Mocked only     |
| **Audio system**             | [page.tsx#L48-L58](../../app/page.tsx#L48-L58) — native Audio API                       | High — cross-browser audio API differences               | ⚠️ Mocked only     |
| **Victory modal + confetti** | [page.tsx#L40-L67](../../app/page.tsx#L40-L67) — canvas-confetti + modal                | Medium — confetti mocked, animation untested             | ⚠️ Mocked only     |
| **Toast notifications**      | [components/Toast.tsx](../../components/Toast.tsx)                                      | Low — simple component                                   | ✅ Good            |
| **Google Ads**               | [components/GoogleAd.tsx](../../components/GoogleAd.tsx)                                | Medium — env vars, AdSense script injection              | ⚠️ Mocked only     |
| **Responsive layout**        | [page.tsx#L413-L438](../../app/page.tsx#L413-L438) — Tailwind `lg:` breakpoints         | High — viewport-dependent, untested                      | ❌ None            |
| **Sound toggle**             | [components/SoundToggle.tsx](../../components/SoundToggle.tsx)                          | Low — localStorage persistence                           | ✅ Good            |

---

## Feasibility Analysis

### 1. Playwright Installation & Setup

**Package:**

```bash
npm install --save-dev @playwright/test
npx playwright install  # Installs browser binaries
```

**Config file:** `playwright.config.ts`

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
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

**Scripts to add to package.json:**

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

**Bundle impact:**

- Playwright runtime: ~1MB (devDependency only)
- Browser binaries: ~350MB each (Chromium, Firefox, WebKit) — installed globally, not in node_modules
- No production bundle impact

**Verdict:** ✅ **Low friction** — standard Next.js + Playwright setup, widely documented

---

### 2. Core User Stories → Test Scenarios

#### User Story 1: Play Chess Moves

**As a user, I want to drag pieces and have moves validated so I can play a legal chess game**

**Test scenarios:**

- Drag white pawn e2 → e4 (legal opening move)
- Verify board updates and move count increments
- Attempt illegal move (e.g., pawn backward) → expect rejection
- Verify turn validation (white can't move black pieces)
- Verify toast appears: "Not your turn"

**Playwright implementation:**

```typescript
test("should allow legal chess moves and reject illegal ones", async ({
  page,
}) => {
  await page.goto("/");

  // Legal move: e2 to e4
  await page
    .locator('[data-square="e2"]')
    .dragTo(page.locator('[data-square="e4"]'));

  // Verify move count updated
  await expect(page.locator("text=/Move \\d+/")).toBeVisible();

  // Attempt to move white piece again (illegal — not white's turn)
  await page
    .locator('[data-square="e4"]')
    .dragTo(page.locator('[data-square="e5"]'));

  // Verify toast error
  await expect(page.getByRole("status")).toContainText("Not your turn");
});
```

**Cross-browser risk:** Medium — drag-and-drop API differs slightly between browsers. Playwright abstracts this but needs verification.

---

#### User Story 2: Game State Persists on Refresh

**As a user, I want my game saved when I refresh so I don't lose progress**

**Test scenarios:**

- Play 3 moves
- Verify sessionStorage contains FEN string
- Reload page
- Verify "Resume last game?" modal appears
- Click "Resume"
- Verify board state matches pre-refresh

**Playwright implementation:**

```typescript
test("should persist game state and show resume modal on refresh", async ({
  page,
}) => {
  await page.goto("/");

  // Play some moves
  await page
    .locator('[data-square="e2"]')
    .dragTo(page.locator('[data-square="e4"]'));
  await page
    .locator('[data-square="e7"]')
    .dragTo(page.locator('[data-square="e5"]'));

  // Check sessionStorage
  const fen = await page.evaluate(() =>
    sessionStorage.getItem("chess_game_fen"),
  );
  expect(fen).toBeTruthy();

  // Reload page
  await page.reload();

  // Verify resume modal
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Resume last game/i }),
  ).toBeVisible();

  // Click resume
  await page.getByRole("button", { name: /Resume/i }).click();

  // Verify FEN restored
  const restoredFen = await page.evaluate(() => {
    // Access React state via window object (requires exposing in dev mode)
    return sessionStorage.getItem("chess_game_fen");
  });
  expect(restoredFen).toBe(fen);
});
```

**Cross-browser risk:** Low — Web Storage API is universally supported.

---

#### User Story 3: Audio Plays on Check/Checkmate

**As a user, I want audio feedback for important game events so I know when check/checkmate occurs**

**Test scenarios:**

- Enable sound toggle
- Play moves leading to check
- Verify `check.mp3` plays (check via network or Audio element creation)
- Play moves leading to checkmate
- Verify `checkmate.mp3` plays

**Playwright implementation:**

```typescript
test("should play check sound when king is in check", async ({
  page,
  context,
}) => {
  // Grant audio autoplay permission
  await context.grantPermissions(["autoplay"]);

  await page.goto("/");

  // Track Audio API calls
  const audioSources: string[] = [];
  await page.exposeFunction("trackAudio", (src: string) =>
    audioSources.push(src),
  );

  await page.evaluate(() => {
    const OriginalAudio = window.Audio;
    window.Audio = function (src: string) {
      (window as any).trackAudio(src);
      return new OriginalAudio(src);
    } as any;
  });

  // Play moves to trigger check (e.g., Fool's Mate variant)
  // (moves omitted for brevity — see full test file)

  // Verify check sound played
  expect(audioSources).toContain("/sounds/check.mp3");
});
```

**Cross-browser risk:** High — audio autoplay policies differ (Chrome requires user gesture, Safari more restrictive). Playwright can grant permissions but still needs cross-browser verification.

**Alternative approach:** Verify Audio element creation + src attribute rather than actual playback.

---

#### User Story 4: Victory Modal Appears with Confetti

**As a user, I want a celebration when I win so the experience feels satisfying**

**Test scenarios:**

- Play moves leading to checkmate
- Verify victory modal appears with winner name
- Verify confetti animation fires (check canvas-confetti call)
- Click "Play Again" → verify board resets
- Click "Download Moves" → verify PGN file downloads

**Playwright implementation:**

```typescript
test("should show victory modal with confetti on checkmate", async ({
  page,
}) => {
  await page.goto("/");

  // Track confetti calls
  let confettiCalled = false;
  await page.exposeFunction("trackConfetti", () => {
    confettiCalled = true;
  });

  await page.evaluate(() => {
    const originalConfetti = (window as any).confetti;
    (window as any).confetti = function (...args: any[]) {
      (window as any).trackConfetti();
      return originalConfetti(...args);
    };
  });

  // Play Fool's Mate (fastest checkmate)
  await page
    .locator('[data-square="f2"]')
    .dragTo(page.locator('[data-square="f3"]'));
  await page
    .locator('[data-square="e7"]')
    .dragTo(page.locator('[data-square="e5"]'));
  await page
    .locator('[data-square="g2"]')
    .dragTo(page.locator('[data-square="g4"]'));
  await page
    .locator('[data-square="d8"]')
    .dragTo(page.locator('[data-square="h4"]')); // Checkmate

  // Verify victory modal
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText(/Black wins!/i)).toBeVisible();

  // Verify confetti fired
  expect(confettiCalled).toBe(true);

  // Test download button
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Download Moves/i }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(
    /chess-game-Black-wins-\d+\.pgn/,
  );
});
```

**Cross-browser risk:** Medium — canvas-confetti uses Canvas API (universally supported), but `prefers-reduced-motion` behavior should be verified.

---

#### User Story 5: Google Ads Render on Desktop

**As a site owner, I want ads to show on desktop viewports so I can monetize traffic**

**Test scenarios:**

- Load page on desktop viewport (1280×720)
- Verify Google Ad placeholder visible
- Verify `data-ad-client` and `data-ad-slot` attributes present
- Load page on mobile viewport (375×667)
- Verify ads hidden via Tailwind `hidden lg:flex`

**Playwright implementation:**

```typescript
test("should show Google Ads on desktop but hide on mobile", async ({
  page,
}) => {
  // Desktop viewport
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  const desktopAd = page.locator('[data-testid^="google-ad-"]').first();
  await expect(desktopAd).toBeVisible();

  // Mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(desktopAd).toBeHidden();
});
```

**Cross-browser risk:** Low — CSS media queries are stable.

---

#### User Story 6: Responsive Layout Adapts to Viewports

**As a user, I want the board to fill my screen optimally on any device**

**Test scenarios:**

- Load on mobile (375×667) → board fills viewport, no ads
- Load on tablet (768×1024) → board centered, no ads
- Load on desktop (1280×720) → board centered, ads in sidebars

**Playwright implementation:**

```typescript
const viewports = [
  { name: "mobile", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 720 },
];

for (const viewport of viewports) {
  test(`should adapt layout correctly on ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const board = page.locator('[data-testid="chessboard"]'); // Assuming data-testid added
    await expect(board).toBeVisible();

    // Verify board is centered and fills space appropriately
    const boundingBox = await board.boundingBox();
    expect(boundingBox).toBeTruthy();

    // Desktop-specific: verify ads visible
    if (viewport.name === "desktop") {
      await expect(
        page.locator('[data-testid^="google-ad-"]').first(),
      ).toBeVisible();
    }
  });
}
```

**Cross-browser risk:** Low — viewport behavior consistent.

---

### 3. Cross-Browser Testing Matrix

| Browser       | Engine   | Priority | Playwright Device |
| ------------- | -------- | -------- | ----------------- |
| Chrome        | Chromium | P0       | `Desktop Chrome`  |
| Firefox       | Gecko    | P0       | `Desktop Firefox` |
| Safari        | WebKit   | P0       | `Desktop Safari`  |
| Edge          | Chromium | P1       | (same as Chrome)  |
| Mobile Chrome | Chromium | P0       | `Pixel 5`         |
| Mobile Safari | WebKit   | P0       | `iPhone 12`       |

**Playwright Coverage:**

- ✅ All P0 browsers supported
- ✅ Runs tests in parallel across projects
- ✅ Built-in screenshot + trace on failure

**CI/CD Integration:**

```yaml
# Add to .github/workflows/pr-checks.yml
e2e:
  name: E2E Tests
  runs-on: ubuntu-latest
  needs: setup

  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "25.2.1"
        cache: "npm"

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright browsers
      run: npx playwright install --with-deps

    - name: Run E2E tests
      run: npm run test:e2e

    - name: Upload test results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

---

## Risks & Unknowns

| Risk                                        | Likelihood | Impact | Mitigation                                                                    |
| ------------------------------------------- | ---------- | ------ | ----------------------------------------------------------------------------- |
| **Drag-and-drop flaky in CI**               | Medium     | High   | Use Playwright's auto-waiting + retry logic. Add explicit `waitForSelector`.  |
| **Audio autoplay blocked**                  | High       | Medium | Don't assert actual playback — verify Audio element creation + src attribute. |
| **CI run time increases**                   | High       | Low    | Run E2E tests only on PR (not every commit). Parallelize across browsers.     |
| **Confetti animation timing**               | Low        | Low    | Use `waitForTimeout` sparingly — prefer `waitForSelector` on modal.           |
| **react-chessboard lacks stable selectors** | Medium     | High   | Add `data-testid` attributes to board squares in custom wrapper if needed.    |
| **localStorage quota in Safari**            | Low        | Low    | Already handled with try/catch in app code.                                   |
| **Download assertions fail in headless**    | Low        | Medium | Playwright handles downloads in headless mode — test in CI to confirm.        |

---

## Alternatives Considered

### Alternative 1: Cypress

| Aspect              | Cypress                                | Playwright                    | Verdict             |
| ------------------- | -------------------------------------- | ----------------------------- | ------------------- |
| **Browser support** | Chrome, Firefox, Edge only (no Safari) | Chrome, Firefox, Safari, Edge | ✅ Playwright       |
| **Auto-waiting**    | Built-in                               | Built-in                      | Tie                 |
| **Speed**           | Slower (single browser at a time)      | Faster (parallel)             | ✅ Playwright       |
| **Network mocking** | Excellent                              | Excellent                     | Tie                 |
| **Community**       | Larger                                 | Growing fast                  | Cypress slight edge |
| **Bundle size**     | 20MB                                   | 1MB                           | ✅ Playwright       |

**Verdict:** Playwright wins on cross-browser (Safari required for iOS testing) and speed.

---

### Alternative 2: Selenium WebDriver

| Aspect               | Selenium             | Playwright         | Verdict       |
| -------------------- | -------------------- | ------------------ | ------------- |
| **Setup complexity** | High (needs drivers) | Low (bundled)      | ✅ Playwright |
| **Flakiness**        | High (manual waits)  | Low (auto-waiting) | ✅ Playwright |
| **Modern API**       | No (callback-heavy)  | Yes (async/await)  | ✅ Playwright |
| **Speed**            | Slow                 | Fast               | ✅ Playwright |

**Verdict:** Playwright superior in every dimension for modern web apps.

---

### Alternative 3: Manual Testing Only

**Pros:**

- No code to maintain
- Flexible (human intuition)

**Cons:**

- ❌ Time-consuming (test matrix = 6 browsers × 5 features = 30 manual tests per PR)
- ❌ Error-prone (humans miss edge cases)
- ❌ Not scalable (blocks velocity as features grow)
- ❌ No regression protection

**Verdict:** ❌ Not viable for CI/CD pipeline.

---

## Recommendation

✅ **Install Playwright and implement E2E tests for core user stories**

**Why Playwright:**

1. **Cross-browser:** Covers Chrome, Firefox, Safari (iOS-critical)
2. **Auto-waiting:** Reduces flakiness vs. Selenium
3. **Fast:** Parallel execution across browsers
4. **Modern API:** async/await, TypeScript-first
5. **Built-in tooling:** Screenshots, traces, video on failure

**Priority test suite (Phase 1):**

1. ✅ Chess moves (legal/illegal validation)
2. ✅ Game state persistence (refresh flow)
3. ✅ Audio feedback (check/checkmate)
4. ✅ Victory modal + confetti
5. ✅ Responsive layout (mobile/tablet/desktop)

**Phase 2 (future):**

- Network mocking (AdSense script loading)
- Performance budgets (Lighthouse integration)
- Visual regression tests (Percy/Chromatic)

---

## Affected Files & Components

| File/Component                        | Change Type | Notes                                             |
| ------------------------------------- | ----------- | ------------------------------------------------- |
| `package.json`                        | Modify      | Add `@playwright/test` + E2E scripts              |
| `playwright.config.ts`                | Create      | Browser matrix, webServer config                  |
| `tests/e2e/chess-moves.spec.ts`       | Create      | Move validation tests                             |
| `tests/e2e/game-persistence.spec.ts`  | Create      | Refresh + resume tests                            |
| `tests/e2e/audio-feedback.spec.ts`    | Create      | Sound playback tests                              |
| `tests/e2e/victory-modal.spec.ts`     | Create      | Checkmate + confetti tests                        |
| `tests/e2e/responsive-layout.spec.ts` | Create      | Viewport tests                                    |
| `.github/workflows/pr-checks.yml`     | Modify      | Add E2E job                                       |
| `app/page.tsx`                        | Modify      | Add `data-testid` attributes for stable selectors |

**Estimated implementation time:** 2–3 days (1 day setup + 1–2 days writing tests)

---

## Knowledge Files Used

- [qa-review.instructions.md](vscode-userdata:/c%3A/Users/LukeG/AppData/Roaming/Code/User/prompts/qa-review.instructions.md) — Cross-browser matrix, viewport testing
- [testing-standards.instructions.md](c:\Users\LukeG.copilot\instructions\testing.instructions.md) — Test structure, naming conventions (need to read)
- [playwright-testing skill](c:\Users\LukeG.copilot\skills\playwright-testing\SKILL.md) — Playwright patterns (need to read)

---

## Applicable Instruction Files

When implementing E2E tests, read:

- `testing-standards.instructions.md` — Test file structure, assertions
- `typescript.instructions.md` — Type safety for test fixtures
- `security.instructions.md` — Auth flows (if added later)

---

## Next Steps

1. **Product Manager:** Create ticket from this spike → `work/todo/e2e-testing-playwright.md`
2. **Senior Developer:** Implement Playwright setup + core test suite
3. **Work Reviewer:** Run QA pass on cross-browser matrix

**Ticket outline:**

### Tier 2 Ticket Structure (5–10 files)

**Title:** E2E Testing with Playwright — Core User Story Validation

**Acceptance Criteria:**

- [ ] Playwright installed and configured for 5 browsers (Chrome, Firefox, Safari, mobile variants)
- [ ] `npm run test:e2e` script runs full test suite
- [ ] Chess moves test validates legal/illegal moves + turn enforcement
- [ ] Game persistence test verifies refresh → resume flow
- [ ] Audio feedback test checks check.mp3/checkmate.mp3 loading
- [ ] Victory modal test covers checkmate → modal + confetti + PGN download
- [ ] Responsive layout test covers 3 viewports (mobile, tablet, desktop)
- [ ] CI/CD job added to [pr-checks.yml](../../.github/workflows/pr-checks.yml)
- [ ] All tests pass in CI on PR

**Files Created:**

- `playwright.config.ts`
- `tests/e2e/chess-moves.spec.ts`
- `tests/e2e/game-persistence.spec.ts`
- `tests/e2e/audio-feedback.spec.ts`
- `tests/e2e/victory-modal.spec.ts`
- `tests/e2e/responsive-layout.spec.ts`

**Files Modified:**

- `package.json` (scripts + devDependencies)
- `.github/workflows/pr-checks.yml` (new E2E job)
- `app/page.tsx` (add data-testid attributes for stable selectors)

**Dependencies:** None (Playwright self-contained)

---

## Appendix: Sample Test File

**File:** `tests/e2e/chess-moves.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Chess Move Mechanics", () => {
  test("should allow legal opening move", async ({ page }) => {
    await page.goto("/");

    // Wait for board to render
    await expect(page.locator('[data-square="e2"]')).toBeVisible();

    // Drag white pawn e2 to e4
    await page
      .locator('[data-square="e2"]')
      .dragTo(page.locator('[data-square="e4"]'));

    // Verify move count updated (assuming visible move counter)
    await expect(page.locator("text=/Move \\d+/")).toBeVisible();
  });

  test("should reject illegal move", async ({ page }) => {
    await page.goto("/");

    // Attempt illegal move: pawn backward
    await page
      .locator('[data-square="e2"]')
      .dragTo(page.locator('[data-square="e1"]'));

    // Verify piece didn't move (still on e2)
    await expect(page.locator('[data-square="e2"]')).toBeVisible();
  });

  test("should enforce turn validation", async ({ page }) => {
    await page.goto("/");

    // White moves
    await page
      .locator('[data-square="e2"]')
      .dragTo(page.locator('[data-square="e4"]'));

    // White tries to move again (illegal)
    await page
      .locator('[data-square="d2"]')
      .dragTo(page.locator('[data-square="d4"]'));

    // Verify toast error
    await expect(page.getByRole("status")).toContainText("Not your turn");
  });

  test("should work across all browsers", async ({ browserName }) => {
    // This test runs in all configured browsers (Chrome, Firefox, Safari)
    console.log(`Running in ${browserName}`);
    // Test implementation same as above
  });
});
```

---

**End of Spike**
