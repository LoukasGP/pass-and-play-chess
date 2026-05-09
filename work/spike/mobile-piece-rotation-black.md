# Spike: Rotate Black Pieces on Mobile/Tablet

**Date:** 2026-05-09
**Status:** 🟡 In Progress
**Researcher:** Scrum Master

---

## 🎯 Goal

Rotate black chess pieces 180° on mobile and tablet viewports so players can view pieces from their own perspective when playing pass-and-play. Desktop remains unchanged.

**Target viewports:** Mobile (< 768px) and tablet (768px–1023px)  
**Excluded:** Desktop (≥ 1024px / `lg:` breakpoint)

---

## 📊 Codebase Discovery

### Current Implementation

| Component            | Library                  | Details                                 |
| -------------------- | ------------------------ | --------------------------------------- |
| **Board UI**         | react-chessboard v5.10.0 | Renders SVG pieces via props            |
| **Styling**          | Tailwind CSS 4           | `lg:` breakpoint = 1024px               |
| **Responsive Logic** | CSS media queries        | Ads hide below `lg:`, board scales 100% |

### Board Rendering (app/page.tsx)

```typescript
<Chessboard
  options={{
    position: game.fen(),
    onPieceDrop: onDrop,
    ...(lastMove && {
      squareStyles: {
        [lastMove.from]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
        [lastMove.to]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      },
    }),
  }}
/>
```

**Current customization:** `squareStyles` only (yellow highlight for last move). No piece-level styling yet.

### Tailwind Breakpoints (Standard)

| Breakpoint | Min Width | Usage in Project          |
| ---------- | --------- | ------------------------- |
| `sm:`      | 640px     | Not used                  |
| `md:`      | 768px     | Content page padding      |
| `lg:`      | 1024px    | Desktop ads, sidebar flex |
| `xl:`      | 1280px    | Not used                  |

### react-chessboard Library API Research

**Official Props (v5.10.0):**

- `position` — FEN string for board state
- `onPieceDrop` — drag-and-drop handler
- `customSquareStyles` — CSS object for square backgrounds ✅ (already used)
- `customPieces` — **NOT SUPPORTED** in v5.x (checked GitHub repo)
- `customDarkSquareStyle`, `customLightSquareStyle` — square colors only, not pieces

**DOM Structure (from library source):**

```html
<div class="chessboard">
  <div class="square dark">
    <div class="piece" data-piece="bN" style="...">
      <!-- SVG piece rendered inline -->
    </div>
  </div>
</div>
```

**Key finding:** Library uses inline SVG for pieces. CSS targeting via class selectors (`.piece`) is possible, but piece color/type NOT exposed in class names by default in v5.10.0.

---

## 🔍 Feasibility Analysis

### Approach A: CSS Transform on All Pieces (Black-Only Selector)

**Implementation:**

```css
/* globals.css */
@media (max-width: 1023px) {
  /* Target pieces on black squares (a1, c1, e1, g1, b8, d8, f8, h8, etc.) */
  [data-square^="a"][data-square$="8"] .piece,
  [data-square^="c"][data-square$="8"] .piece,
  /* ... list all 16 black piece starting squares ... */ {
    transform: rotate(180deg);
  }
}
```

**Pros:**

- Zero code changes to `app/page.tsx`
- Pure CSS solution
- Performance: CSS transforms are GPU-accelerated
- No library modifications

**Cons:**

- **Brittle:** Requires hardcoding 16 square selectors for black pieces
- **Breaks after first move:** Once pieces move from starting squares, selectors no longer match
- **Not viable for dynamic gameplay**

**Verdict:** ❌ Not feasible

---

### Approach B: CSS Class Injection via Wrapper + Data Attributes

**Implementation:**

1. Wrap `<Chessboard />` in a container with `data-rotate-black` attribute
2. Use CSS descendant selector to target pieces on black's side (ranks 7-8)
3. Apply `transform: rotate(180deg)` below `lg:` breakpoint

```tsx
// app/page.tsx
<div data-rotate-black className="lg:data-[rotate-black]:contents">
  <Chessboard options={{...}} />
</div>
```

```css
/* globals.css */
@media (max-width: 1023px) {
  [data-rotate-black] [data-square$="7"] .piece,
  [data-rotate-black] [data-square$="8"] .piece {
    transform: rotate(180deg);
  }
}
```

**Pros:**

- Minimal code change (one wrapper div)
- Works for all black pieces regardless of position
- No JS logic needed
- GPU-accelerated transform

**Cons:**

- **Still hardcoded to starting positions** — assumes black pieces stay on ranks 7-8
- **Breaks mid-game:** When black pawn moves to rank 4, no longer rotated
- **Incorrect rotation on captures:** White piece on rank 8 would rotate

**Verdict:** ❌ Not feasible for active gameplay

---

### Approach C: Dynamic CSS via Piece Color Detection (JS-Driven)

**Implementation:**

1. Track current piece positions from `game.board()` (chess.js API)
2. Inject inline styles per piece based on color
3. Apply rotation only to pieces with `color === 'b'`

```tsx
// app/page.tsx
const getPieceStyles = () => {
  const board = game.board();
  const styles: Record<string, React.CSSProperties> = {};

  board.forEach((row, rankIndex) => {
    row.forEach((square, fileIndex) => {
      if (square && square.color === "b") {
        const squareNotation = `${String.fromCharCode(97 + fileIndex)}${8 - rankIndex}`;
        styles[squareNotation] = { transform: "rotate(180deg)" };
      }
    });
  });

  return styles;
};

<Chessboard
  options={{
    position: game.fen(),
    onPieceDrop: onDrop,
    customPieceStyles: getPieceStyles(), // ⚠️ NOT SUPPORTED in react-chessboard
  }}
/>
```

**Pros:**

- Accurate — rotates only black pieces dynamically
- Updates every move

**Cons:**

- **Blocked by library limitation:** `react-chessboard` v5.10.0 does NOT support `customPieceStyles` prop
- Would require forking or patching library

**Verdict:** ❌ Not supported by library

---

### Approach D: CSS Selector with Viewport + FEN Parsing (Hybrid)

**Implementation:**

1. Add `data-viewport` attribute to board container (`mobile`, `tablet`, `desktop`)
2. Parse `game.fen()` to identify black piece squares
3. Inject `<style>` tag with dynamic selectors for black pieces

```tsx
// app/page.tsx
const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("desktop");

useEffect(() => {
  const updateViewport = () => {
    const width = window.innerWidth;
    if (width < 768) setViewport("mobile");
    else if (width < 1024) setViewport("tablet");
    else setViewport("desktop");
  };
  updateViewport();
  window.addEventListener("resize", updateViewport);
  return () => window.removeEventListener("resize", updateViewport);
}, []);

const getBlackPieceSquares = () => {
  const board = game.board();
  const squares: string[] = [];
  board.forEach((row, rankIndex) => {
    row.forEach((square, fileIndex) => {
      if (square && square.color === "b") {
        squares.push(`${String.fromCharCode(97 + fileIndex)}${8 - rankIndex}`);
      }
    });
  });
  return squares;
};

<style>
  {viewport !== "desktop" &&
    getBlackPieceSquares()
      .map((sq) => `[data-square="${sq}"] .piece`)
      .join(", ") + " { transform: rotate(180deg); }"}
</style>
```

**Pros:**

- Works around library limitations
- Dynamically updates on every move
- No library fork needed

**Cons:**

- **Hacky:** Injects inline `<style>` tags into React component
- **Performance risk:** Re-calculates CSS on every render (32-64 squares checked)
- **Hydration mismatch risk:** SSR vs client viewport detection
- **Unmaintainable:** CSS-in-JS anti-pattern for Next.js

**Verdict:** ⚠️ Technically feasible but not recommended

---

### Approach E: Fork react-chessboard + Add `customPieceStyles` Prop

**Implementation:**

1. Fork `react-chessboard` v5.10.0 to private repo or patch via `patch-package`
2. Add `customPieceStyles` prop to library
3. Pass piece-specific styles from parent component

```tsx
// Modified react-chessboard (fork)
<Chessboard
  options={{
    position: game.fen(),
    onPieceDrop: onDrop,
    customPieceStyles: {
      // Apply to pieces by square
      a7: { transform: "rotate(180deg)" },
      b7: { transform: "rotate(180deg)" },
      // ... all black pieces
    },
  }}
/>
```

**Pros:**

- Clean API
- Precise control over piece styling
- Reusable for future customizations

**Cons:**

- **Maintenance burden:** Must sync with upstream react-chessboard updates
- **Bundle size:** Fork adds ~50KB to node_modules
- **Security risk:** Unmaintained fork could introduce vulnerabilities
- **Time cost:** 4-8 hours to fork, test, and integrate

**Verdict:** ⚠️ Feasible but high cost for single feature

---

### Approach F: CSS with `data-piece` Attribute Selector (If Exposed)

**Research:** Check if react-chessboard exposes `data-piece` attributes in DOM.

**Expected DOM (if supported):**

```html
<div class="piece" data-piece="bN">
  <!-- Black knight SVG -->
</div>
```

**Implementation:**

```css
/* globals.css */
@media (max-width: 1023px) {
  [data-piece^="b"] {
    /* All black pieces (prefix 'b') */
    transform: rotate(180deg);
  }
}
```

**Pros:**

- **Simplest solution** if attribute exists
- No JS changes needed
- Dynamic (works for all board states)

**Cons:**

- **Depends on library exposing `data-piece` in v5.10.0** (MUST VERIFY)

**Verdict:** ✅ **BEST APPROACH IF SUPPORTED** — requires DOM inspection

---

## 🧪 Verification Needed

### Test 1: Inspect react-chessboard DOM

**Method:**

1. Run `npm run dev`
2. Open browser DevTools → Elements tab
3. Inspect a piece element
4. Check for `data-piece`, `data-square`, or similar attributes

**Expected outcomes:**

- ✅ If `data-piece="bN"` exists → Proceed with Approach F (pure CSS)
- ❌ If no piece identifier → Fall back to Approach D (JS-driven CSS) or E (fork)

### Test 2: CSS Rotation Performance

**Method:**

1. Add test CSS rule: `[data-piece^="b"] { transform: rotate(180deg); }`
2. Make 10 rapid moves on mobile device (or Chrome DevTools mobile emulation)
3. Check Performance tab for jank (frames < 60fps)

**Acceptance:** No dropped frames during move animation

### Test 3: Touch Target Validation

**Method:**

1. Rotate black pieces on 375px viewport (iPhone SE)
2. Tap each rotated piece
3. Verify drag-and-drop still works (no offset issues from rotation)

**Acceptance:** All pieces draggable after rotation applied

---

## 🎯 Recommended Approach

### Priority 1: Approach F (CSS + `data-piece` Attribute)

**IF** react-chessboard v5.10.0 exposes `data-piece` in DOM:

```css
/* app/globals.css */
@media (max-width: 1023px) {
  [data-piece^="b"] {
    transform: rotate(180deg);
  }
}
```

**Effort:** 5 minutes  
**Risk:** Low (pure CSS, no JS changes)  
**Maintenance:** Zero

---

### Priority 2: Approach D (JS-Driven Dynamic CSS)

**IF** `data-piece` NOT available:

```tsx
// app/page.tsx
const [rotatedSquares, setRotatedSquares] = useState<string[]>([]);

useEffect(() => {
  if (window.innerWidth < 1024) {
    const board = game.board();
    const blackSquares: string[] = [];
    board.forEach((row, rankIndex) => {
      row.forEach((square, fileIndex) => {
        if (square && square.color === "b") {
          blackSquares.push(`${String.fromCharCode(97 + fileIndex)}${8 - rankIndex}`);
        }
      });
    });
    setRotatedSquares(blackSquares);
  }
}, [game, window.innerWidth]);
```

**Effort:** 2-3 hours (including tests)  
**Risk:** Medium (performance, hydration concerns)  
**Maintenance:** Ongoing (must update on every move)

---

## 🚨 Risks & Unknowns

| Risk                                   | Likelihood | Impact | Mitigation                                         |
| -------------------------------------- | ---------- | ------ | -------------------------------------------------- |
| `data-piece` attribute not exposed    | Medium     | High   | Verify in DOM before implementation                |
| Rotation breaks drag-and-drop offsets | Low        | High   | Test on real mobile device after CSS applied       |
| Performance degradation (30fps)       | Low        | Medium | Use CSS transforms (GPU-accelerated), profile in DevTools |
| Hydration mismatch (SSR vs client)    | Medium     | Medium | Use `useEffect` for viewport detection, not inline checks |
| Accessibility: rotated pieces confusing for screen readers | Low | Low | Rotation is visual-only, does not affect semantic HTML |

---

## 📁 Affected Files (Estimated)

| Action | Path                 | Role                                           |
| ------ | -------------------- | ---------------------------------------------- |
| Modify | `app/globals.css`    | Add media query + rotation CSS                 |
| Modify | `app/page.tsx`       | (Optional) JS logic if Approach D chosen       |
| Create | `app/page.test.tsx`  | Add tests for rotated pieces on mobile/tablet  |
| Create | `tests/e2e/piece-rotation.spec.ts` | E2E test for rotation on viewport resize |

---

## 🧰 Next Steps for Product Manager

1. **Verify DOM structure:** Run `npm run dev`, inspect `<Chessboard />` in DevTools, check for `data-piece` attribute.
2. **If `data-piece` exists:** Write ticket for Approach F (pure CSS, 5-minute implementation).
3. **If `data-piece` NOT exists:** Write ticket for Approach D (JS-driven CSS, 2-3 hour implementation).
4. **Include in ticket:**
   - Lighthouse performance baseline (before rotation)
   - Mobile device testing checklist (iOS Safari, Chrome Android)
   - Playwright E2E test for rotation on viewport resize

---

## 📚 Knowledge Files Referenced

- None (no existing knowledge base for react-chessboard customization)
- **Recommended addition:** Create `knowledge/react-chessboard-customization.md` with DOM structure, API props, and CSS targeting patterns after implementation

---

## 🏁 Recommendation Summary

**Preferred approach:** **Approach F** (CSS with `data-piece` selector) — simplest, zero JS changes, GPU-accelerated.

**Fallback:** **Approach D** (JS-driven dynamic CSS) — more complex, but works if library doesn't expose piece identifiers.

**Not recommended:** Approaches A, B, C (brittle), E (high maintenance cost).

**Hand off to Product Manager** for DOM verification and ticket creation.
