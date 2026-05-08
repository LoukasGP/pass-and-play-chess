# Game State Persistence

**Date:** 2026-05-08
**Status:** 🔴 Not Started
**Spike:** [game-state-persistence.md](../spike/game-state-persistence.md)
**Dependencies:** None

---

## 📋 Objective

Persist chess game state across page refreshes and browser restarts so users can resume interrupted games. Currently, refreshing page or closing laptop resets board to starting position — users lose their game progress.

**Success:** User plays 5 moves, closes browser, reopens app → sees "Resume last game?" modal. Clicking "Resume" restores exact board state. Clicking "New Game" starts fresh.

## 🎯 What This Ticket Delivers

1. Auto-save game state to sessionStorage on every move (survives page refresh)
2. Persist last game to localStorage on tab close (survives browser restart)
3. Resume modal on app launch when saved game detected
4. FEN validation with graceful fallback for corrupted data
5. Complete test coverage for persistence flows

## 📦 Prerequisites

- [x] chess.js provides `game.fen()` serialization — [app/page.tsx](../app/page.tsx#L27)
- [x] chess.js accepts FEN string in constructor: `new Chess(fenString)`
- [x] Web Storage API (sessionStorage, localStorage) universally supported
- [x] Existing `useState` for game state — [app/page.tsx](../app/page.tsx#L8)

## 🔧 Interface Design

```typescript
// Storage keys (constants)
const STORAGE_KEYS = {
  SESSION_FEN: "chess_game_fen",
  SESSION_TIMESTAMP: "chess_game_timestamp",
  LOCAL_FEN: "chess_game_last_fen",
  LOCAL_TIMESTAMP: "chess_game_last_timestamp",
} as const;

// Saved game data structure
interface SavedGame {
  readonly fen: string;
  readonly timestamp: string;
}

// Resume modal state
interface ResumeModalProps {
  readonly savedGame: SavedGame;
  readonly onResume: () => void;
  readonly onNewGame: () => void;
}
```

## 🔨 Implementation Steps

### Step 1: Auto-save to sessionStorage

Add `useEffect` hook that runs on every `game` state change:

- Serialize current position with `game.fen()`
- Save to `sessionStorage.chess_game_fen`
- Save current timestamp to `sessionStorage.chess_game_timestamp`
- Wrap in try/catch for quota errors (ignore failures gracefully)
- SSR guard: `if (typeof window === 'undefined') return`

**Contract:**

```typescript
useEffect(() => {
  // Save game.fen() to sessionStorage
}, [game]);
```

### Step 2: Check for saved game on mount

Add `useEffect(() => {...}, [])` that runs once on mount:

- Check `localStorage.chess_game_last_fen` for saved game
- If found, store in component state: `setSavedGame({ fen, timestamp })`
- Show resume modal: `setShowResumeModal(true)`
- If not found, start new game (current behavior)
- Validate FEN before showing modal (Step 4)

### Step 3: Persist to localStorage on tab close

Add `beforeunload` event listener:

- Copy `sessionStorage.chess_game_fen` → `localStorage.chess_game_last_fen`
- Copy timestamp too
- Wrap in try/catch (incognito mode may block localStorage)

**Contract:**

```typescript
useEffect(() => {
  const handleBeforeUnload = () => {
    // Copy sessionStorage → localStorage
  };
  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, []);
```

### Step 4: Resume modal UI

Add modal component (inline in page.tsx or extract to `components/ResumeModal.tsx`):

- Fixed overlay (`fixed inset-0 bg-black/50 z-50`)
- White card with shadow
- Heading: "Resume last game?"
- Timestamp display: `new Date(parseInt(timestamp)).toLocaleString()`
- Two buttons: "Resume" (primary blue) | "New Game" (secondary gray)
- **Accessibility:**
  - `role="dialog"`
  - `aria-labelledby` on heading
  - Focus trap (Tab cycles between buttons)
  - Escape key dismisses (defaults to New Game)
- `handleResume`: Load FEN → `setGame(new Chess(savedGame.fen))`
- `handleNewGame`: Clear localStorage, start fresh

Run `npm run build` after this step to verify no regressions.

### Step 5: FEN validation & error handling

Wrap FEN loading in validation:

```typescript
try {
  const restoredGame = new Chess(savedGame.fen);
  setGame(restoredGame);
  setShowResumeModal(false);
} catch (error) {
  console.warn("Corrupted FEN detected, starting new game:", error);
  localStorage.removeItem("chess_game_last_fen");
  localStorage.removeItem("chess_game_last_timestamp");
  handleNewGame();
}
```

### Step 6: Test coverage

Expand `app/page.test.tsx`:

- Mock Web Storage API (`localStorage`, `sessionStorage`)
- Test: Make move → verify `sessionStorage.setItem` called with FEN
- Test: Mount with saved FEN → modal appears
- Test: Click "Resume" → game loads with saved position
- Test: Click "New Game" → starts fresh, clears localStorage
- Test: Corrupted FEN → falls back to new game, doesn't crash
- Test: localStorage unavailable (incognito) → sessionStorage still works
- Test: `beforeunload` event → copies sessionStorage → localStorage

## 📁 Affected Files

| Action | Path                | Role                                              |
| ------ | ------------------- | ------------------------------------------------- |
| Modify | `app/page.tsx`      | Add storage hooks, resume modal, validation logic |
| Modify | `app/page.test.tsx` | Add tests for persistence flows                   |

## ✅ Acceptance Criteria

- [ ] Game auto-saves to sessionStorage on every move (no user action required)
- [ ] Page refresh preserves game state (reads from sessionStorage)
- [ ] Browser close → reopen shows "Resume last game?" modal
- [ ] "Resume" button restores exact board position from localStorage
- [ ] "New Game" button starts fresh game and clears saved state
- [ ] Modal displays human-readable timestamp of last game
- [ ] Modal keyboard accessible (Tab, Enter, Escape)
- [ ] Escape key dismisses modal and starts new game
- [ ] Corrupted FEN gracefully falls back to new game (doesn't crash)
- [ ] Incognito mode: sessionStorage works, localStorage failure doesn't break app
- [ ] Multiple tabs: each tab has independent sessionStorage (don't interfere)
- [ ] **Negative:** Page doesn't prompt to resume if no saved game exists
- [ ] **Negative:** Modal doesn't appear on every page load (only when saved game exists)
- [ ] `npm run build` succeeds

## 🚫 Out of Scope

- Saving multiple games (only most recent game persisted)
- Undo/redo functionality (separate feature)
- Move history display (separate feature)
- Sync across devices (requires backend)
- Named save slots ("Game 1", "Game 2")

## 🧪 Test Cases

- [ ] Test: Make 3 moves, refresh page → board shows same position
- [ ] Test: Make 5 moves, close browser, reopen → modal appears with correct timestamp
- [ ] Test: Click "Resume" on modal → board restores exact position (white's turn if 5 moves)
- [ ] Test: Click "New Game" on modal → board resets to starting position
- [ ] Test: Save corrupted FEN to localStorage, reload → starts new game without error
- [ ] Test: Block localStorage (simulate incognito), make moves, refresh → game still persists via sessionStorage
- [ ] Test: Open two tabs, make different moves in each → tabs don't interfere (each has own sessionStorage)
- [ ] Test: First visit (no saved game) → no modal, board starts at default position

## ✅ Verification

```bash
npm run lint
npm test
npm run build
```

**Manual verification:**

1. `npm run dev`
2. Make 5 moves on board
3. Hard refresh (Ctrl+R) → board shows same 5 moves
4. Close browser tab completely
5. Reopen http://localhost:3000
6. See "Resume last game?" modal with timestamp
7. Click "Resume" → board shows same 5 moves
8. Make 2 more moves (7 total)
9. Close browser tab
10. Reopen → modal shows updated timestamp (7 moves preserved)
11. Click "New Game" → board resets to starting position
12. Close browser, reopen → no modal (localStorage cleared)
