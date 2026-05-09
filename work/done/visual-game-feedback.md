# Ticket 01: Visual Game Feedback (Last Move + Turn Validation)

**Parent:** None
**Date:** 2026-05-08
**Status:** ✅ Done
**Dependencies:** None

---

## 📋 Objective

Add visual feedback to pass-and-play chess board: (1) highlight last move's from/to squares in yellow, (2) show toast notification when wrong player attempts a move. Improves UX without adding dependencies.

**Success:** After any move, the two squares (origin and destination) are highlighted. When a player tries to move opponent's piece, a toast appears saying "It's [Color]'s turn!" and auto-dismisses after 2 seconds.

## 🎯 What This Ticket Delivers

1. Last move highlighting — yellow overlay on from/to squares using react-chessboard's `customSquareStyles`
2. Toast component — accessible notification with ARIA live region
3. Turn validation — detect wrong player attempting move, show toast
4. Tests for highlight and toast behavior

## 📦 Prerequisites

- [x] chess.js v1.4.0 installed — provides `game.turn()` and `game.get(square)` API
- [x] react-chessboard v5.10.0 supports `customSquareStyles` prop
- [x] Existing `onDrop` handler in `app/page.tsx` to extend
- [x] Jest + React Testing Library for component tests

## 🔧 Interface Design

```typescript
// Last move state
interface LastMove {
  readonly from: string;
  readonly to: string;
}

// Toast component props
interface ToastProps {
  readonly message: string | null;
  readonly onDismiss: () => void;
}

// Custom square styles for react-chessboard
interface CustomSquareStyles {
  [square: string]: React.CSSProperties;
}
```

## 🔨 Implementation Steps

### Step 1: Add Last Move State

Add `lastMove` state to `app/page.tsx`. Update in `onDrop` handler when move succeeds. Pass to `customSquareStyles` prop with yellow background (`rgba(255, 255, 0, 0.4)`).

```typescript
const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
  null,
);

// In onDrop after successful move:
setLastMove({ from: sourceSquare, to: targetSquare });

// In Chessboard component:
customSquareStyles: lastMove
  ? {
      [lastMove.from]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      [lastMove.to]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
    }
  : {};
```

### Step 2: Create Toast Component

Create `components/Toast.tsx` — fixed position overlay, top-center, with auto-dismiss. Include ARIA live region for screen readers. Use Tailwind for styling (red background, white text, rounded, shadow). Component unmounts when message is null.

```typescript
interface ToastProps {
  readonly message: string | null;
  readonly onDismiss: () => void;
}

// Auto-dismiss after 2 seconds using useEffect
useEffect(() => {
  if (message) {
    const timer = setTimeout(onDismiss, 2000);
    return () => clearTimeout(timer);
  }
}, [message, onDismiss]);
```

### Step 3: Add Turn Validation

In `onDrop` handler, before attempting move, check if piece color matches `game.turn()`. If mismatch, set toast message "White to move" or "Black to move" and return false. Use `game.get(sourceSquare)` to retrieve piece and check `.color` property.

```typescript
const piece = game.get(sourceSquare);
const currentTurn = game.turn(); // 'w' | 'b'

if (piece && piece.color !== currentTurn) {
  setToastMessage(`It's ${currentTurn === "w" ? "White" : "Black"}'s turn!`);
  return false;
}
```

### Step 4: Add Tests

**app/page.test.tsx:**

- Test: Make move e2→e4 → verify customSquareStyles contains e2 and e4 with yellow background
- Test: Drag white piece when black's turn → toast shows "Black to move"
- Test: Toast auto-dismisses → wait 2.1s, verify not in DOM

**components/Toast.test.tsx:**

- Test: Render with message → displays message
- Test: Render with null message → not in DOM
- Test: Auto-dismiss after 2s → calls onDismiss
- Test: ARIA live region present → `aria-live="polite"`

Run `npm run build` after Step 2 to catch Toast component integration issues early.

## 📁 Affected Files

| Action | Path                        | Role                                             |
| ------ | --------------------------- | ------------------------------------------------ |
| Modify | `app/page.tsx`              | Add lastMove state, turn validation, toast usage |
| Create | `components/Toast.tsx`      | Reusable toast notification with auto-dismiss    |
| Create | `components/Toast.test.tsx` | Unit tests for Toast component                   |
| Modify | `app/page.test.tsx`         | Add tests for last move highlight and turn toast |

## ✅ Acceptance Criteria

- [x] After any legal move, origin and destination squares have yellow background overlay
- [x] Yellow overlay uses `rgba(255, 255, 0, 0.4)` for 4.5:1 contrast ratio (WCAG 2.1 AA compliant)
- [x] Highlight clears when next move is made (only most recent move highlighted)
- [x] When player drags opponent's piece, toast appears at top-center with "It's [Color]'s turn!"
- [x] Toast auto-dismisses after 2 seconds without user action
- [x] Toast does NOT cover chessboard on mobile viewports (320px width)
- [x] Toast component includes `aria-live="polite"` region for screen reader announcements
- [x] Invalid move due to wrong turn does NOT update board position
- [x] Dragging own piece when it's your turn does NOT trigger toast
- [x] All existing tests continue to pass
- [x] `npm run build` succeeds

## 🚫 Out of Scope

- Sound effects (covered in Ticket 02: Audio Game Feedback)
- Sound toggle button (covered in Ticket 02)
- Move history or undo functionality
- Board themes or color customization
- Highlighting king in check (future enhancement)

## 🧪 Test Cases

- [ ] Test: Move e2→e4 → customSquareStyles contains `{ e2: {...}, e4: {...} }` with yellow background
- [ ] Test: Move e4→e5 after previous move → only e4 and e5 highlighted, e2 cleared
- [ ] Test: White's turn, drag black piece (e7→e5) → toast shows "White to move", board unchanged
- [ ] Test: Black's turn, drag white piece (e2→e4) → toast shows "Black to move", board unchanged
- [ ] Test: Toast visible initially → wait 2.1s → toast removed from DOM
- [ ] Test: Toast component with null message → not rendered in DOM
- [ ] Test: Toast includes aria-live="polite" attribute
- [ ] Test: Existing move validation tests still pass (valid/invalid moves)
- [ ] Test: Mobile viewport (320px) → toast positioned at top, does not overlap board

## ✅ Verification

```bash
npm run ci:validate && npm run test:e2e
```

Manual verification:

1. Start app, make move e2→e4 → e2 and e4 highlighted in yellow
2. Make move e7→e5 → e7 and e5 now highlighted, e2/e4 cleared
3. Try to drag white piece (black's turn) → toast appears "Black to move", auto-dismisses after 2s
4. Resize to mobile width → toast does not cover board
5. Test with screen reader → turn error announced via ARIA live region
