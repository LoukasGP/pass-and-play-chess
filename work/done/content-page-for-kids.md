# Teach Kids Chess — Parent-Focused Content Page

**Date:** 2026-05-08
**Status:** 🔴 Not Started
**Route:** `/for-kids`

---

## 📋 Objective

Create `/for-kids` parent-focused content page to target "teach kids chess", "chess for kids offline", and related queries. Position the app as a distraction-free, ad-free tool for teaching children chess without online distractions.

**Success:** Page ranks for "teach kids chess", "chess for kids offline", "ad-free chess for kids". Attracts parents and educators looking for simple, safe chess tools.

## 📁 Affected Files

| Action | Path                     | Role                                          |
| ------ | ------------------------ | --------------------------------------------- |
| Create | `app/for-kids/page.tsx`  | New route with parent-focused content and CTA |

## ✅ Acceptance Criteria

- [ ] Route accessible at `/for-kids`
- [ ] Page has unique `<title>` meta tag: "Teach Kids Chess — No Ads, No Distractions"
- [ ] Page has unique meta description ≤155 chars with keywords "teach kids chess", "offline", "ad-free"
- [ ] Page has `<h1>` heading: "Teach Kids Chess — No Ads, No Distractions"
- [ ] Page has 2–3 `<h2>` subheadings for content structure
- [ ] Content is 300–500 words addressing parent concerns (safety, simplicity, no ads)
- [ ] Content includes benefits: no account signup, works offline, no chat/social features, focus on the game
- [ ] Page includes internal link to home page: "Start Teaching Chess →" or similar CTA
- [ ] Tone is reassuring and parent-focused (not overly technical)
- [ ] Page does NOT make safety claims that can't be verified (e.g., "100% safe")
- [ ] Page is mobile responsive
- [ ] `npm run build` succeeds

## 🧪 Test Cases

- [ ] Test: Navigate to `/for-kids` → page loads with h1 heading
- [ ] Test: Click CTA link → navigates to home page with chessboard
- [ ] Test: View on mobile (390px width) → content readable, no horizontal scroll
- [ ] Test: View page source → unique title and meta description present

## ✅ Verification

```bash
npm run ci:validate && npm run test:e2e
```
