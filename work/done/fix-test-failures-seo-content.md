# Critical: Test Failures After SEO Content Addition

**Severity:** 🔴 Critical  
**Type:** Regression  
**Found:** 2026-05-08 QA Review  
**Blocks:** CI/CD, production deployment

---

## 🐛 Issue Summary

4 tests failing in `app/page.test.tsx` after SEO content section was added to homepage in technical SEO ticket. Tests expect "no headings" but SEO content includes `<h1>` and `<h2>` tags (intentionally, for search engines).

---

## 📍 Location

**File:** [app/page.test.tsx](../../app/page.test.tsx)  
**Lines:** 51-52, 63-67, 80-81, 91

---

## 🔍 Root Cause

Tests written for original "chessboard-only" implementation. When technical SEO ticket added sr-only content section with semantic HTML (h1, h2, paragraphs), tests broke because they explicitly check for **no headings**.

**Conflicting requirements:**

- Original ticket ([offline-chess-board.md](../../work/done/offline-chess-board.md)): "Page displays only chessboard—no headers, buttons, text, or controls"
- SEO ticket ([seo-technical-improvements.md](../../work/done/seo-technical-improvements.md)): "Page has `<h1>` heading with 'Pass & Play Chess' text" and "Page has semantic HTML content with 200+ words"

**Reality:** Both are correct. SEO content is visually hidden (`sr-only` class) but present in DOM for search engines. Tests need to reflect this.

---

## ❌ Failing Tests

### Test 1: "displays only chessboard - no headers or navigation"

```typescript
expect(screen.queryByRole("heading")).not.toBeInTheDocument();
```

**Fails because:** Multiple `<h1>` and `<h2>` tags exist in sr-only section

**Expected behavior:** sr-only headings should exist (for SEO), but no **visible** headings

### Test 2: "has fullscreen layout with flexbox centering"

```typescript
expect(mainElement).toHaveStyle({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
```

**Fails because:** DOM structure changed—sr-only section wrapped in `<>` fragment, main element is now `<div>` not root

**Expected behavior:** Chessboard container (not root) should have flex centering styles

### Test 3 & 4: "board container is square and responsive" + "has max-width constraint"

```typescript
const style = boardContainer.getAttribute("style");
expect(style).toContain("width: 100%");
```

**Fails because:** Can't find `boardContainer` element—query selector outdated after DOM restructure

**Expected behavior:** Tests should query for chessboard wrapper correctly

---

## ✅ Acceptance Criteria for Fix

- [ ] Tests pass when SEO content section is present with sr-only class
- [ ] Tests verify sr-only section **exists** and contains expected headings/keywords
- [ ] Tests verify no **visually rendered** headings (outside sr-only section)
- [ ] Tests query chessboard container correctly after DOM structure change
- [ ] Tests verify flexbox centering on correct element (chessboard wrapper, not root)
- [ ] Tests verify responsive styling on correct element
- [ ] All 4 failing tests now pass
- [ ] `npm test` exits with code 0

---

## 🔧 Recommended Fix

### Update Test Expectations

**File:** `app/page.test.tsx`

1. **Test: "displays only chessboard - no headers or navigation"**

   ```typescript
   // OLD (fails):
   expect(screen.queryByRole("heading")).not.toBeInTheDocument();

   // NEW (correct):
   // sr-only headings should exist for SEO
   const srOnlySection = document.querySelector(".sr-only");
   expect(srOnlySection).toBeInTheDocument();
   expect(
     within(srOnlySection).getByRole("heading", { level: 1 }),
   ).toHaveTextContent("Pass & Play Chess");

   // No visible headings outside sr-only section
   const visibleContent = document.querySelector('div[style*="display: flex"]');
   expect(
     within(visibleContent).queryByRole("heading"),
   ).not.toBeInTheDocument();
   ```

2. **Test: "has fullscreen layout with flexbox centering"**

   ```typescript
   // OLD (fails):
   const mainElement = container.firstChild as HTMLElement
   expect(mainElement).toHaveStyle({ display: 'flex', ... })

   // NEW (correct):
   // Find the chessboard wrapper div (second child after sr-only section)
   const chessboardWrapper = container.querySelector('div[style*="display: flex"]')
   expect(chessboardWrapper).toHaveStyle({
     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
     height: '100vh',
     width: '100vw',
   })
   ```

3. **Test: "board container is square and responsive"**

   ```typescript
   // OLD (fails):
   const boardContainer = screen.getByTestId("chessboard").parentElement;

   // NEW (correct):
   const boardContainer = screen.getByTestId("chessboard").parentElement;
   expect(boardContainer).toBeInTheDocument();
   const style = boardContainer?.getAttribute("style");
   expect(style).toContain("width: 100%");
   expect(style).toContain("aspect-ratio: 1");
   ```

4. **Test: "board container has responsive max-width constraint"**
   ```typescript
   // Same fix as Test 3—query boardContainer correctly
   ```

### Add New Test for SEO Content

```typescript
describe('SEO Content', () => {
  it('has sr-only section with semantic HTML for search engines', () => {
    render(<Home />)
    const srOnly = document.querySelector('.sr-only')

    expect(srOnly).toBeInTheDocument()
    expect(srOnly).toHaveAttribute('aria-label', 'About Pass & Play Chess')

    // Verify headings
    const h1 = within(srOnly).getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Pass & Play Chess — Free Offline Chess Board')

    // Verify target keywords present
    expect(within(srOnly).getByText(/pass and play chess/i)).toBeInTheDocument()
    expect(within(srOnly).getByText(/offline/i)).toBeInTheDocument()
    expect(within(srOnly).getByText(/two players/i)).toBeInTheDocument()
  })

  it('sr-only content is visually hidden but accessible to screen readers', () => {
    render(<Home />)
    const srOnly = document.querySelector('.sr-only')

    // sr-only class hides content visually (check computed styles in real browser)
    expect(srOnly).toHaveClass('sr-only')
  })
})
```

---

## 🧪 Verification Steps

1. Run failing tests to confirm current state:

   ```bash
   npm test -- app/page.test.tsx
   ```

2. Apply fixes above

3. Re-run tests:

   ```bash
   npm test
   ```

4. Verify all tests pass:

   ```bash
   npm test -- --coverage
   ```

5. Verify CI command passes:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

---

## 📊 Impact

**User-facing:** None — this is a testing/CI issue only. Product functionality unchanged.

**Development:** Blocks CI/CD pipeline. All PRs/deployments will fail until fixed.

**Risk if not fixed:** Can't validate future changes, potential regressions go undetected.

---

## 🎯 Priority Justification

**Critical severity because:**

- Blocks production deployment (CI/CD fails)
- Affects all future development (broken CI)
- Quick fix (1-2 hours)—no reason to defer

**Not a product bug:**

- Feature is working correctly (SEO content intentionally added)
- Tests simply need to reflect new reality

---

## 📎 Related Files

- [app/page.tsx](../../app/page.tsx) — Current implementation with sr-only section
- [app/page.test.tsx](../../app/page.test.tsx) — Failing tests
- [work/done/seo-technical-improvements.md](../../work/done/seo-technical-improvements.md) — Ticket that added SEO content
- [work/done/offline-chess-board.md](../../work/done/offline-chess-board.md) — Original "no chrome" requirement

---

_Reported by Work Reviewer on 2026-05-08_
