# How to Play Pass & Play Chess — Content Page

**Date:** 2026-05-08
**Status:** ✅ Done
**Route:** `/how-to-play`

---

## 📋 Objective

Create `/how-to-play` content page to target "how to play chess offline" and related long-tail keywords. Explain what pass-and-play chess is, how to use the app, and why to play offline. Provides additional entry point for organic search traffic.

**Success:** Page ranks for "how to play chess offline", "pass and play chess instructions", and related queries. Internal link drives users to main chessboard.

## 📁 Affected Files

| Action | Path                         | Role                                     |
| ------ | ---------------------------- | ---------------------------------------- |
| Create | `app/how-to-play/page.tsx`   | New route with tutorial content and CTA  |

## ✅ Acceptance Criteria

- [ ] Route accessible at `/how-to-play`
- [ ] Page has unique `<title>` meta tag: "How to Play Pass & Play Chess"
- [ ] Page has unique meta description ≤155 chars with keywords "pass and play", "offline", "instructions"
- [ ] Page has `<h1>` heading: "How to Play Pass & Play Chess"
- [ ] Page has 2–3 `<h2>` subheadings for content structure
- [ ] Content is 300–600 words explaining pass-and-play concept
- [ ] Content includes target keywords naturally: "pass and play", "offline chess", "two players", "same device"
- [ ] Page includes internal link to home page: "Start Playing →" or similar CTA
- [ ] Page does NOT mention features not yet implemented (AI bots, game clock, etc.)
- [ ] Page is mobile responsive
- [ ] `npm run build` succeeds

## 🧪 Test Cases

- [ ] Test: Navigate to `/how-to-play` → page loads with h1 heading
- [ ] Test: Click CTA link → navigates to home page with chessboard
- [ ] Test: View on mobile (390px width) → content readable, no horizontal scroll
- [ ] Test: View page source → unique title and meta description present

## ✅ Verification

```bash
npm run ci:validate && npm run test:e2e
```
