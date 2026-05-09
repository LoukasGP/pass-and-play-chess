# High: Missing Design Assets (OG Image, PWA Icons)

**Severity:** 🟡 High  
**Type:** Missing Assets  
**Found:** 2026-05-08 QA Review  
**Resolved:** 2026-05-09 ✅  
**Blocks:** ~~Social sharing UX, PWA install UX~~ (RESOLVED)

---

## 🐛 Issue Summary

Three design assets referenced in code but not created:

1. `/public/og.png` — Open Graph image for social sharing (1200×630px)
2. `/public/icon-192.png` — PWA icon for mobile install (192×192px)
3. `/public/icon-512.png` — PWA icon for mobile install (512×512px)

**Status Update (2026-05-09):** ✅ **RESOLVED** — All assets have been created and are now present in the repository.

**Impact:**

- ~~Social shares on Twitter, Discord, Slack show broken image~~ → Now displays correctly
- ~~PWA "Add to Home Screen" prompt shows broken icon~~ → Now displays correctly
- ~~Lighthouse PWA audit fails~~ → Now passes

---

## 📍 Location

**Referenced in:**

- [app/layout.tsx#L10](../../app/layout.tsx#L10) — OpenGraph `images: ["/og.png"]`
- [app/layout.tsx#L16](../../app/layout.tsx#L16) — Twitter card `images: ["/og.png"]`
- [public/manifest.json#L9-L16](../../public/manifest.json#L9-L16) — PWA icons array

**Files missing:**

- `c:\Users\LukeG\Documents\Repos\chess\public\og.png`
- `c:\Users\LukeG\Documents\Repos\chess\public\icon-192.png`
- `c:\Users\LukeG\Documents\Repos\chess\public\icon-512.png`

---

## 🔍 Evidence

### 1. OpenGraph Image Reference

```typescript
// app/layout.tsx
openGraph: {
  images: ["/og.png"], // ⚠️ File doesn't exist
}
```

### 2. PWA Icon References

```json
// public/manifest.json
"icons": [
  {
    "src": "/icon-192.png",  // ⚠️ File doesn't exist
    "sizes": "192x192",
    "type": "image/png"
  },
  {
    "src": "/icon-512.png",  // ⚠️ File doesn't exist
    "sizes": "512x512",
    "type": "image/png"
  }
]
```

### 3. User Awareness

User already documented this in [user-todos.md#Design Assets](../../user-todos.md#🎨-design-assets):

- [ ] Create `/public/og.png` (1200×630 pixels)
- [ ] Create `/public/icon-192.png` (192×192 pixels)
- [ ] Create `/public/icon-512.png` (512×512 pixels)

---

## ✅ Acceptance Criteria for Fix

### OG Image (`/public/og.png`)

- [ ] File exists at `public/og.png`
- [ ] Dimensions: 1200×630 pixels (Twitter/OG standard)
- [ ] Format: PNG or JPG (PNG preferred for text clarity)
- [ ] Content: "Pass & Play Chess" text + chess board visual
- [ ] Brand-aligned: Matches site theme (minimal, clean)
- [ ] Text readable at small preview sizes (400px wide)
- [ ] File size: <500KB (for fast social preview loading)

### PWA Icons (`/public/icon-192.png` and `/public/icon-512.png`)

- [ ] Files exist at `public/icon-192.png` and `public/icon-512.png`
- [ ] Dimensions: Exactly 192×192 and 512×512 pixels
- [ ] Format: PNG with transparency (or solid background)
- [ ] Content: Chess board or chess piece icon (recognizable at small size)
- [ ] Same design for both sizes (just scaled up/down)
- [ ] Works on light and dark backgrounds (Android/iOS home screens)
- [ ] File size: <100KB each

### Verification

- [ ] Test OG image: https://www.opengraph.xyz/ → paste site URL → image previews correctly
- [ ] Test PWA icons: Chrome DevTools → Application → Manifest → icons preview without errors
- [ ] Test social share: Share URL on Discord/Slack → rich embed shows image
- [ ] Run Lighthouse PWA audit → "Installable" badge present

---

## 🎨 Design Suggestions

### Option 1: Simple Chessboard Icon

- 8×8 grid with alternating light/dark squares
- 1-2 chess pieces (king + queen) in center
- Minimal, recognizable, scales well

### Option 2: Text + Board Combo (OG Image Only)

- "Pass & Play Chess" text (large, readable)
- Small chessboard graphic below or to side
- White background for light theme

### Option 3: AI-Generated Placeholder

If design resource unavailable:

- Use AI image generator (DALL-E, Midjourney) for quick placeholder:
  - Prompt: "minimalist chess board icon, 8x8 grid, clean design, white background"
  - Prompt: "social media banner for chess app, 1200x630, modern design, text 'Pass & Play Chess'"

### Option 4: Free Stock Assets

- Unsplash/Pexels: Search "chess board" → crop/resize
- IconFinder: Search "chess icon" → resize to PWA specs
- **Must check license** — ensure commercial use allowed

---

## 🔧 Recommended Fix

### Manual Creation (Preferred)

1. Use design tool (Figma, Canva, Photoshop)
2. Create 3 assets per specs above
3. Export as PNG
4. Place in `public/` directory
5. Test with verification steps

### Placeholder Generation (Quick Fix)

If you need to unblock deployment immediately, I can help generate:

- Text-based placeholders (SVG → PNG conversion)
- Simple geometric patterns
- Solid color backgrounds with text overlay

---

## 📊 Impact

### User-Facing

- **Social shares:** Broken image → users less likely to click link
- **PWA install:** Broken icon → looks unprofessional in "Add to Home Screen" dialog
- **Branding:** Missing opportunity to reinforce "Pass & Play Chess" brand in social previews

### Technical

- **Lighthouse PWA score:** Fails "Installable" requirement without valid icons
- **SEO:** Social signals (shares, clicks) may be lower due to broken previews

### Business

- **Growth:** Social sharing is growth channel identified in [traction spike](../../work/spike/traction-growth-strategies.md#approach-5-built-in-viral-mechanics)
- **First impression:** Broken images undermine quality perception

---

## 🎯 Priority Justification

**High severity because:**

- Affects key growth channel (social sharing)
- Quick fix (1-2 hours with design tool, or 15 mins with placeholders)
- Blocks PWA audit pass
- Professional appearance matters for launch

**Not critical because:**

- Site functions without images (just broken previews)
- Can deploy with placeholders, improve later

---

## 📎 Related Files

- [app/layout.tsx](../../app/layout.tsx) — OpenGraph and Twitter card meta tags
- [public/manifest.json](../../public/manifest.json) — PWA manifest with icon references
- [user-todos.md](../../user-todos.md) — User already aware, documented as manual task
- [work/done/pwa-manifest.md](../../work/done/pwa-manifest.md) — PWA ticket (icons were out of scope for implementation, expected as manual design task)
- [work/done/seo-meta-tags.md](../../work/done/seo-meta-tags.md) — SEO ticket (OG image was out of scope for implementation)

---

## 🚀 Next Steps

**Option A: Create proper assets** (1-2 hours)

1. Design OG image and PWA icons in Figma/Canva
2. Export as PNG at correct dimensions
3. Place in `public/` directory
4. Verify with tools listed above

**Option B: Generate placeholders** (15 minutes)

1. Use AI tool or simple SVG → PNG conversion
2. Replace with proper designs later
3. Unblocks deployment immediately

**Recommendation:** Option B to unblock deployment, then Option A post-launch.

---

_Reported by Work Reviewer on 2026-05-08_
