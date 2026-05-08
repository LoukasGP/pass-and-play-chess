# Game State Persistence — Spike

**Date:** 2026-05-08
**Type:** Spike / Investigation
**Status:** 📋 Research Complete

---

## Problem Statement

Currently, game state resets on page reload. Users lose their game if they:

- Accidentally refresh the browser
- Navigate away and return
- Close the tab and reopen
- Experience browser crash or power loss

**Desired:** Users see option to resume existing game or start new game when returning to app.

## Research Findings

### Current State

**Game state stored in React useState:**

```typescript
const [game, setGame] = useState(new Chess());
```

**Game object contains:**

- Board position (FEN notation)
- Move history
- Turn order (white/black)
- Castling rights
- En passant target

**Already available:** `game.fen()` returns FEN string — compact serializable format ~100 bytes for typical mid-game position.

**Reconstruction:** `new Chess(fenString)` restores full game state.

### Browser Storage API Comparison

| Criteria              | sessionStorage                  | localStorage                 | IndexedDB                                  |
| --------------------- | ------------------------------- | ---------------------------- | ------------------------------------------ |
| **Persistence**       | Tab/window lifetime only        | Survives browser restarts    | Survives browser restarts                  |
| **Capacity**          | ~5–10 MB                        | ~5–10 MB                     | ~50 MB+ (quota-based)                      |
| **API Complexity**    | Simple (sync)                   | Simple (sync)                | Complex (async, transactions)              |
| **Use Case Fit**      | Resume after accidental refresh | Resume after browser restart | Large datasets, structured queries         |
| **Data Format**       | String only                     | String only                  | Any structured data                        |
| **Browser Support**   | Universal (IE8+)                | Universal (IE8+)             | Modern browsers (IE10+)                    |
| **Performance**       | Sync — no overhead              | Sync — no overhead           | Async — negligible overhead for small data |
| **Privacy/Incognito** | Works normally                  | **May be disabled/cleared**  | **May be disabled/cleared**                |
| **Tab Independence**  | Each tab isolated               | Shared across tabs           | Shared across tabs                         |

### Approach Comparison

| Criteria                         | Option A: sessionStorage Only | Option B: localStorage Only | Option C: Both (Hybrid)              |
| -------------------------------- | ----------------------------- | --------------------------- | ------------------------------------ |
| **Complexity**                   | Low                           | Low                         | Medium                               |
| **Resume after refresh**         | ✅ Yes                        | ✅ Yes                      | ✅ Yes                               |
| **Resume after browser restart** | ❌ No                         | ✅ Yes                      | ✅ Yes                               |
| **Resume in new tab**            | ❌ No                         | ✅ Yes                      | ✅ Yes                               |
| **Privacy mode resilience**      | ✅ Always works               | ⚠️ May be disabled          | ⚠️ Partial (sessionStorage fallback) |
| **Multi-game support**           | ✅ Each tab independent       | ❌ One game globally        | ⚠️ Requires UX for "which game?"     |
| **Implementation size**          | ~30 lines                     | ~30 lines                   | ~60 lines                            |
| **Risk of data loss**            | High (tab close)              | Low                         | Low                                  |

### Recommendation

**Option C: Hybrid (sessionStorage primary, localStorage backup)**

**Why:**

1. **sessionStorage** auto-saves every move — zero UX friction, works in privacy mode
2. **localStorage** persists last game position on tab close for "resume" UX on return
3. Handles both accidental refresh (common) and intentional return (valuable)
4. Falls back gracefully when localStorage unavailable (incognito mode)

**UX Flow:**

1. On mount: check `localStorage` for saved game
   - If found → show "Resume last game?" prompt (2 buttons: Resume | New Game)
   - If not found → start new game
2. Every move: save to `sessionStorage` (silent, no prompt)
3. On unmount/tab close: copy `sessionStorage` → `localStorage` (preserve last position)

**Storage keys:**

- `sessionStorage.chess_game_fen` — current tab's active game
- `sessionStorage.chess_game_timestamp` — last move timestamp
- `localStorage.chess_game_last_fen` — most recent game position across all sessions
- `localStorage.chess_game_last_timestamp` — when that game was last played

## Technical Architecture

### Data Flow

```
User makes move
    ↓
game.move() validates
    ↓
setGame(gameCopy)
    ↓
useEffect → sessionStorage.setItem('chess_game_fen', game.fen())
    ↓
(on tab close) → localStorage.setItem('chess_game_last_fen', game.fen())
```

**On mount:**

```
1. Check localStorage for chess_game_last_fen
2. If exists → show modal: "Resume game from [timestamp]?" | "Start new game"
3. If Resume → load FEN → new Chess(fen)
4. If New Game → new Chess() (default starting position)
5. After choice → sync to sessionStorage
```

### Affected Files / Areas

| File           | Change                                 | Reason                            |
| -------------- | -------------------------------------- | --------------------------------- |
| `app/page.tsx` | Add `useEffect` hooks for storage sync | Auto-save on move                 |
| `app/page.tsx` | Add mount logic to check localStorage  | Resume game prompt                |
| `app/page.tsx` | Add "Resume" modal/prompt component    | UX for continue vs new            |
| `app/page.tsx` | Add beforeunload listener (optional)   | Warn on accidental close mid-game |

**No new files needed** — all logic fits in existing `page.tsx`.

**Storage size:** ~100–150 bytes per saved game (FEN + timestamp).

### Code Sketch (Implementation Guide)

**Storage utilities:**

```typescript
// Save to sessionStorage on every move
useEffect(() => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem("chess_game_fen", game.fen());
    sessionStorage.setItem("chess_game_timestamp", Date.now().toString());
  } catch (e) {
    // Ignore quota/privacy errors
  }
}, [game]);

// On mount: check for saved game
useEffect(() => {
  if (typeof window === "undefined") return;

  const savedFen = localStorage.getItem("chess_game_last_fen");
  const savedTimestamp = localStorage.getItem("chess_game_last_timestamp");

  if (savedFen) {
    // Show resume modal (implement in Step 2)
    setShowResumeModal(true);
    setSavedGame({ fen: savedFen, timestamp: savedTimestamp });
  }
}, []);

// On tab close: persist to localStorage
useEffect(() => {
  if (typeof window === "undefined") return;

  const handleBeforeUnload = () => {
    try {
      const currentFen = sessionStorage.getItem("chess_game_fen");
      const currentTimestamp = sessionStorage.getItem("chess_game_timestamp");
      if (currentFen) {
        localStorage.setItem("chess_game_last_fen", currentFen);
        localStorage.setItem(
          "chess_game_last_timestamp",
          currentTimestamp || Date.now().toString(),
        );
      }
    } catch (e) {
      // Ignore errors
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, []);
```

**Resume modal:**

```typescript
{showResumeModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg">
      <h2 className="text-xl mb-4">Resume last game?</h2>
      <p className="text-sm text-gray-600 mb-4">
        Last played: {new Date(parseInt(savedGame.timestamp)).toLocaleString()}
      </p>
      <div className="flex gap-4">
        <button onClick={handleResume} className="px-4 py-2 bg-blue-600 text-white rounded">
          Resume
        </button>
        <button onClick={handleNewGame} className="px-4 py-2 bg-gray-300 rounded">
          New Game
        </button>
      </div>
    </div>
  </div>
)}
```

## Risks & Unknowns

| Risk                                                         | Likelihood | Impact   | Mitigation                                                                                              |
| ------------------------------------------------------------ | ---------- | -------- | ------------------------------------------------------------------------------------------------------- |
| **localStorage quota exceeded**                              | Low        | Low      | Try/catch blocks, graceful degradation to sessionStorage only                                           |
| **User in incognito mode**                                   | Medium     | Medium   | sessionStorage still works — only lose game on tab close (acceptable)                                   |
| **User plays multiple simultaneous games in different tabs** | Low        | Medium   | Currently unsupported — each tab overwrites localStorage. Future: array of saved games with unique IDs. |
| **Corrupted FEN string**                                     | Very Low   | Medium   | Validate FEN on load with `try { new Chess(fen) } catch { start new game }`                             |
| **User expects undo/redo**                                   | Medium     | Low      | Out of scope for this spike — different feature. Current: only resume from last position.               |
| **Sync between devices**                                     | Low        | High     | Not possible with Web Storage API — would require backend. Out of scope.                                |
| **Ad blocker interference**                                  | Very Low   | Very Low | Web Storage API unaffected by ad blockers                                                               |

**Unknown:** User expectation — do users want automatic resume or explicit save/load buttons?

- **Research needed:** Quick user survey or A/B test
- **Assumption for MVP:** Automatic resume is lower friction (follows mobile game UX patterns)

## Knowledge Base References

> Files from `knowledge/` that support ticket writing and implementation:

No `knowledge/` folder exists in workspace. Applicable patterns:

- **React hooks:** `useState`, `useEffect` for storage sync
- **Next.js client components:** `'use client'` directive already present in `app/page.tsx`
- **Error handling:** Try/catch for Web Storage API (may throw in incognito/quota scenarios)

## Standards & Compliance Notes

> Requirements from instruction files that apply to this feature:

### Security (`security.instructions.md`)

- ✅ No sensitive data in storage — only FEN notation (public board position)
- ✅ No user-controlled data stored — FEN validated by chess.js before saving
- ⚠️ No XSS risk — FEN is consumed by chess.js, not rendered to DOM directly

### Testing (`testing-standards.instructions.md`)

- **Unit tests:** Mock `localStorage` and `sessionStorage` (jsdom provides these)
- **E2E tests:** Playwright can manipulate storage via `page.evaluate()`
- **Edge cases to test:**
  - Valid FEN loads correctly
  - Corrupted FEN falls back to new game
  - localStorage unavailable (simulate quota error)
  - sessionStorage persists within tab lifecycle

### Performance

- **Impact:** Negligible — FEN string ~100 bytes, sync operations <1ms
- **Lighthouse:** No CLS, no blocking, no network requests
- **Core Web Vitals:** No impact (storage APIs are sync, non-rendering)

### Accessibility (WCAG 2.1 AA)

- Resume modal must have:
  - Keyboard navigation (Tab, Enter, Escape)
  - Focus trap while open
  - `role="dialog"`, `aria-labelledby`, `aria-describedby`
  - Escape key to dismiss (defaults to "New Game")

## Recommended Implementation Tickets

> High-level ticket breakdown for the planning phase.

### Ticket 1: Auto-Save to sessionStorage

- **Scope:** Add `useEffect` to save game FEN to `sessionStorage` on every move
- **Files:** `app/page.tsx` (modify)
- **Key outcomes:**
  - Game persists across accidental page refresh
  - No UX changes (silent background save)
  - Try/catch handles quota errors gracefully

### Ticket 2: Resume Modal & localStorage Integration

- **Scope:**
  - Check `localStorage` on mount for saved game
  - Show modal if saved game exists: "Resume" vs "New Game"
  - On tab close, copy `sessionStorage` → `localStorage`
- **Files:**
  - `app/page.tsx` (modify — add modal JSX, resume logic)
  - Optional: Extract `<ResumeModal>` to `components/ResumeModal.tsx` if grows large
- **Key outcomes:**
  - Users see resume option when returning after browser restart
  - Modal accessible (keyboard nav, focus management)
  - Graceful fallback if localStorage unavailable

### Ticket 3: FEN Validation & Error Handling

- **Scope:**
  - Validate loaded FEN with `try { new Chess(fen) } catch { ... }`
  - Clear corrupted data from storage
  - Log errors (console.warn) for debugging
- **Files:** `app/page.tsx` (modify resume logic)
- **Key outcomes:**
  - Corrupted FEN doesn't crash app
  - User always gets playable board (new game if FEN invalid)

### Ticket 4: Testing Coverage

- **Scope:**
  - Unit tests: Mock storage APIs, test save/load/resume flows
  - Test edge cases: corrupted FEN, quota errors, incognito mode
  - E2E test: Playwright simulates refresh and verifies game resumes
- **Files:**
  - `app/page.test.tsx` (expand existing tests)
  - `tests/e2e/game-persistence.spec.ts` (new — if E2E tests exist)
- **Key outcomes:**
  - 90%+ test coverage for new storage code
  - All edge cases validated

---

## Summary

**Feasibility:** ✅ High — APIs well-supported, chess.js FEN serialization already available.

**Complexity:** 🟡 Low-Medium — ~60–80 lines of code across 2–3 tickets.

**User Value:** 🎯 High — fixes #1 user pain point (game loss on refresh).

**Risk:** 🟢 Low — graceful fallbacks, no backend required, isolated changes.

**Recommendation:** Proceed with Option C (Hybrid sessionStorage + localStorage). Implement in 3 tickets: auto-save → resume modal → validation/testing.

**Next Step:** Hand off to Product Manager to write implementation tickets from this spike.
