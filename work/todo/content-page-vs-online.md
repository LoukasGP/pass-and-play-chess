# Pass & Play vs Online Chess — Comparison Page

**Date:** 2026-05-08
**Status:** ✅ Done
**Route:** `/vs-online`

---

## 📋 Objective

Create `/vs-online` comparison page to target "pass and play vs online chess" and related comparison queries. Explain the differences and benefits of pass-and-play chess versus online chess platforms like chess.com and lichess.org.

**Success:** Page ranks for "pass and play vs online", "local chess vs online", and comparison queries. Highlights our unique positioning: zero friction, offline-first, distraction-free.

## 📁 Affected Files

| Action | Path                     | Role                                            |
| ------ | ------------------------ | ----------------------------------------------- |
| Create | `app/vs-online/page.tsx` | New route with comparison content and CTA       |

## ✅ Acceptance Criteria

- [x] Route accessible at `/vs-online`
- [x] Page has unique `<title>` meta tag: "Pass & Play vs Online Chess — What's the Difference?"
- [x] Page has unique meta description ≤155 chars with keywords "pass and play", "online chess", "comparison"
- [x] Page has `<h1>` heading: "Pass & Play vs Online Chess"
- [x] Page has 2–3 `<h2>` subheadings for content structure
- [x] Content is 400–600 words comparing pass-and-play vs online chess
- [x] Content highlights our advantages: no account, works offline, zero distractions, instant start
- [x] Content includes comparison table or list format for readability
- [x] Page includes internal link to home page: "Try Pass & Play Chess →" or similar CTA
- [x] Page does NOT bash competitors unfairly — factual comparison only
- [x] Page is mobile responsive
- [x] `npm run build` succeeds

## 🧪 Test Cases

- [ ] Test: Navigate to `/vs-online` → page loads with h1 heading
- [ ] Test: Click CTA link → navigates to home page with chessboard
- [ ] Test: View on mobile (390px width) → content readable, table/list not broken
- [ ] Test: View page source → unique title and meta description present

## ✅ Verification

```bash
npm run ci:validate && npm run test:e2e
```
