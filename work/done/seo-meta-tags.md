# SEO Meta Tags Enhancement

**Date:** 2026-05-08
**Status:** ✅ Done
**Route:** All routes (app-wide)

---

## 📋 Objective

Enhance SEO metadata for better search rankings and social sharing. Target keywords: "pass and play chess", "offline chess board", "two player chess". Replace generic "Chess" title with value proposition from competitor analysis spike.

**Success:** Google preview shows optimized title/description. Social shares display OG image and rich preview.

## 📁 Affected Files

| Action | Path             | Role                                  |
| ------ | ---------------- | ------------------------------------- |
| Modify | `app/layout.tsx` | Enhance metadata object with OG tags  |
| Create | `public/og.png`  | Open Graph image for social sharing   |

## ✅ Acceptance Criteria

- [x] Page title is "Pass & Play Chess | Free Offline Chess Board"
- [x] Meta description is ≤155 chars, includes target keywords ("pass and play", "offline", "two players", "same device")
- [x] Open Graph tags set: `og:title`, `og:description`, `og:image`, `og:type`, `og:url`
- [x] Twitter card tags set: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- [x] `<html lang="en">` present (already exists)
- [x] Favicon present at `app/favicon.ico` (already exists)
- [x] Meta description does NOT mention features not yet implemented (AI, game clock, etc.)

## 🧪 Test Cases

- [ ] Test: Open https://www.opengraph.xyz/ → paste site URL → OG preview renders correctly
- [ ] Test: Share URL on Discord/Slack → rich embed displays title, description, image
- [ ] Test: Google "site:yoursite.com" → title and description match metadata

## ✅ Verification

```bash
npm run build
```

Manual verification:
1. Run `npm run dev`
2. View page source → verify `<meta>` tags present
3. Test with https://www.opengraph.xyz/ or https://cards-dev.twitter.com/validator
