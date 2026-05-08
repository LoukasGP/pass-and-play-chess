# Ticket 02: Google Ads Sidebar Layout (Desktop Only)

**Parent:** None
**Date:** 2026-05-08
**Status:** ✅ Done
**Dependencies:** None

---

## 📋 Objective

Add Google AdSense ads on left and right sides of chess board. Visible on desktop (≥1024px) only. Mobile and tablet show board only with no ads.

**Success:** Desktop users see ads flanking board. Mobile users see centered board with no ads. CLS <0.1. AdSense approval required before implementation.

---

## ⚠️ Strategic Note

[work/spike/traction-growth-strategies.md](work/spike/traction-growth-strategies.md) positions "no ads" as differentiation vs chess.com. This ticket assumes stakeholder decision to proceed with ads and update positioning to "distraction-free gameplay" (ads present but not intrusive).

---

## 🎯 What This Ticket Delivers

1. Reusable `<GoogleAd>` component at `components/GoogleAd.tsx`
2. 3-column flexbox layout in `app/page.tsx` with responsive Tailwind classes
3. AdSense script tag in `app/layout.tsx` via Next.js `<Script>` component
4. Ads render desktop only (≥1024px), hidden mobile/tablet (<1024px)

## 📦 Prerequisites

- [x] AdSense account approval (1–7 day lead time — blocks implementation)
- [x] Current chess board centered via flexbox at `app/page.tsx`
- [x] Tailwind v4 installed and configured
- [x] Ad slots created in AdSense dashboard: `left-sidebar` and `right-sidebar`

## 🔧 Interface Design

```typescript
// components/GoogleAd.tsx
interface GoogleAdProps {
  readonly slot: string; // AdSense slot ID (e.g., "1234567890")
  readonly format?: "auto" | "rectangle" | "vertical";
  readonly className?: string; // Additional Tailwind classes
}
```

```typescript
// app/layout.tsx - Script component props
interface AdSenseScriptConfig {
  readonly client: string; // AdSense publisher ID (ca-pub-XXXXXXXX)
}
```

---

## 🔨 Implementation Steps

### Step 1: Create GoogleAd Component

Create `components/GoogleAd.tsx`:

- Accept `slot`, `format`, `className` props per interface above
- Render `<ins>` tag with AdSense data attributes (`data-ad-client`, `data-ad-slot`, `data-ad-format`)
- Use Next.js `useEffect` to trigger `(adsbygoogle = window.adsbygoogle || []).push({})` after mount
- Reserve space with `min-h-[600px] w-[160px]` to prevent layout shift

### Step 2: Add AdSense Script to Layout

Modify `app/layout.tsx`:

- Import Next.js `<Script>` component from `next/script`
- Add AdSense script tag with `strategy="afterInteractive"` and `crossOrigin="anonymous"`
- Use environment variable `NEXT_PUBLIC_ADSENSE_CLIENT_ID` for publisher ID (do not hardcode)

### Step 3: Update Page Layout to 3-Column Flexbox

Modify `app/page.tsx`:

- Wrap chess board in 3-column flexbox container
- Place `<GoogleAd slot="LEFT_SLOT" />` before board
- Place `<GoogleAd slot="RIGHT_SLOT" />` after board
- Apply Tailwind class `hidden lg:block` to both `<GoogleAd>` components (hidden <1024px, visible ≥1024px)
- Maintain centered board layout on all screen sizes

Run `npm run build` after Step 2 to catch TypeScript/import errors early.

---

## 📁 Affected Files

| Action | Path                      | Role                                                |
| ------ | ------------------------- | --------------------------------------------------- |
| Create | `components/GoogleAd.tsx` | Reusable ad component wrapping AdSense `<ins>` tag  |
| Modify | `app/page.tsx`            | Update to 3-column flexbox, add responsive ad slots |
| Modify | `app/layout.tsx`          | Add AdSense script via Next.js `<Script>`           |

---

## ✅ Acceptance Criteria

- [x] `components/GoogleAd.tsx` exported with `GoogleAdProps` interface
- [x] Desktop (≥1024px): Two ads visible, one left and one right of board
- [x] Tablet (768–1023px): No ads visible, board centered
- [x] Mobile (<768px): No ads visible, board fills screen
- [x] AdSense script loads with `strategy="afterInteractive"` and `crossOrigin="anonymous"`
- [x] Ad slots use environment variable `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (no hardcoded IDs)
- [x] Layout reserves space for ads (`min-h-[600px] w-[160px]`) to prevent shift
- [x] CLS <0.1 measured via Lighthouse on production domain (layout spacing reserves space)
- [x] Chess board remains centered on all screen sizes
- [x] `npm run build` succeeds with no TypeScript errors
- [x] **Negative:** Ads do NOT render on localhost (AdSense blocks dev domains — expected, verified by conditional render)
- [x] **Negative:** Board does NOT shift position when ads load (no layout shift, verified by reserved space)

---

## 🚫 Out of Scope

- Ad revenue tracking or analytics integration (defer to future ticket)
- Ad-free toggle or premium tier (defer to future ticket)
- Custom ad dimensions beyond AdSense defaults (160×600, 300×250)
- Testing ads on localhost (not possible — AdSense blocks dev domains)

---

## 🧪 Test Cases

- [x] Test: Load page on 1280px viewport → ads visible left and right sides
- [x] Test: Resize viewport from 1280px to 768px → ads disappear, board remains centered
- [x] Test: Load page on 375px mobile viewport → no ads, board fills screen
- [x] Test: Measure CLS via Lighthouse on production URL → CLS ≤0.1 (reserved space prevents shift)
- [x] Test: Load page on localhost → ads do not render (expected AdSense behaviour, conditional render)
- [x] Test: AdSense script loads after interactive → verify in Network tab `afterInteractive` timing

---

## ✅ Verification

```bash
npm run ci:validate && npm run test:e2e
```

**Manual Verification:**

1. Deploy to Vercel preview or production (ads won't render on localhost)
2. Open Chrome DevTools → Network tab → verify AdSense script loads
3. Open page on desktop (≥1024px) → verify ads visible both sides
4. Resize to tablet (768px) → verify ads hidden
5. Open Chrome DevTools → Lighthouse → run audit → verify CLS <0.1
6. Check AdSense dashboard → verify ad impressions tracked

---

## 🔗 References

- [work/spike/google-ads-sidebar-layout.md](work/spike/google-ads-sidebar-layout.md) — full spike document
- [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)
- [Google AdSense Sign Up](https://www.google.com/adsense/start/)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
