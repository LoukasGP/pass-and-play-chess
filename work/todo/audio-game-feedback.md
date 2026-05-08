# Ticket 02: Audio Game Feedback (Sound Effects + Toggle)

**Parent:** None
**Date:** 2026-05-08
**Status:** 🔴 Not Started
**Dependencies:** None (can run parallel with Ticket 01, but recommend sequential to avoid merge conflicts in app/page.tsx)

---

## 📋 Objective

Add audio feedback to pass-and-play chess board: (1) play sound on checkmate/check, (2) provide toggle button to enable/disable sounds with localStorage persistence. Uses native HTML5 Audio API (zero dependencies).

**Success:** When game ends in checkmate, victory sound plays. When king is in check, alert sound plays. Sound toggle button visible in corner of board — clicking it toggles sound on/off, preference persists across page reloads.

## 🎯 What This Ticket Delivers

1. Sound playback — native Audio API playing MP3 files from `/public/sounds/`
2. Sound toggle component — button in corner of board with speaker icon
3. localStorage persistence — sound preference saved and restored
4. GA4 analytics events — `sound_played`, `sound_toggled`
5. Tests for sound triggering and toggle behavior

## 📦 Prerequisites

- [x] chess.js v1.4.0 provides `game.isCheckmate()`, `game.isCheck()`, `game.isGameOver()` API
- [x] Existing GA4 integration in `app/page.tsx` fires events via `window.gtag()`
- [x] Jest test environment for mocking Audio constructor and localStorage
- [x] Sound assets sourced (CC0/royalty-free MP3 files)

## 🔧 Interface Design

```typescript
// Sound types
type SoundType = "check" | "checkmate";

// Sound utility function
function playSound(type: SoundType, enabled: boolean): void;

// SoundToggle component props
interface SoundToggleProps {
  readonly enabled: boolean;
  readonly onToggle: () => void;
}
```

## 🔨 Implementation Steps

### Step 1: Source Sound Assets

Download or create CC0-licensed MP3 files:

- `public/sounds/check.mp3` — alert tone for king in check (~5-10KB)
- `public/sounds/checkmate.mp3` — victory fanfare for game over (~20-30KB)

**Sources:** [Freesound.org](https://freesound.org) (CC0 license), [Zapsplat](https://www.zapsplat.com) (free tier), or synthesized tones.

**Requirements:**

- Total size <50KB for all sounds
- MP3 format (best browser support)
- Volume balanced (not jarring)

### Step 2: Add Sound Utility and State

In `app/page.tsx`, add `soundEnabled` state with localStorage initialization. Create `playSound` utility function using native `new Audio()` API. Wrap `audio.play()` in try-catch to handle autoplay policy blocks.

```typescript
const [soundEnabled, setSoundEnabled] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("soundEnabled") !== "false";
  }
  return true;
});

const playSound = (type: "check" | "checkmate") => {
  if (!soundEnabled) return;

  const audio = new Audio(`/sounds/${type}.mp3`);
  audio.play().catch(() => {
    // Browser blocked autoplay — silent fail
  });
};
```

### Step 3: Integrate Sound Triggers

After successful move in `onDrop`, check game state and play sounds:

- `game.isCheckmate()` → play 'checkmate' sound
- `game.isCheck()` → play 'check' sound (if not already checkmate)

Fire GA4 events when sounds play: `gtag('event', 'sound_played', { sound_type: 'checkmate' })`.

First user interaction (first move) unlocks audio for subsequent moves (browser autoplay policy).

### Step 4: Create SoundToggle Component

Create `components/SoundToggle.tsx` — fixed position button (bottom-right corner), 48×48px touch target (WCAG 2.5.5). Display 🔊 when enabled, 🔇 when disabled. On click, toggle `soundEnabled`, update localStorage, fire GA4 event `sound_toggled`.

```typescript
const toggleSound = () => {
  const newValue = !soundEnabled;
  setSoundEnabled(newValue);
  localStorage.setItem("soundEnabled", String(newValue));

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "sound_toggled", { enabled: newValue });
  }
};
```

**Styling:** Tailwind classes `fixed bottom-4 right-4 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 z-50`.

### Step 5: Add Tests

**app/page.test.tsx:**

- Test: Move leading to checkmate → `playSound('checkmate')` called
- Test: Move leading to check (not checkmate) → `playSound('check')` called
- Test: soundEnabled = false, checkmate move → `audio.play()` NOT called
- Test: soundEnabled persists → localStorage.getItem('soundEnabled') returns 'true'

**components/SoundToggle.test.tsx:**

- Test: Render when enabled → displays 🔊
- Test: Render when disabled → displays 🔇
- Test: Click button → calls onToggle callback
- Test: Button has ≥44×44px touch target (WCAG 2.5.5)
- Test: Button has accessible label (`aria-label="Toggle sound"`)

Mock `Audio` constructor and `localStorage` in tests.

Run `npm run build` after Step 2 and Step 4 to verify integration.

## 📁 Affected Files

| Action | Path                              | Role                                                 |
| ------ | --------------------------------- | ---------------------------------------------------- |
| Modify | `app/page.tsx`                    | Add sound state, playSound utility, trigger on moves |
| Create | `components/SoundToggle.tsx`      | Toggle button component for sound on/off             |
| Create | `components/SoundToggle.test.tsx` | Unit tests for SoundToggle component                 |
| Modify | `app/page.test.tsx`               | Add tests for sound triggering and localStorage      |
| Create | `public/sounds/check.mp3`         | Audio asset for check sound                          |
| Create | `public/sounds/checkmate.mp3`     | Audio asset for checkmate sound                      |

## ✅ Acceptance Criteria

- [ ] When game ends in checkmate, `checkmate.mp3` plays (if sound enabled)
- [ ] When king is in check (not checkmate), `check.mp3` plays (if sound enabled)
- [ ] Sound toggle button visible in bottom-right corner of viewport (does not cover board)
- [ ] Button displays 🔊 icon when sound enabled, 🔇 when disabled
- [ ] Clicking toggle button switches sound on/off and updates icon
- [ ] Sound preference persists across page reloads via localStorage
- [ ] When sound disabled, no audio plays on checkmate or check
- [ ] GA4 events fired: `sound_played` (with sound_type), `sound_toggled` (with enabled boolean)
- [ ] Sound toggle button has ≥44×44px touch target (WCAG 2.5.5)
- [ ] Sound toggle button has `aria-label` for screen readers
- [ ] Browser autoplay policy does NOT crash app (silent fail on blocked audio)
- [ ] Sound does NOT play on stalemate or draw (only checkmate and check)
- [ ] Total sound asset size <50KB
- [ ] All existing tests continue to pass
- [ ] `npm run build` succeeds

## 🚫 Out of Scope

- Move sound (optional click sound on every move) — not in MVP
- Volume control slider — default volume only
- Multiple sound themes — single sound set only
- Visual indicator for "tap to enable sound" on first load — silent fail acceptable
- Mute button during active sound playback — sounds are short (<3s)

## 🧪 Test Cases

- [ ] Test: Checkmate via Scholar's Mate → `playSound('checkmate')` called once
- [ ] Test: Move e7→e6 leading to check → `playSound('check')` called
- [ ] Test: localStorage 'soundEnabled' = 'false' → checkmate does NOT play sound
- [ ] Test: Toggle sound on → localStorage updated to 'true', GA4 event fired
- [ ] Test: Toggle sound off → localStorage updated to 'false', GA4 event fired
- [ ] Test: Page reload with sound off → soundEnabled state initializes to false
- [ ] Test: SoundToggle button has width/height ≥44px
- [ ] Test: SoundToggle button has aria-label="Toggle sound"
- [ ] Test: Audio constructor throws error → app does not crash (caught by try-catch)
- [ ] Test: Stalemate position → no sound plays (only check/checkmate trigger sounds)

## ✅ Verification

```bash
npm run ci:validate && npm run test:e2e
```

Manual verification:

1. Start app, make moves leading to checkmate → sound plays
2. Click sound toggle (bottom-right) → icon changes to 🔇, localStorage updated
3. Make checkmate move with sound off → no sound plays
4. Refresh page → sound setting persists (still off)
5. Click toggle again → icon changes to 🔊, localStorage updated
6. Make move leading to check (not checkmate) → check sound plays
7. Test on mobile → toggle button does not cover board, ≥44×44px touch target
8. Verify total MP3 files size <50KB

**Accessibility:**

- Screen reader announces "Toggle sound" button
- Button operable via keyboard (Space/Enter)
- Sound provides alternative cue for visual checkmate indicator
