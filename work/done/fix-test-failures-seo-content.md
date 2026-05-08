# Fix: Test Failures After SEO Content Addition

**Date:** 2026-05-08
**Status:** ✅ Done
**Priority:** Critical
**QA Issue:** [qa/issues/critical-test-failures-seo-content.md](../../qa/issues/critical-test-failures-seo-content.md)

---

## 📋 Objective

Update `app/page.test.tsx` to align with current homepage implementation that includes sr-only SEO content section. Tests currently expect "no headings" but SEO content intentionally includes h1/h2 tags for search engines (visually hidden via sr-only class).

**Success:** All tests pass, CI/CD unblocked, tests verify both sr-only content exists AND no visible UI chrome.

## 📁 Affected Files

| Action | Path                 | Role                                              |
| ------ | -------------------- | ------------------------------------------------- |
| Modify | `app/page.test.tsx`  | Update 4 failing tests to reflect SEO content DOM |

## ✅ Acceptance Criteria

- [x] Test "displays only chessboard - no headers or navigation" verifies sr-only headings exist
- [x] Test "displays only chessboard - no headers or navigation" verifies no visible headings outside sr-only section
- [x] Test "has fullscreen layout with flexbox centering" queries correct element (chessboard wrapper, not root)
- [x] Test "board container is square and responsive" finds boardContainer correctly after DOM structure change
- [x] Test "board container has responsive max-width constraint" finds boardContainer correctly
- [x] New test added: verifies sr-only section contains expected SEO keywords ("pass and play", "offline", "two players")
- [x] All 4 previously failing tests now pass
- [x] `npm test` exits with code 0
- [x] No tests removed or disabled — fix by updating expectations, not deleting tests

## 🔧 Required Changes

### Change 1: Update "displays only chessboard" Test

**File:** `app/page.test.tsx` lines ~49-54

Replace heading check with:
1. Verify sr-only section exists with h1 containing "Pass & Play Chess"
2. Verify no headings in visible chessboard wrapper (outside sr-only)

Use `within()` helper from testing-library to scope queries.

### Change 2: Update "fullscreen layout" Test

**File:** `app/page.test.tsx` lines ~61-69

Query for chessboard wrapper `div[style*="display: flex"]` instead of `container.firstChild`. Verify flex styles on correct element.

### Change 3: Update "board container" Tests

**File:** `app/page.test.tsx` lines ~75-92

Ensure `boardContainer` query accounts for new DOM structure with sr-only section as first child. Use `screen.getByTestId('chessboard').parentElement` consistently.

### Change 4: Add SEO Content Test

**File:** `app/page.test.tsx` (new test in existing describe block)

Add test verifying sr-only section:
- Has `aria-label="About Pass & Play Chess"`
- Contains h1 with "Pass & Play Chess"
- Contains target keywords: "pass and play", "offline", "two players"
- Has sr-only class

## 🧪 Test Cases

- [ ] Test: Run `npm test` → all tests pass with exit code 0
- [ ] Test: sr-only section exists → query finds h1, h2, paragraphs inside `.sr-only`
- [ ] Test: No visible headings → query outside sr-only returns null
- [ ] Test: Chessboard wrapper has flex styles → flex, center, 100vh/100vw
- [ ] Test: Board container has responsive styles → width 100%, aspect-ratio 1, max-width constraint

## ✅ Verification

```bash
npm test
npm run build
```

**Expected output:** All tests pass, build succeeds, CI/CD pipeline green.
