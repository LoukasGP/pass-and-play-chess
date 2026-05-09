# Ticket: Victory Celebration Modal with Confetti

**Parent:** None  
**Date:** 2026-05-09  
**Status:** 🔴 Not Started  
**Dependencies:** None  
**Spike:** [victory-celebration-modal.md](../spike/victory-celebration-modal.md)

---

## 📋 Objective

Add victory celebration when checkmate occurs: confetti animation, modal announcing winner with emoji, PGN download button, and Play Again button. Reuses existing modal pattern and sound system.

**Success:** Player achieves checkmate → confetti bursts, modal appears with "[Color] Wins! 🎉", user can download PGN file or start new game.

## 🎯 What This Ticket Delivers

1. Victory modal — appears on checkmate with winner announcement
2. Confetti animation — canvas-confetti burst respecting `prefers-reduced-motion`
3. PGN download — button downloads game moves in Portable Game Notation format
4. Play Again button — resets board and clears victory state
5. WCAG 2.1 AA compliance — accessible modal with ARIA labels, keyboard support
6. Test coverage — victory flow, download trigger, confetti mock, accessibility

## 📦 Prerequisites

- [x] chess.js v1.4.0 — provides `.pgn()`, `.turn()`, `.isCheckmate()` API
- [x] Existing checkmate detection in `app/page.tsx` — line 213
- [x] Existing modal pattern — resume modal in `app/page.tsx` lines 228-261
- [x] Existing `handleNewGame()` function — line 152
- [x] Existing `checkmate.mp3` sound — already plays on checkmate

## 🔧 Interface Design

```typescript
// Victory state
type Winner = "White" | "Black" | null;

// PGN download function signature
function downloadPGN(game: Chess, winner: string): void;

// Play Again handler
function handlePlayAgain(): void;

// canvas-confetti configuration
interface ConfettiOptions {
  readonly particleCount: number;
  readonly spread: number;
  readonly origin: { y: number };
  readonly colors?: string[];
  readonly disableForReducedMotion: boolean;
}
```

## 🔨 Implementation Steps

### Step 1: Install canvas-confetti

Install canvas-confetti package and TypeScript types. Bundle impact: +5.8KB gzipped (acceptable — remains <500KB total).

```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

### Step 2: Add Victory State and Winner Detection

In `app/page.tsx`, add `victoryWinner` state after existing state declarations. Modify checkmate detection in `onDrop` handler (line 213) to set winner.

```typescript
const [victoryWinner, setVictoryWinner] = useState<"White" | "Black" | null>(
  null,
);

// In onDrop, replace checkmate block:
if (gameCopy.isCheckmate()) {
  playSound("checkmate");
  const loser = gameCopy.turn(); // 'w' or 'b'
  setVictoryWinner(loser === "w" ? "Black" : "White");
}
```

Winner detection: chess.js `.turn()` returns whose turn it is — when checkmate occurs, current turn is the loser, so winner is opposite color.

### Step 3: Add Confetti Effect

Add `useEffect` to fire confetti when `victoryWinner` is set. Import canvas-confetti at top of file. Confetti config: 150 particles, 70° spread, gold/orange/red colors, respects `prefers-reduced-motion`.

```typescript
import confetti from "canvas-confetti";

useEffect(() => {
  if (victoryWinner) {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FFA500", "#FF6347"],
      disableForReducedMotion: true,
    });
  }
}, [victoryWinner]);
```

WCAG 2.3.1 compliance: Duration <1s, particle count controlled, no rapid flashing, disabled for users with `prefers-reduced-motion`.

### Step 4: Add PGN Download Helper

Add `downloadPGN` function before component return. Uses chess.js `.pgn()` method to get game notation. Creates blob, triggers download via native `<a>` element, cleans up object URL.

```typescript
function downloadPGN(game: Chess, winner: string) {
  const pgn = game.pgn();
  const blob = new Blob([pgn], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `chess-game-${winner}-wins-${Date.now()}.pgn`;
  link.click();
  URL.revokeObjectURL(url);
}
```

Security: Filename uses only hardcoded winner string ('White'/'Black') + timestamp — no user input, safe from path traversal.

### Step 5: Add Play Again Handler

Add `handlePlayAgain` function that reuses existing `handleNewGame()` and clears victory state + last move highlight.

```typescript
function handlePlayAgain() {
  handleNewGame(); // Resets game, clears localStorage
  setVictoryWinner(null);
  setLastMove(null); // Clear yellow highlight
}
```

### Step 6: Render Victory Modal

Add victory modal JSX before existing resume modal. Use same structure as resume modal: fixed overlay, white card, ARIA labels. Two buttons: Download (primary) and Play Again (secondary).

```tsx
{victoryWinner && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    role="dialog"
    aria-labelledby="victory-title"
    aria-describedby="victory-subtitle"
    aria-live="assertive"
  >
    <div className="bg-white p-6 rounded shadow-lg max-w-md">
      <h2 id="victory-title" className="text-2xl font-bold mb-2">
        {victoryWinner} Wins! 🎉
      </h2>
      <p id="victory-subtitle" className="text-gray-600 mb-6">
        Checkmate
      </p>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => downloadPGN(game, victoryWinner)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        >
          Download Moves (PGN)
        </button>
        <button
          onClick={handlePlayAgain}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Play Again
        </button>
      </div>
    </div>
  </div>
)}
```

Accessibility: `aria-live="assertive"` announces winner to screen readers, `autoFocus` on primary button, buttons 44×44px minimum (WCAG 2.5.5).

Run `npm run build` after this step to verify no TypeScript errors.

### Step 7: Add Tests

In `app/page.test.tsx`, add test suite for victory modal. Mock canvas-confetti module. Test scenarios: checkmate triggers modal, winner displayed correctly, download button creates PGN file, Play Again resets game, confetti respects reduced motion.

Test cases:
- Scholar's Mate triggers victory modal
- Modal displays "White Wins!" for white victory
- Modal displays "Black Wins!" for black victory
- Download button calls PGN download with correct filename format
- PGN content matches game moves
- Play Again button resets board to starting position
- Play Again clears localStorage (no resume prompt on reload)
- Confetti fires when modal opens (mock called)
- Confetti NOT fired when `prefers-reduced-motion` is true

Mock canvas-confetti:
```typescript
jest.mock("canvas-confetti", () => jest.fn());
```

## 📁 Affected Files

| Action | Path                            | Role                                                        |
| ------ | ------------------------------- | ----------------------------------------------------------- |
| Modify | `app/page.tsx`                  | Add victory state, modal JSX, confetti effect, PGN download |
| Modify | `package.json`                  | Add canvas-confetti dependency                              |
| Modify | `app/page.test.tsx`             | Add victory modal tests, confetti mock, download tests      |
| Create | `package-lock.json` (generated) | Lock canvas-confetti version                                |

## ✅ Acceptance Criteria

### Functional
- [ ] Victory modal appears immediately when checkmate occurs
- [ ] Modal displays correct winner color ("White Wins!" or "Black Wins!")
- [ ] Modal shows "Checkmate" subtitle
- [ ] Confetti animation plays when modal opens (150 particles, gold/orange/red)
- [ ] Download button downloads PGN file with format: `chess-game-[Winner]-wins-[timestamp].pgn`
- [ ] PGN file contains all moves in correct chess notation (e.g., "1. e4 e5 2. Nf3...")
- [ ] Play Again button resets board to starting position (white pieces bottom)
- [ ] Play Again clears localStorage (no "Resume last game?" on reload)
- [ ] Existing `checkmate.mp3` sound still plays before modal appears
- [ ] Victory modal does NOT appear on stalemate (not checkmate)
- [ ] Victory modal does NOT appear on check (only checkmate)

### Accessibility (WCAG 2.1 AA)
- [ ] Modal has `role="dialog"`, `aria-labelledby="victory-title"`, `aria-describedby="victory-subtitle"`
- [ ] Winner announced to screen readers via `aria-live="assertive"`
- [ ] Confetti disabled when user has `prefers-reduced-motion` set
- [ ] Confetti duration <1s (WCAG 2.3.1 — no flash threshold violation)
- [ ] Download and Play Again buttons keyboard accessible (Tab navigation works)
- [ ] Buttons meet 44×44px touch target minimum (WCAG 2.5.5)
- [ ] Focus automatically moves to Download button when modal opens (`autoFocus`)

### Performance
- [ ] Bundle size increase ≤10KB gzipped (canvas-confetti adds ~6KB)
- [ ] No layout shift when modal appears (CLS ≤0.1)
- [ ] Confetti animation runs at 60fps (no frame drops)
- [ ] `npm run build` succeeds

### Security
- [ ] PGN filename sanitized — uses only hardcoded winner string + timestamp (no user input)
- [ ] PGN download uses blob URLs (no server upload)
- [ ] No XSS risk from winner string (only 'White' or 'Black' possible)

## 🚫 Out of Scope

- Stalemate modal (different UX — not requested, defer to future ticket)
- Draw detection (repetition, 50-move rule — chess.js doesn't auto-detect)
- Move history list in modal (PGN download provides this)
- Customizable confetti colors (use default gold/orange/red)
- Victory sound distinct from checkmate sound (reuse existing `checkmate.mp3`)
- Google Analytics event for victory (add later if analytics expanded)
- Escape key to dismiss victory modal (game is over — user must choose action)

## 🧪 Test Cases

- [ ] Test: Scholar's Mate (Qxf7#) → Victory modal appears with "White Wins!"
- [ ] Test: Fool's Mate (Qh4#) → Victory modal appears with "Black Wins!"
- [ ] Test: Click Download button → PGN file downloads with correct filename
- [ ] Test: Downloaded PGN content matches game moves → assertions on file content
- [ ] Test: Click Play Again → board resets to starting position, modal closes
- [ ] Test: Play Again clears localStorage → `getItem('chess_game_last_fen')` returns null
- [ ] Test: Confetti fires on modal open → canvas-confetti mock called once
- [ ] Test: `prefers-reduced-motion` enabled → confetti NOT called
- [ ] Test: Check (not checkmate) → victory modal does NOT appear
- [ ] Test: Stalemate → victory modal does NOT appear (game.isCheckmate() returns false)
- [ ] Test: Modal has correct ARIA attributes → `role="dialog"`, `aria-labelledby`, `aria-describedby`

## ✅ Verification

```bash
npm run validate
```

Includes: Jest tests, ESLint, Prettier, TypeScript checks, production build.
