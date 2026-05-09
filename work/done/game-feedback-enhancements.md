# Spike: Game Feedback Enhancements (Sound, Last Move, Turn Validation)

**Date:** 2026-05-08
**Status:** 🟢 Complete
**Researcher:** Scrum Master

---

## 🎯 Goal

Add game feedback features to pass-and-play chess board:

1. **Sound effects** — celebrate wins/checkmate
2. **Last move highlight** — visual indicator of previous move
3. **Turn validation popup** — notify when wrong player attempts move

---

## 📊 Codebase Discovery

### Current Implementation

| Component            | Library                  | Current State                        |
| -------------------- | ------------------------ | ------------------------------------ |
| **Chess Logic**      | chess.js v1.4.0          | ✅ Installed, handles validation     |
| **Board UI**         | react-chessboard v5.10.0 | ✅ Installed, supports custom styles |
| **Audio**            | None                     | ❌ Not implemented                   |
| **Notifications**    | None                     | ❌ Not implemented                   |
| **State Management** | React useState           | Minimal (game, moveCount)            |
| **Analytics**        | Google Analytics 4       | Tracks game_start, move_made events  |

### Relevant chess.js API

```typescript
game.isCheckmate(); // → boolean
game.isCheck(); // → boolean
game.isGameOver(); // → boolean (checkmate, stalemate, draw)
game.turn(); // → 'w' | 'b'
game.history({ verbose: true }); // → array of move objects with from/to squares
```

### Relevant react-chessboard API

```typescript
<Chessboard
  options={{
    position: game.fen(),
    onPieceDrop: handleDrop,
    customSquareStyles: {  // ← For last move highlight
      'e2': { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
      'e4': { backgroundColor: 'rgba(255, 255, 0, 0.4)' }
    }
  }}
/>
```

### Existing Patterns

**Analytics events** — already fire `game_start`, `move_made` to GA4. Can add `checkmate`, `stalemate` events.

**Responsive layout** — 3-column flex (ads | board | ads). Popup should overlay without disrupting layout.

**Testing** — Jest + React Testing Library. Tests mock chessboard, verify move handling, layout.

---

## 🔍 Feasibility Analysis

### 1. Sound Effects

**Goal:** Play audio on checkmate/check/win to celebrate outcome.

#### Approach A: Native HTML5 Audio API

**Implementation:**

```typescript
const playSound = (type: "move" | "check" | "checkmate") => {
  const audio = new Audio(`/sounds/${type}.mp3`);
  audio.play().catch(() => {
    /* browser blocked autoplay */
  });
};
```

**Pros:**

- Zero dependencies
- Lightweight (<10KB per MP3)
- Fast implementation

**Cons:**

- Verbose API for multiple sounds
- No audio sprite support
- Browser autoplay policies block until user interacts

#### Approach B: howler.js Library

**Implementation:**

```typescript
import { Howl } from "howler";

const sounds = {
  move: new Howl({ src: ["/sounds/move.mp3"] }),
  check: new Howl({ src: ["/sounds/check.mp3"] }),
  checkmate: new Howl({ src: ["/sounds/checkmate.mp3"] }),
};

sounds.checkmate.play();
```

**Pros:**

- Handles browser autoplay gracefully
- Audio sprite support (all sounds in one file)
- Better mobile support
- Volume/fade controls

**Cons:**

- +24KB gzipped bundle size
- Overkill for 2-3 sound effects

#### Approach C: react-use-audio-player

**Implementation:**

```typescript
import { useAudioPlayer } from "react-use-audio-player";

const { play } = useAudioPlayer();
play("/sounds/checkmate.mp3");
```

**Pros:**

- React-friendly hooks API
- Handles loading states

**Cons:**

- +8KB bundle size
- Still uses Web Audio API under the hood (same autoplay issues)

#### Audio Assets

**Sources:**

- Free: [Freesound.org](https://freesound.org), [Zapsplat](https://www.zapsplat.com)
- License: CC0 or royalty-free
- Format: MP3 (best browser support)
- Size target: <50KB total for all sounds

**Sounds needed:**

- `move.mp3` — subtle click (optional, for every move)
- `check.mp3` — alert tone (king in check)
- `checkmate.mp3` — victory fanfare (game over)

---

### 2. Last Move Highlight

**Goal:** Highlight squares of the most recent move (from → to).

#### Approach A: react-chessboard customSquareStyles

**Implementation:**

```typescript
const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)

function onDrop({ sourceSquare, targetSquare }) {
  // ... move logic ...
  if (move) {
    setLastMove({ from: sourceSquare, to: targetSquare })
  }
}

<Chessboard
  options={{
    position: game.fen(),
    onPieceDrop: onDrop,
    customSquareStyles: lastMove ? {
      [lastMove.from]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
      [lastMove.to]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' }
    } : {}
  }}
/>
```

**Pros:**

- Zero dependencies (built into react-chessboard)
- Configurable colors
- Clears automatically on next move

**Cons:**

- None — this is the standard pattern

#### Styling Considerations

| Color                           | Use Case           | Contrast Ratio         |
| ------------------------------- | ------------------ | ---------------------- |
| Yellow (rgba(255, 255, 0, 0.4)) | Last move          | 4.5:1 on light squares |
| Green (rgba(155, 199, 0, 0.4))  | Valid move targets | Lichess pattern        |
| Red (rgba(255, 0, 0, 0.4))      | King in check      | Chess.com pattern      |

**Recommendation:** Yellow for last move (industry standard). Consider adding red highlight for king in check as enhancement.

---

### 3. Turn Validation Popup

**Goal:** Show message when player clicks opponent's piece ("It's White's turn" / "It's Black's turn").

#### Detection Logic

```typescript
function onDrop({ sourceSquare, targetSquare }) {
  const piece = game.get(sourceSquare);
  const currentTurn = game.turn(); // 'w' or 'b'

  // Check if piece color matches current turn
  if (piece && piece.color !== currentTurn) {
    showTurnError(currentTurn === "w" ? "White" : "Black");
    return false;
  }

  // ... rest of move logic ...
}
```

#### Approach A: Native Browser Alert

**Implementation:**

```typescript
alert("White to move");
```

**Pros:**

- Zero dependencies
- Blocks interaction until dismissed
- Instant implementation

**Cons:**

- Ugly, breaks UX flow
- Not customizable
- Violates "zero distraction" positioning

#### Approach B: Custom Toast Component

**Implementation:**

```typescript
// components/Toast.tsx
const Toast = ({ message, onClose }) => (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
    {message}
  </div>
)

// Auto-dismiss after 2s
useEffect(() => {
  if (toastMessage) {
    const timer = setTimeout(() => setToastMessage(null), 2000)
    return () => clearTimeout(timer)
  }
}, [toastMessage])
```

**Pros:**

- No dependencies
- Full control over styling
- Non-blocking (auto-dismisses)
- Matches site branding

**Cons:**

- Need to implement ourselves (~50 lines)
- Accessibility requires ARIA live region

#### Approach C: sonner Library

**Implementation:**

```typescript
import { toast, Toaster } from 'sonner'

toast.error("White to move")

// In layout:
<Toaster position="top-center" />
```

**Pros:**

- Accessible by default (ARIA)
- Beautiful animations
- Stacking support (if multiple errors)
- +4KB gzipped

**Cons:**

- Another dependency
- Overkill for one message type

#### Approach D: react-hot-toast

**Implementation:**

```typescript
import toast, { Toaster } from "react-hot-toast";

toast("White to move", { icon: "♟️" });
```

**Pros:**

- Lightweight (3.5KB gzipped)
- Emoji support
- Simple API

**Cons:**

- Similar to sonner, still a dependency

#### Approach E: Inline Error Message (No Popup)

**Implementation:**

```typescript
<div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-lg">
  {turnError && <span className="text-red-600 font-bold">{turnError}</span>}
</div>
```

**Pros:**

- Minimal, non-intrusive
- No dependencies
- Matches "zero distraction" ethos

**Cons:**

- Easy to miss if not looking at bottom
- Needs prominent position

---

## 🎨 Design Considerations

### Sound Toggle

**Requirement:** Some users want silence. Need localStorage toggle.

```typescript
const [soundEnabled, setSoundEnabled] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("soundEnabled") !== "false";
  }
  return true;
});

const toggleSound = () => {
  const newValue = !soundEnabled;
  setSoundEnabled(newValue);
  localStorage.setItem("soundEnabled", String(newValue));
};
```

**UI:** Small icon in corner (🔊 / 🔇) — only control visible on board.

### Accessibility (WCAG 2.1 AA)

| Feature                 | Requirement                                        | Solution                                     |
| ----------------------- | -------------------------------------------------- | -------------------------------------------- |
| **Sound effects**       | 1.2.1: Audio-only content needs text alternative   | Add visual indicator (toast) alongside sound |
| **Turn popup**          | 4.1.3: Status messages programmatically determined | Use `aria-live="polite"` region              |
| **Last move highlight** | 1.4.11: Visual info has 3:1 contrast               | Yellow overlay on squares: 4.5:1 contrast    |

**Implementation:**

```tsx
<div aria-live="polite" className="sr-only">
  {ariaMessage}
</div>
```

### Mobile Considerations

- **Sound:** May not play until user interaction (tap to enable)
- **Popup:** Must not cover board — position at top with safe area
- **Touch targets:** Sound toggle button ≥44×44px

---

## ⚠️ Risks & Unknowns

| Risk                                                    | Likelihood | Impact | Mitigation                                                         |
| ------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------ |
| **Browser blocks sound autoplay**                       | High       | Medium | Show "tap to enable sound" on first load, use first move as unlock |
| **Sound files bloat bundle**                            | Low        | Low    | Host in `/public/sounds/`, load on demand (~50KB total)            |
| **Popup violates "zero distraction"**                   | Medium     | Medium | Make dismissable, auto-hide after 2s, subtle styling               |
| **react-chessboard doesn't support customSquareStyles** | Low        | High   | Verified in docs — `customSquareStyles` prop exists in v5.10.0     |
| **Inconsistent turn detection**                         | Low        | High   | chess.js `.turn()` is reliable — trust the library                 |
| **Users want sound off by default**                     | Medium     | Low    | Default to on, provide toggle, respect localStorage                |

---

## 📦 Dependencies Impact

| Library             | Size (gzipped) | Purpose              | Recommendation                     |
| ------------------- | -------------- | -------------------- | ---------------------------------- |
| **howler.js**       | 24KB           | Sound playback       | ❌ Overkill for 3 sounds           |
| **sonner**          | 4KB            | Toast notifications  | ⚠️ Consider if want reusable toast |
| **react-hot-toast** | 3.5KB          | Toast notifications  | ⚠️ Alternative to sonner           |
| **Native APIs**     | 0KB            | Audio + custom toast | ✅ Recommended                     |

**Total bundle increase (recommended approach):** ~0KB code + ~50KB assets (MP3 files in `/public/`)

---

## 💡 Recommended Approach

### Sound Effects: Native HTML5 Audio

**Rationale:**

- Zero dependencies
- Adequate for 2-3 sound effects
- Audio files served from `/public/sounds/` (not bundled)
- First move unlocks audio (browser autoplay policy)

**Implementation plan:**

1. Add `playSound(type)` utility function
2. Call on `isCheckmate()`, `isCheck()`, `isGameOver()`
3. Add sound toggle button (localStorage persisted)
4. Fire GA4 events: `sound_played`, `sound_toggled`

### Last Move Highlight: customSquareStyles

**Rationale:**

- Built into react-chessboard
- Industry standard pattern
- Zero dependencies

**Implementation plan:**

1. Add `lastMove` state: `{ from: string; to: string } | null`
2. Update on successful move
3. Pass to `customSquareStyles` prop
4. Yellow overlay (rgba(255, 255, 0, 0.4))

### Turn Validation: Custom Toast Component

**Rationale:**

- Balances simplicity vs UX quality
- No dependencies
- Full control over styling
- Accessible with ARIA live region

**Implementation plan:**

1. Create `<Toast>` component (~30 lines)
2. Add turn check in `onDrop` before move attempt
3. Show toast with "It's [Color]'s turn!" message
4. Auto-dismiss after 2 seconds
5. WCAG 2.1 AA: `aria-live="polite"` for screen readers

---

## 🎯 Comparison Table

| Feature                 | Approach           | Dependencies    | Bundle Impact          | Effort | Recommendation |
| ----------------------- | ------------------ | --------------- | ---------------------- | ------ | -------------- |
| **Sound Effects**       | Native Audio API   | None            | 0KB code + 50KB assets | 2-3h   | ✅ Recommended |
|                         | howler.js          | +1 library      | +24KB + 50KB assets    | 2-3h   | ❌ Overkill    |
| **Last Move Highlight** | customSquareStyles | None (built-in) | 0KB                    | 1h     | ✅ Only option |
| **Turn Validation**     | Custom Toast       | None            | ~1KB                   | 3-4h   | ✅ Recommended |
|                         | sonner library     | +1 library      | +4KB                   | 2h     | ⚠️ Alternative |
|                         | Browser alert()    | None            | 0KB                    | 5min   | ❌ Poor UX     |

---

## 🧪 Testing Strategy

### Unit Tests (Jest + RTL)

```typescript
describe("Sound Effects", () => {
  it("plays checkmate sound when game ends in checkmate", () => {
    // Mock Audio constructor
    // Simulate checkmate position
    // Verify audio.play() called
  });

  it("respects sound toggle preference from localStorage", () => {
    // Set localStorage to 'false'
    // Make move
    // Verify audio.play() NOT called
  });
});

describe("Last Move Highlight", () => {
  it("highlights from and to squares after move", () => {
    // Render board
    // Make move e2→e4
    // Verify customSquareStyles contains e2 and e4 with yellow background
  });
});

describe("Turn Validation", () => {
  it("shows error toast when wrong player tries to move", () => {
    // White just moved (black's turn)
    // Attempt to drag white piece
    // Verify toast shows "Black to move"
  });

  it("auto-dismisses toast after 2 seconds", async () => {
    // Show toast
    // Wait 2.1s
    // Verify toast removed from DOM
  });
});
```

### Manual QA Checklist

- [ ] Sound plays on checkmate (both White and Black wins)
- [ ] Sound plays on check
- [ ] Sound toggle persists across page refreshes
- [ ] Last move highlighted in yellow after every move
- [ ] Turn error toast shows when wrong player clicks piece
- [ ] Toast auto-dismisses after 2 seconds
- [ ] Toast doesn't cover chessboard on mobile
- [ ] Sound doesn't play if toggle is off
- [ ] ARIA live region announces turn errors to screen readers
- [ ] Lighthouse accessibility score remains ≥90

---

## 📐 Affected Files

| Action | Path                          | Purpose                                                     |
| ------ | ----------------------------- | ----------------------------------------------------------- |
| Modify | `app/page.tsx`                | Add sound, lastMove state, turn validation, toast component |
| Modify | `package.json`                | No new dependencies (native approach)                       |
| Create | `public/sounds/move.mp3`      | Move sound effect (optional)                                |
| Create | `public/sounds/check.mp3`     | Check sound effect                                          |
| Create | `public/sounds/checkmate.mp3` | Checkmate/win sound effect                                  |
| Create | `components/Toast.tsx`        | Reusable toast notification component                       |
| Create | `components/SoundToggle.tsx`  | Sound on/off button component                               |
| Modify | `app/page.test.tsx`           | Add tests for new features                                  |
| Create | `components/Toast.test.tsx`   | Toast component tests                                       |

**Estimated LOC:** ~200 lines (including tests)

---

## 🚀 Implementation Sequence

### Phase 1: Last Move Highlight (Lowest Risk)

1. Add `lastMove` state
2. Update on successful move
3. Pass to `customSquareStyles`
4. Test on desktop + mobile

**Effort:** 1-2 hours  
**Dependency:** None  
**Blocker:** None

### Phase 2: Turn Validation Toast

1. Create `<Toast>` component with ARIA
2. Add turn check logic in `onDrop`
3. Show toast on wrong player attempt
4. Test auto-dismiss timing
5. QA on mobile (position doesn't cover board)

**Effort:** 3-4 hours  
**Dependency:** None  
**Blocker:** None

### Phase 3: Sound Effects

1. Source/create MP3 files (CC0 licensed)
2. Add sound utility function
3. Integrate with game state checks
4. Create `<SoundToggle>` component
5. Add localStorage persistence
6. Test browser autoplay unlock flow
7. Add GA4 events

**Effort:** 4-5 hours  
**Dependency:** Audio assets  
**Blocker:** Need to source/create sounds first

**Total effort:** 8-11 hours (1-2 tickets)

---

## 🏁 Success Criteria

- [ ] Checkmate plays victory sound (when sound enabled)
- [ ] Check plays alert sound (when sound enabled)
- [ ] Last move squares highlighted in yellow after every move
- [ ] Turn error toast shows when wrong player attempts move
- [ ] Toast auto-dismisses after 2 seconds
- [ ] Sound toggle button visible in corner of board
- [ ] Sound preference persists via localStorage
- [ ] All existing tests pass
- [ ] New tests cover sound, highlight, toast features
- [ ] Lighthouse accessibility score ≥90
- [ ] No layout shift or performance regression
- [ ] Works on Chrome, Firefox, Safari (desktop + mobile)
- [ ] WCAG 2.1 AA compliant (ARIA live region, contrast ratios)

---

## 🧠 Key Knowledge Files

**If knowledge/ folder existed, would reference:**

- `knowledge/react/state-management.md` — useState patterns
- `knowledge/web-apis/audio.md` — HTML5 Audio API + autoplay policies
- `knowledge/accessibility/wcag-2.1.md` — ARIA live regions, contrast ratios
- `knowledge/testing/react-testing-library.md` — Mock patterns, async testing
- `knowledge/ux/notifications.md` — Toast patterns, timing, positioning

**Applicable instruction files:**

- `coding-standards.instructions.md` — TypeScript, React patterns
- `testing-standards.instructions.md` — Jest setup, coverage requirements
- `security.instructions.md` — No hardcoded values, safe external asset handling
- `qa-review.instructions.md` — Cross-browser, accessibility, performance checks

---

## 📚 References

- [chess.js Documentation](https://github.com/jhlywa/chess.js)
- [react-chessboard API](https://github.com/Clariity/react-chessboard)
- [MDN: HTMLAudioElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [WCAG 2.1: ARIA Live Regions](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)
- [Freesound.org](https://freesound.org) — CC0 sound effects
- [Lichess Open Source](https://github.com/lichess-org/lila) — Reference for chess UX patterns

---

## ✅ Spike Complete

**Recommendation:** **Proceed with native HTML5 Audio + custom Toast + customSquareStyles**

This approach:

- Adds zero dependencies
- Maintains "zero distraction" positioning with subtle enhancements
- Keeps bundle size minimal (~0KB code, ~50KB assets)
- Delivers all requested features
- Remains accessible (WCAG 2.1 AA)
- Estimated 8-11 hours total (can split into 2 tickets if preferred)

**Next step:** Hand off to Product Manager to write implementation ticket(s) from this spike.
