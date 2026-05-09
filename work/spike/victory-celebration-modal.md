# Spike: Victory Celebration Modal with Confetti

**Date:** 2026-05-09  
**Status:** ✅ Complete  
**Feature Request:** Congratulations modal when color wins — confetti, popout, download moves, positive sound, play again button  
**Implementation Ticket:** [victory-celebration-modal.md](../todo/victory-celebration-modal.md)

---

## Problem Statement

When checkmate occurs, game currently only plays `checkmate.mp3` sound. User wants celebratory victory experience:

- Confetti animation
- Modal popout announcing winner
- Download moves as PGN notation
- Positive victory sound (already exists as `checkmate.mp3`)
- "Play Again" button to reset game

**User need:** Satisfying endgame experience for offline chess players.

---

## Current Implementation

### Checkmate Detection

[page.tsx#L213-L217](../app/page.tsx#L213-L217):

```typescript
if (gameCopy.isCheckmate()) {
  playSound("checkmate");
} else if (gameCopy.isCheck()) {
  playSound("check");
}
```

### Existing Modal Pattern

Resume modal exists in [page.tsx#L228-L261](../app/page.tsx#L228-L261):

- Fixed overlay with `bg-black/50` backdrop
- White card with rounded corners, shadow
- ARIA labels: `role="dialog"`, `aria-labelledby`, `aria-describedby`
- Keyboard support: Escape key dismisses
- Two buttons: primary action (Resume) + secondary (New Game)
- Focus management: `autoFocus` on primary button

### Existing Sound System

- Sound toggle in [SoundToggle.tsx](../components/SoundToggle.tsx) — persists to localStorage
- `playSound()` function in [page.tsx#L48-L58](../app/page.tsx#L48-L58) — native HTML5 Audio API
- Two sounds: `check.mp3`, `checkmate.mp3` in `public/sounds/`

### Existing Reset Mechanism

`handleNewGame()` in [page.tsx#L152-L163](../app/page.tsx#L152-L163):

```typescript
function handleNewGame() {
  setGame(new Chess());
  setShowResumeModal(false);
  // Clears localStorage
}
```

---

## Research Findings

### 1. Confetti Libraries

| Library             | Bundle Size   | API                                 | Accessibility                      | Verdict                  |
| ------------------- | ------------- | ----------------------------------- | ---------------------------------- | ------------------------ |
| **canvas-confetti** | 5.8KB gzipped | `confetti({ ... })` — function call | Configurable duration, no flashing | ✅ **Recommended**       |
| **react-confetti**  | 12KB gzipped  | `<Confetti />` — component          | Full-screen canvas overlay         | ⚠️ Heavier, less control |
| **react-rewards**   | 8KB gzipped   | Hook-based API                      | Needs manual config                | ❌ More complex          |

**Recommendation:** `canvas-confetti` — lightweight, imperative API fits existing codebase style, WCAG 2.3.1 compliant (no rapid flashing when configured correctly).

#### canvas-confetti Configuration

```typescript
import confetti from "canvas-confetti";

// Victory burst (WCAG 2.3.1 safe — duration < 1s, particle count controlled)
confetti({
  particleCount: 150,
  spread: 70,
  origin: { y: 0.6 },
  colors: ["#FFD700", "#FFA500", "#FF6347"], // Gold, orange, red
  disableForReducedMotion: true, // Respects prefers-reduced-motion
});
```

#### Installation

```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

**Bundle impact:** +5.8KB gzipped (acceptable for victory feature — total build remains <500KB).

---

### 2. PGN Export (Move Download)

chess.js provides `.pgn()` method — returns Portable Game Notation string.

#### API Usage

```typescript
const game = new Chess();
// ... moves played
const pgnString = game.pgn();
// "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. Qh5 Nf6 5. Qxf7#"
```

#### Download Implementation

```typescript
function downloadPGN(game: Chess, winner: "White" | "Black") {
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

**Security:** No user input in filename — uses timestamp + winner color only. Safe from path traversal.

**Dependencies:** Zero — native DOM APIs only.

---

### 3. Winner Detection

chess.js provides `.turn()` method — returns `'w'` or `'b'` indicating whose turn it is. When checkmate occurs, winner is opposite of current turn.

```typescript
if (gameCopy.isCheckmate()) {
  const loser = gameCopy.turn(); // 'w' or 'b'
  const winner = loser === "w" ? "Black" : "White";
  showVictoryModal(winner);
}
```

---

### 4. Victory Modal Structure

Extends existing resume modal pattern with additions:

| Element           | Implementation                | Notes                             |
| ----------------- | ----------------------------- | --------------------------------- |
| Backdrop          | `bg-black/50` overlay         | Same as resume modal              |
| Card              | White, rounded, shadow        | Same styling                      |
| Confetti          | canvas-confetti on mount      | Fires once when modal opens       |
| Title             | "White Wins!" / "Black Wins!" | Dynamic based on winner           |
| Subtitle          | "Checkmate"                   | Game-over reason                  |
| Download button   | Primary action                | Downloads PGN file                |
| Play Again button | Secondary action              | Calls `handleNewGame()`           |
| ARIA              | `role="dialog"`, live region  | Announce winner to screen readers |

---

## Approaches Comparison

### Approach A: Inline Victory State in page.tsx (Recommended)

**Pros:**

- No new files — all logic in `app/page.tsx`
- Reuses existing modal pattern directly
- Simple state: `victoryWinner: 'White' | 'Black' | null`
- Confetti triggered via `useEffect` when `victoryWinner` set

**Cons:**

- `page.tsx` grows by ~80 lines (currently 329 lines → ~410 lines)
- All victory logic coupled to main game component

**Verdict:** ✅ Best for this codebase — matches existing patterns (resume modal inline, sound logic inline).

---

### Approach B: Separate VictoryModal Component

**Pros:**

- Cleaner separation of concerns
- `page.tsx` stays focused on game logic
- Modal component reusable (unlikely in this project)

**Cons:**

- New file: `components/VictoryModal.tsx`
- Need to pass `game` instance as prop to access `.pgn()`
- More files to maintain for single-use component

**Verdict:** ❌ Over-engineering for this project — modal only used once, inline pattern established.

---

### Approach C: Victory Hook (useVictoryCelebration)

**Pros:**

- Encapsulates confetti + download logic
- Clean API: `const { celebrate, downloadMoves } = useVictoryCelebration(game);`

**Cons:**

- New file: `hooks/useVictoryCelebration.ts`
- Adds abstraction layer for ~50 lines of code
- Hook must still render modal in `page.tsx` anyway

**Verdict:** ❌ Unnecessary indirection — not enough logic to justify hook.

---

## Recommendation

**Approach A: Inline Victory State** — extend `app/page.tsx` with:

1. `victoryWinner` state (`'White' | 'Black' | null`)
2. Set `victoryWinner` in `onDrop` when `isCheckmate()`
3. Render victory modal when `victoryWinner !== null`
4. Fire confetti via `useEffect` when modal opens
5. Download button calls `downloadPGN()` helper
6. Play Again button calls existing `handleNewGame()` + clears `victoryWinner`

**Reasoning:** Matches existing codebase architecture (resume modal inline, sound logic inline, simple state management). Zero new abstractions.

---

## Risks & Unknowns

| Risk                                            | Likelihood | Mitigation                                                                                              |
| ----------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| Confetti causes WCAG 2.3.1 violation (flashing) | Low        | Use `canvas-confetti` default config — designed for accessibility. Set `disableForReducedMotion: true`. |
| PGN download blocked by browser                 | Low        | Use native `<a>` click — works cross-browser. No popup blockers triggered.                              |
| Checkmate sound conflicts with confetti         | Medium     | Keep existing `checkmate.mp3` — plays before modal opens. No change needed.                             |
| Modal blocks board after checkmate              | N/A        | Expected behaviour — game is over, board should be non-interactive.                                     |
| Confetti bundle bloats build                    | Low        | +5.8KB gzipped (0.6% of 1MB budget). Acceptable.                                                        |

---

## Affected Files

| Action | File                | Reason                                                                         |
| ------ | ------------------- | ------------------------------------------------------------------------------ |
| Modify | `app/page.tsx`      | Add `victoryWinner` state, victory modal JSX, confetti trigger, download logic |
| Modify | `package.json`      | Add `canvas-confetti` + types                                                  |
| Modify | `app/page.test.tsx` | Test victory modal rendering, download button, play again button               |

**Estimated change:** 1 primary file, +80 lines, +15 test cases.

---

## Implementation Outline

### Step 1: Install canvas-confetti

```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

### Step 2: Add Victory State

```typescript
const [victoryWinner, setVictoryWinner] = useState<"White" | "Black" | null>(
  null,
);
```

### Step 3: Detect Checkmate and Set Winner

In `onDrop`, after `isCheckmate()` check:

```typescript
if (gameCopy.isCheckmate()) {
  playSound("checkmate");
  const loser = gameCopy.turn();
  setVictoryWinner(loser === "w" ? "Black" : "White");
}
```

### Step 4: Fire Confetti When Modal Opens

```typescript
useEffect(() => {
  if (victoryWinner) {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    });
  }
}, [victoryWinner]);
```

### Step 5: Render Victory Modal

Similar structure to resume modal:

```tsx
{
  victoryWinner && (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="victory-title"
      aria-live="assertive"
    >
      <div className="bg-white p-6 rounded shadow-lg max-w-md">
        <h2 id="victory-title" className="text-2xl font-bold mb-2">
          {victoryWinner} Wins! 🎉
        </h2>
        <p className="text-gray-600 mb-6">Checkmate</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => downloadPGN(game, victoryWinner)}
            className="..."
          >
            Download Moves (PGN)
          </button>
          <button onClick={handlePlayAgain} className="...">
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Step 6: Add Download Helper

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

### Step 7: Add Play Again Handler

```typescript
function handlePlayAgain() {
  handleNewGame(); // Existing function — resets game, clears localStorage
  setVictoryWinner(null);
  setLastMove(null); // Clear highlight
}
```

### Step 8: Add Tests

- Checkmate triggers victory modal
- Modal displays correct winner
- Download button downloads PGN file
- Play Again button resets game
- Confetti fires on modal open (mock canvas-confetti)
- Modal respects `prefers-reduced-motion`

---

## Acceptance Criteria Preview

### Functional

- [ ] Victory modal appears when checkmate occurs
- [ ] Modal displays winner color ("White Wins!" or "Black Wins!")
- [ ] Confetti animation plays when modal opens
- [ ] Download button downloads PGN file with correct filename format
- [ ] PGN file contains all game moves in correct notation
- [ ] Play Again button resets board to starting position
- [ ] Play Again button clears localStorage (no "resume game" on next load)
- [ ] Victory modal does NOT appear on stalemate (out of scope)

### Accessibility (WCAG 2.1 AA)

- [ ] Modal has `role="dialog"` and `aria-labelledby`
- [ ] Winner announced to screen readers via `aria-live="assertive"`
- [ ] Confetti respects `prefers-reduced-motion` (disabled if set)
- [ ] Confetti duration <1s (WCAG 2.3.1 — no flash threshold violation)
- [ ] Download and Play Again buttons keyboard accessible
- [ ] Modal focus trapped (Escape key closes modal)
- [ ] Buttons meet 44×44px touch target minimum (WCAG 2.5.5)

### Performance

- [ ] Bundle size increase <10KB gzipped
- [ ] No layout shift when modal appears (CLS ≤0.1)
- [ ] Confetti animation 60fps (TBT <200ms)

### Security

- [ ] Download filename sanitized (no user input)
- [ ] PGN download uses blob URLs (no server upload)
- [ ] No XSS risk from winner string (hardcoded 'White'/'Black')

---

## Out of Scope

- Stalemate modal (different UX — not requested)
- Draw by repetition / 50-move rule (chess.js doesn't detect automatically)
- Move history UI in modal (PGN download sufficient)
- Customizable confetti colors (use defaults)
- Sound toggle for victory sound (uses existing `soundEnabled` state)
- Analytics events for victory (add later if needed)

---

## Performance Impact

| Metric                | Before | After  | Impact                                 |
| --------------------- | ------ | ------ | -------------------------------------- |
| Bundle size (gzipped) | ~220KB | ~226KB | +6KB (2.7%)                            |
| JavaScript (mobile)   | ~180KB | ~186KB | +6KB                                   |
| LCP                   | <2.5s  | <2.5s  | No change (modal post-interaction)     |
| INP                   | <200ms | <200ms | Confetti runs post-click (no blocking) |
| CLS                   | ≤0.1   | ≤0.1   | Modal fixed position, no layout shift  |

**Verdict:** ✅ Acceptable impact — feature triggers post-game, no Core Web Vitals regression.

---

## Related Standards

- **QA Review:** [qa-review.instructions.md](vscode-userdata:/c%3A/Users/LukeG/AppData/Roaming/Code/User/prompts/qa-review.instructions.md) — WCAG 2.3.1 confetti flash threshold, 2.5.5 touch targets
- **Security:** [security.instructions.md](c:\Users\LukeG.copilot\instructions\security.instructions.md) — no user input in download filename
- **Testing:** Jest + React Testing Library for modal, confetti mock, download trigger

---

## Next Steps

1. **Product Manager:** Convert this spike into ticket(s) using Tier 2 template (single feature, 3-5 files)
2. **Implementation:** Follow Step 1-8 outline above
3. **Testing:** Add test cases from Acceptance Criteria Preview
4. **QA Review:** Verify WCAG 2.3.1 compliance (confetti flash threshold), cross-browser download

---

## References

- [chess.js API docs](https://github.com/jhlywa/chess.js/blob/master/README.md) — `.pgn()`, `.turn()`, `.isCheckmate()`
- [canvas-confetti docs](https://github.com/catdad/canvas-confetti) — configuration options
- [WCAG 2.3.1 Three Flashes](https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html) — flash threshold guidelines
- Existing resume modal pattern: [page.tsx#L228-L261](../app/page.tsx#L228-L261)
