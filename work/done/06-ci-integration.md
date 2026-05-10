# Ticket 06: CI Integration & Stable Selectors

**Parent:** [Epic: E2E Testing with Playwright](./00-epic-overview.md)  
**Date:** 2026-05-09  
**Status:** ✅ Done  
**Dependencies:** #02, #03, #04, #05 (all test files must exist and pass locally)

---

## 📋 Objective

Integrate E2E tests into GitHub Actions PR workflow so tests run automatically on every pull request. Add stable `data-testid` selectors to `app/page.tsx` where react-chessboard's `[data-square]` attributes are insufficient (e.g., chessboard container, Google Ad placeholders). Configure CI to install Playwright browsers, run tests across all 5 browser projects, and upload test reports on failure.

**Success:** GitHub Actions runs E2E tests on every PR, all tests pass across 5 browsers, and test reports are uploaded as artifacts when tests fail.

## 🎯 What This Ticket Delivers

1. New CI job `e2e` in `.github/workflows/pr-checks.yml`
2. Playwright browser installation step in CI
3. E2E test execution across all browser projects
4. Test report upload on failure (HTML report as artifact)
5. `data-testid` attributes added to `app/page.tsx` for stable selectors:
   - `data-testid="chessboard"` on board container
   - `data-testid="google-ad-{slot}"` on GoogleAd components (if not already present)

## 📦 Prerequisites

- [x] All E2E test files written and passing locally — Tickets #02, #03, #04, #05
- [x] Playwright installed and configured — Ticket #01
- [x] GitHub Actions workflow exists — [.github/workflows/pr-checks.yml](../../.github/workflows/pr-checks.yml)
- [x] `npm run test:e2e` script works locally

## 🔧 Interface Design

No new interfaces — adds `data-testid` string attributes to existing JSX elements.

## 🔨 Implementation Steps

### Step 1: Add `data-testid` to Chessboard Container

Modify `app/page.tsx` to add stable selector for board container:

```tsx
// Find the Chessboard component (around line 310)
<Chessboard
  position={game.fen()}
  onPieceDrop={handleMove}
  customSquareStyles={{
    ...Object.fromEntries(
      lastMove
        ? [
            [lastMove.from, { backgroundColor: "rgba(255, 255, 0, 0.4)" }],
            [lastMove.to, { backgroundColor: "rgba(255, 255, 0, 0.4)" }],
          ]
        : [],
    ),
  }}
  data-testid="chessboard" // ADD THIS LINE
/>
```

**Note:** `data-testid` may need to be added to parent container if Chessboard doesn't accept custom attributes. Check react-chessboard docs.

Alternative (if Chessboard doesn't accept custom props):

```tsx
<div data-testid="chessboard">
  <Chessboard
    position={game.fen()}
    onPieceDrop={handleMove}
    customSquareStyles={{...}}
  />
</div>
```

### Step 2: Verify GoogleAd Component Has `data-testid`

Check if `components/GoogleAd.tsx` already has `data-testid` attribute. If not, add it:

```tsx
// In components/GoogleAd.tsx
<div
  className="min-h-[600px] w-[160px] bg-gray-200 flex items-center justify-center"
  data-testid={`google-ad-${slot}`} // ADD THIS LINE if not present
>
  {/* Ad content */}
</div>
```

**Verification:** Check existing file to see if already implemented during previous tickets.

### Step 3: Add E2E Job to GitHub Actions

Modify `.github/workflows/pr-checks.yml` to add E2E job after existing jobs:

```yaml
# Add this job to .github/workflows/pr-checks.yml

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
        retention-days: 30
```

**Key steps:**

- `npx playwright install --with-deps` — installs Chromium, Firefox, WebKit + system dependencies
- `npm run test:e2e` — runs all E2E tests across 5 browser projects
- `upload-artifact` with `if: always()` — uploads HTML report even if tests fail
- `retention-days: 30` — keeps reports for 1 month

### Step 4: Configure CI Status Check

Ensure E2E job is required for merge:

1. In GitHub repo settings → Branches → Branch protection rules
2. Add `E2E Tests` to required status checks
3. Enable "Require status checks to pass before merging"

**Note:** This is a manual step in GitHub UI, not code change.

### Step 5: Test CI Execution

After merging changes, verify CI runs correctly:

1. Create a test PR with a trivial change
2. Verify `E2E Tests` job runs in Actions tab
3. Verify all 5 browser projects execute
4. Verify job passes and shows green checkmark

If tests fail, check uploaded `playwright-report` artifact for details.

## 📁 Affected Files

| Action | Path                              | Role                                              |
| ------ | --------------------------------- | ------------------------------------------------- |
| Modify | `app/page.tsx`                    | Add `data-testid="chessboard"` to board container |
| Modify | `components/GoogleAd.tsx`         | Verify `data-testid` exists (or add if missing)   |
| Modify | `.github/workflows/pr-checks.yml` | Add E2E job with Playwright browser installation  |

## ✅ Acceptance Criteria

- [x] E2E job added to `.github/workflows/pr-checks.yml`
- [x] Playwright browser installation step in CI (`npx playwright install --with-deps`)
- [x] E2E tests run across all 5 browser projects in CI
- [x] Test report uploaded as artifact on failure (playwright-report, 30 day retention)
- [x] `data-testid="google-ad-{slot}"` added to GoogleAd component
- [x] `data-testid="chessboard-container"` added to board container (changed from "chessboard" to avoid collision with unit test mock)
- [x] `npm run ci:validate` passes: unit tests (71 pass) + E2E (100 pass) + lint (0 warnings) + tsc + build
- [x] Build job depends on E2E job completion

- [ ] `data-testid="chessboard"` added to board container in `app/page.tsx`
- [ ] `data-testid="google-ad-{slot}"` exists on GoogleAd component
- [ ] E2E job added to `.github/workflows/pr-checks.yml`
- [ ] CI installs Playwright browsers via `npx playwright install --with-deps`
- [ ] CI runs `npm run test:e2e` and executes all tests across 5 browsers
- [ ] Test reports uploaded as artifacts on failure (`playwright-report/`)
- [ ] E2E job blocks PR merge when tests fail
- [ ] All existing tests still pass in CI (lint, typecheck, unit tests, E2E)
- [ ] [NEGATIVE] CI does NOT install browsers on non-E2E jobs (setup, lint, typecheck)

## 🚫 Out of Scope

- Adding `data-testid` to every element (only where needed: board, ads)
- Configuring Playwright sharding (running tests across multiple CI workers) — overkill for 5 test files
- Setting up Playwright Trace Viewer integration — just HTML reports

## 🧪 Test Cases

- [ ] Test: Push commit to PR → E2E job runs in GitHub Actions
- [ ] Test: E2E job installs 3 browser binaries (Chromium, Firefox, WebKit)
- [ ] Test: All 20+ E2E tests pass across 5 browser projects
- [ ] Test: Introduce failing test → CI blocks merge, uploads report artifact
- [ ] Test: Download `playwright-report` artifact → HTML report contains failure screenshots

## ✅ Verification

**Local pre-push check:**

```bash
npm run ci:validate
# Should include E2E tests and pass
```

**CI validation (after merge):**

1. Create test PR
2. Go to Actions tab → PR Checks workflow
3. Verify E2E Tests job runs and passes
4. Check logs for "Running X tests across 5 workers"
5. Confirm green checkmark on PR

**Failure scenario (intentional):**

1. Modify test to fail (e.g., expect wrong text)
2. Push to PR
3. Verify CI fails and blocks merge
4. Download `playwright-report` artifact
5. Open `index.html` → see failure details with screenshots
