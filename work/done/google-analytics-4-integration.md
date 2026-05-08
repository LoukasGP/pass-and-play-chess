# Google Analytics 4 Integration

**Date:** 2026-05-08
**Status:** ✅ Done
**Route:** All routes (app-wide tracking)

---

## 📋 Objective

Add Google Analytics 4 (GA4) event tracking to measure user engagement: game starts, move count per session, session duration, bounce rate. Use data to validate success metrics from competitor analysis spike.

**Success:** GA4 dashboard shows real-time events. Can measure "Time to first move" and "Session duration" metrics.

## 📁 Affected Files

| Action | Path             | Role                                     |
| ------ | ---------------- | ---------------------------------------- |
| Modify | `app/layout.tsx` | Add GA4 Script tags                      |
| Modify | `app/page.tsx`   | Fire `game_start` and `move_made` events |

## ✅ Acceptance Criteria

- [x] GA4 measurement ID stored in `NEXT_PUBLIC_GA4_MEASUREMENT_ID` env var
- [x] GA4 gtag.js script loads via Next.js `<Script>` component with `strategy="afterInteractive"`
- [x] `game_start` event fires on component mount (first render)
- [x] `move_made` event fires on each successful piece drop (valid move)
- [x] Event parameters include: `move_count` (incremental per game), `timestamp`
- [x] No PII collected (no user IDs, IP addresses, or personal data)
- [x] GA4 script does NOT load if env var is undefined (same pattern as AdSense script)

## 🧪 Test Cases

- [ ] Test: Open app → check Network tab → GA4 script loads
- [ ] Test: Make 3 valid moves → GA4 real-time view shows 3 `move_made` events
- [ ] Test: Open app without `NEXT_PUBLIC_GA4_MEASUREMENT_ID` set → no GA4 script loads

## ✅ Verification

```bash
npm run build
```

Manual verification:

1. Set `NEXT_PUBLIC_GA4_MEASUREMENT_ID` in `.env.local`
2. Run `npm run dev`
3. Open browser DevTools → Network tab → filter "google-analytics"
4. Make 2-3 moves
5. Check GA4 real-time view → events appear
