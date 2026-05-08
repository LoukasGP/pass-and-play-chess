# Offline Two-Player Chess Board

**Date:** 2026-05-05
**Status:** 🔴 Not Started
**Route:** `/` (root)

---

## 📋 Objective

Replace default Next.js page with fullscreen offline chess board. Two players sitting next to each other can play chess using drag-and-drop. Nothing else on screen—just the board.

**Success:** Launch app, see chessboard filling viewport, drag pieces to make valid moves, no UI controls or status indicators visible.

## 📁 Affected Files

| Action | Path                | Role                                                    |
| ------ | ------------------- | ------------------------------------------------------- |
| Modify | `package.json`      | Add chess.js (game logic) + react-chessboard (UI)      |
| Modify | `app/page.tsx`      | Replace with ChessBoard component, fullscreen layout    |
| Modify | `app/layout.tsx`    | Remove custom fonts, simplify to bare minimum           |

## ✅ Acceptance Criteria

- [ ] `chess.js` latest version installed (^1.0.0 or higher if available)
- [ ] `react-chessboard` latest version installed
- [ ] Board fills viewport with no scrollbars (responsive sizing)
- [ ] Drag-and-drop piece movement works—illegal moves rejected
- [ ] Page displays only chessboard—no headers, buttons, text, or controls
- [ ] White pieces start at bottom, black at top (no rotation)

## 🧪 Test Cases

- [ ] Test: Valid move (e4) via drag → piece moves, position updates
- [ ] Test: Invalid move (knight to illegal square) → piece snaps back
- [ ] Test: Viewport resize → board scales to fit without scroll

## ✅ Verification

```bash
npm run build
```

Manual verification:
1. `npm run dev`
2. Open http://localhost:3000
3. Drag white pawn from e2 to e4 → succeeds
4. Drag white pawn from e4 to e6 (illegal) → snaps back
5. Resize browser → board scales proportionally
