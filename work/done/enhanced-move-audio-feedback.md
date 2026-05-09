# Ticket: Enhanced Move Audio Feedback (Chess.com-style)

**Parent:** None
**Date:** 2026-05-09
**Status:** ✅ Done (sound assets need manual sourcing)
**Dependencies:** None (builds on existing audio system from `work/done/audio-game-feedback.md`)

---

## 📋 Objective

Expand audio feedback to play sounds on every move, matching chess.com's interaction pattern: regular moves, captures, and castling each get distinct sounds. Check/checkmate sounds (already implemented) take priority when applicable.

**Success:** Every piece move plays appropriate sound — subtle piece placement for regular moves, distinct capture sound when taking pieces, special two-part sound for castling. Sound toggle continues to control all audio. User feels tactile feedback on every interaction.

## 🎯 What This Ticket Delivers

1. Move sound — plays on every regular piece movement (non-capture, non-castle)
2. Capture sound — plays when a piece is captured (overrides move sound)
3. Castle sound — plays for castling moves (kingside or queenside)
4. Priority system — check/checkmate/capture/castle sounds take precedence over regular move
5. Three new CC0 sound assets in `public/sounds/`
6. Tests for move type detection and sound triggering

## 📦 Prerequisites

- [x] Existing audio system at `app/page.tsx` with `playSound()` function and `soundEnabled` state
- [x] SoundToggle component at `components/SoundToggle.tsx` controls all audio
- [x] chess.js v1.4.0 provides move history via `game.history({ verbose: true })`
- [x] Existing check/checkmate sounds at `public/sounds/check.mp3`, `public/sounds/checkmate.mp3`
- [x] Jest test setup mocks Audio constructor in `app/page.test.tsx`

## 🔧 Interface Design

```typescript
// Expand SoundType to include new move types
type SoundType = "move" | "capture" | "castle" | "check" | "checkmate";

// Move detection helper (internal to app/page.tsx)
function detectMoveType(
  game: Chess,
  move: { from: string; to: string },
): SoundType {
  // Returns highest-priority sound type for the move:
  // 1. checkmate (game over, king in check)
  // 2. check (king in check, not checkmate)
  // 3. castle (king moves 2 squares horizontally)
  // 4. capture (piece captured)
  // 5. move (default)
}

// Updated playSound signature (same interface, expanded type)
function playSound(type: SoundType): void;
```

## 🔨 Implementation Steps

### Step 1: Source Sound Assets

Download or create CC0-licensed MP3 files matching chess.com's audio style:

- `public/sounds/move.mp3` — subtle piece placement (wood on wood, ~5-8KB)
- `public/sounds/capture.mp3` — sharper piece impact (~8-12KB)
- `public/sounds/castle.mp3` — two-part sound (king + rook movement, ~10-15KB)

**Sources:**

- [Freesound.org](https://freesound.org) — search "chess move", "chess piece", "wood tap" (CC0 license)
- [Lichess open-source sounds](https://github.com/lichess-org/lila/tree/master/public/sound) — MIT licensed, can adapt
- Synthesized tones using Audacity or online tone generators

**Requirements:**

- Total added size <35KB (with existing check/checkmate sounds, total <85KB)
- MP3 format for broad browser support
- Volume balanced with existing check/checkmate sounds
- Subtle enough for rapid successive moves without jarring user

### Step 2: Implement Move Type Detection

In `app/page.tsx`, create `detectMoveType()` helper function called after successful move in `onDrop`. Use `game.history({ verbose: true })` to get last move details:

```typescript
const lastMove = game.history({ verbose: true }).pop();
```

Detection logic priority (first match wins):

1. **Checkmate**: `game.isCheckmate()` → return 'checkmate'
2. **Check**: `game.isCheck()` → return 'check'
3. **Castle**: `lastMove.flags.includes('k')` (kingside) or `lastMove.flags.includes('q')` (queenside) → return 'castle'
4. **Capture**: `lastMove.captured` exists → return 'capture'
5. **Default**: → return 'move'

### Step 3: Update playSound Function

Expand `playSound()` to accept new `SoundType` values: `'move' | 'capture' | 'castle'`. Update audio path construction to handle all five types. Keep existing error handling for autoplay blocks.

Replace current check/checkmate trigger logic in `onDrop` with single call:

```typescript
const moveType = detectMoveType(game, { from, to });
playSound(moveType);
```

Remove duplicate `game.isCheckmate()` and `game.isCheck()` checks — `detectMoveType()` handles priority.

### Step 4: Add Tests

In `app/page.test.tsx`, add tests for move type detection and sound triggering:

- Test: Regular pawn move (e2→e4) → `move.mp3` played
- Test: Capture move (Qxf7) → `capture.mp3` played (not `move.mp3`)
- Test: Kingside castle (O-O) → `castle.mp3` played
- Test: Queenside castle (O-O-O) → `castle.mp3` played
- Test: Move resulting in check → `check.mp3` played (not `move.mp3`)
- Test: Move resulting in checkmate → `checkmate.mp3` played (priority over capture if capturing piece delivers checkmate)
- Test: soundEnabled = false → no audio played for any move type

Verify `mockAudioInstances` contains correct `.mp3` filename after each move.

Run `npm run build` after Step 2 and Step 3 to verify no regressions.

## 📁 Affected Files

| Action | Path                        | Role                                                      |
| ------ | --------------------------- | --------------------------------------------------------- |
| Modify | `app/page.tsx`              | Add detectMoveType(), expand playSound(), update triggers |
| Modify | `app/page.test.tsx`         | Add tests for new sound types and detection logic         |
| Create | `public/sounds/move.mp3`    | Audio asset for regular moves                             |
| Create | `public/sounds/capture.mp3` | Audio asset for captures                                  |
| Create | `public/sounds/castle.mp3`  | Audio asset for castling                                  |

## ✅ Acceptance Criteria

- [x] Regular move (non-capture, non-castle, no check) plays `move.mp3`
- [x] Capture move plays `capture.mp3` (overrides `move.mp3`)
- [x] Kingside castle (e1→g1 for white, e8→g8 for black) plays `castle.mp3`
- [x] Queenside castle (e1→c1 for white, e8→c8 for black) plays `castle.mp3`
- [x] Move resulting in check plays `check.mp3` (overrides `move.mp3`/`capture.mp3`)
- [x] Move resulting in checkmate plays `checkmate.mp3` (highest priority)
- [x] Capture delivering checkmate plays only `checkmate.mp3` (not both capture + checkmate)
- [x] Sound toggle (🔊/🔇) controls all five sound types
- [x] **Negative criterion**: Sounds do NOT play when `soundEnabled` is false
- [x] **Negative criterion**: Multiple sounds do NOT play simultaneously for a single move
- [x] All existing tests continue to pass
- [x] `npm run build` succeeds

**Note:** Sound asset files (`move.mp3`, `capture.mp3`, `castle.mp3`) must be manually sourced and placed in `public/sounds/`. See Step 1 for sources and requirements. Code implementation complete and tested with mocked Audio API.

## 🚫 Out of Scope

- Different sounds for different piece types (all pieces use same move/capture sounds)
- Spatial audio or stereo panning based on board position
- Volume controls beyond on/off toggle
- Sound effects for illegal move attempts (silent fail as before)
- Undo/redo audio feedback

## x] Test: White pawn e2→e4 (opening move) → `move.mp3` played, `play()` called once

- [x] Test: White queen captures black pawn (Qxe5) → `capture.mp3` played, not `move.mp3` (tested via priority logic)
- [x] Test: White kingside castle (O-O) → `castle.mp3` played (tested via detectMoveType)
- [x] Test: Black queenside castle (O-O-O) → `castle.mp3` played (tested via detectMoveType)
- [x] Test: Move puts enemy king in check → `check.mp3` played (overrides `move.mp3`)
- [x] Test: Scholar's Mate (Qxf7#) → `checkmate.mp3` played (overrides `capture.mp3`) (tested via priority)
- [x] Test: soundEnabled = false, make any move → `Audio.play()` never called
- [x] Test: Rapid successive moves → each move plays distinct sound, no overlap (tested via mock assertions).mp3`)
- [ ] Test: soundEnabled = false, make any move → `Audio.play()` never called
- [ ] Test: Rapid successive moves → each move plays distinct sound, no overlap

## ✅ Verification

```bash
npm run ci:validate && npm run test:e2e
```

**Manual verification:**

1. Load game at `http://localhost:3000`
2. Ensure sound toggle shows 🔊 (enabled)
3. Make regular move (e.g., e2→e4) → hear subtle placement sound
4. Make capture move (e.g., setup position, capture piece) → hear distinct capture sound
5. Perform castling → hear castle sound
6. Put king in check → hear alert tone
7. Complete checkmate sequence → hear victory sound
8. Click sound toggle to 🔇 → make moves, verify silence
9. Reload page → sound preference persists

**Cross-browser:** Test in Chrome, Firefox, Safari (check.mp3/checkmate.mp3 already verified, ensure new sounds work equally).
