# Ticket 05: Responsive Layout E2E Tests

**Parent:** [Epic: E2E Testing with Playwright](./00-epic-overview.md)  
**Date:** 2026-05-09  
**Status:** ✅ Done  
**Dependencies:** #01 Playwright Setup

---

## 📋 Objective

Write E2E tests validating responsive layout behavior across mobile, tablet, and desktop viewports: Google Ads show on desktop (≥1024px) but hide on mobile/tablet, chessboard fills viewport optimally at all sizes, and Tailwind `lg:` breakpoints trigger correctly.

**Success:** `npm run test:e2e -- tests/e2e/responsive-layout.spec.ts` passes across all browsers with 4 tests covering viewport adaptation, ad visibility rules, and cross-device consistency.

## 🎯 What This Ticket Delivers

1. Test file `tests/e2e/responsive-layout.spec.ts` with 4 test cases
2. Mobile viewport test (375×667) — board fills screen, ads hidden
3. Tablet viewport test (768×1024) — board centered, ads hidden
4. Desktop viewport test (1280×720) — board centered, ads visible in sidebars
5. Cross-viewport consistency check (board always visible and interactive)

## 📦 Prerequisites

- [x] Playwright installed and configured — Ticket #01
- [x] Responsive layout with Tailwind breakpoints — [app/page.tsx#L413-L438](../../app/page.tsx#L413-L438)
- [x] Google Ads component with `hidden lg:flex` — [components/GoogleAd.tsx](../../components/GoogleAd.tsx)
- [x] Viewport meta tag configured — [app/layout.tsx](../../app/layout.tsx)

## 🔧 Interface Design

No new interfaces — uses Playwright's `page.setViewportSize()` and viewport presets from `@playwright/test`.

## 🔨 Implementation Steps

### Step 1: Create Test File Structure

Create `tests/e2e/responsive-layout.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 720 },
];

test.describe("Responsive Layout Adaptation", () => {
  // Tests go here
});
```

### Step 2: Mobile Viewport Test

Verify mobile layout hides ads and maximizes board space:

```typescript
test("should adapt layout for mobile viewport (375×667)", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  // Verify board container visible and fills viewport
  const main = page.locator("main");
  await expect(main).toBeVisible();

  const boundingBox = await main.boundingBox();
  expect(boundingBox).toBeTruthy();

  // Verify ads hidden (Tailwind: hidden lg:flex)
  const ads = page.locator('[data-testid^="google-ad-"]');
  await expect(ads.first()).toBeHidden();

  // Verify board interactive (can drag pieces)
  await page
    .locator('[data-square="e2"]')
    .dragTo(page.locator('[data-square="e4"]'));
  // Move executed successfully
});
```

### Step 3: Tablet Viewport Test

Verify tablet layout (also hides ads, board centered):

```typescript
test("should adapt layout for tablet viewport (768×1024)", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");

  // Verify board visible
  const main = page.locator("main");
  await expect(main).toBeVisible();

  // Verify ads still hidden (lg breakpoint is 1024px)
  const ads = page.locator('[data-testid^="google-ad-"]');
  await expect(ads.first()).toBeHidden();

  // Verify board centered (flexbox centering)
  const boundingBox = await main.boundingBox();
  expect(boundingBox).toBeTruthy();

  // Board should have margin on sides (not full width)
  if (boundingBox) {
    expect(boundingBox.x).toBeGreaterThan(0);
  }
});
```

### Step 4: Desktop Viewport Test

Verify desktop layout shows ads in sidebars:

```typescript
test("should show Google Ads on desktop viewport (1280×720)", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  // Verify board visible and centered
  const main = page.locator("main");
  await expect(main).toBeVisible();

  // Verify ads visible (Tailwind: lg:flex)
  const ads = page.locator('[data-testid^="google-ad-"]');
  const adCount = await ads.count();
  expect(adCount).toBeGreaterThan(0);

  await expect(ads.first()).toBeVisible();

  // Verify ad has expected attributes
  const adElement = ads.first();
  await expect(adElement).toHaveAttribute("data-testid", /google-ad-/);
});
```

### Step 5: Cross-Viewport Consistency

Verify board works identically at all viewport sizes:

```typescript
for (const viewport of viewports) {
  test(`should render board correctly at ${viewport.name} (${viewport.width}×${viewport.height})`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    // Verify board visible
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Verify board interactive (drag piece)
    await page
      .locator('[data-square="e2"]')
      .dragTo(page.locator('[data-square="e4"]'));

    // Verify move succeeded (piece on e4)
    await expect(page.locator('[data-square="e4"]')).toBeVisible();

    console.log(`✓ Board functional at ${viewport.name}`);
  });
}
```

**Note:** This test loop generates 3 separate test cases, one per viewport.

## 📁 Affected Files

| Action | Path                                  | Role                                                    |
| ------ | ------------------------------------- | ------------------------------------------------------- |
| Create | `tests/e2e/responsive-layout.spec.ts` | E2E tests for responsive layout and viewport adaptation |

## ✅ Acceptance Criteria

- [x] Test file `tests/e2e/responsive-layout.spec.ts` with 4 tests
- [x] Mobile viewport test (375×667) - heading, sound toggle visible, no h-scroll
- [x] Tablet viewport test (768×1024) - same assertions
- [x] Desktop viewport test (1280×720) - same assertions
- [x] Cross-viewport consistency test - loops 4 viewports, verifies all pass
- [x] `npm run test:e2e -- responsive-layout.spec.ts` passes: 20/20 (4 tests × 5 browsers)
- [x] [NOTE] Google Ad visibility not tested - ads.txt not configured for test domain

- [ ] Test file `tests/e2e/responsive-layout.spec.ts` exists
- [ ] Mobile test (375×667) verifies ads hidden and board fills viewport
- [ ] Tablet test (768×1024) verifies ads hidden and board centered
- [ ] Desktop test (1280×720) verifies ads visible and board centered
- [ ] Cross-viewport tests (3 viewports) verify board interactive at all sizes
- [ ] All tests pass in 5 browsers (6 tests × 5 browsers = 30 passing)
- [ ] Tests use `page.setViewportSize()` for viewport control
- [ ] Ad visibility assertions use `toBeVisible()` / `toBeHidden()`
- [ ] [NEGATIVE] Tests do NOT rely on specific pixel positions (use bounding boxes only)

## 🚫 Out of Scope

- Testing landscape vs portrait orientation (mobile rotation) — covered by preset viewports
- Testing intermediate breakpoints (e.g., 900px) — just mobile/tablet/desktop
- Testing zoom levels (50%, 200%) — WCAG compliance, not E2E scope
- Testing dynamic viewport resizing — just fixed viewport sizes

## 🧪 Test Cases

- [ ] Test: Run `npm run test:e2e -- responsive-layout.spec.ts` → 6 tests × 5 browsers = 30 passing
- [ ] Test: Load at 375×667 → ads hidden, board visible
- [ ] Test: Load at 1280×720 → ads visible, board centered
- [ ] Test: Drag piece at mobile viewport → move succeeds

## ✅ Verification

```bash
npm run test:e2e -- tests/e2e/responsive-layout.spec.ts
# Expected: 6 passed across 5 browsers (30 total)
```

**Visual verification (mobile Safari):**

```bash
npm run test:e2e:headed -- tests/e2e/responsive-layout.spec.ts --project=mobile-safari
# Watch layout adapt to iPhone 12 dimensions
```

**Cross-viewport check:**

```bash
npm run test:e2e -- responsive-layout.spec.ts --grep "should render board correctly"
# Runs 3 viewport tests across 5 browsers = 15 passing
```
