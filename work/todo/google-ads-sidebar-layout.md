# Ticket 01: Google Ads Sidebar Layout (Desktop Only)

**Parent:** None
**Date:** 2026-05-08
**Status:** 🔴 Not Started
**Dependencies:** None

---

## 📋 Objective

Add non-intrusive Google AdSense ads on left and right sidebars for desktop users (≥1024px). Mobile and tablet show board only. Implements monetization strategy from competitor analysis while maintaining "distraction-free gameplay" positioning.

**Success:** Desktop users see ads in sidebars, mobile/tablet see no ads, gameplay uninterrupted, CLS <0.1.

## 🎯 What This Ticket Delivers

1. Reusable `<GoogleAd>` component at `components/GoogleAd.tsx`
2. 3-column flexbox layout in `app/page.tsx` with responsive breakpoints
3. Ad slots visible only on desktop (≥1024px via Tailwind `lg:` class)
4. No layout shift when ads load (reserved space)

## 📦 Prerequisites

- [x] AdSense script already integrated in `app/layout.tsx` (conditional on `NEXT_PUBLIC_ADSENSE_CLIENT_ID`)
- [x] Tailwind CSS 4 installed and configured
- [x] Chess board component working at `app/page.tsx`

## 🔧 Interface Design

```typescript
interface GoogleAdProps {
  readonly slot: string; // AdSense ad slot ID
  readonly format?: "vertical" | "rectangle" | "auto";
  readonly className?: string;
}
```

## 🔨 Implementation Steps

### Step 1: Create GoogleAd Component

Create `components/GoogleAd.tsx` with:

- Accept `slot`, `format`, `className` props
- Render `<ins className="adsbygoogle">` tag with AdSense data attributes
- Use `useEffect` to call `(adsbygoogle = window.adsbygoogle || []).push({})` after mount
- TypeScript: declare `window.adsbygoogle` interface to avoid type errors
- Reserve minimum height (`min-h-[600px]`) to prevent CLS

### Step 2: Update Page Layout

Modify `app/page.tsx`:

- Replace current centered div with 3-column flexbox container
- Left column: `<GoogleAd slot="LEFT_SLOT" className="hidden lg:block w-[160px]" />`
- Center column: existing chess board (keep current sizing logic)
- Right column: `<GoogleAd slot="RIGHT_SLOT" className="hidden lg:block w-[160px]" />`
- Use `justify-center items-center` on parent flex container

### Step 3: Handle AdSense Script Loading

Verify `app/layout.tsx` AdSense script:

- Already present, loads conditionally based on `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- No changes needed unless script strategy adjustment required

### Step 4: Responsive Styling

Use Tailwind responsive classes:

- Ads: `hidden lg:block` (only show ≥1024px)
- Board container: remains fullscreen on mobile, centered with ads on desktop
- Test breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1920px (large desktop)

## 📁 Affected Files

| Action | Path                           | Role                                           |
| ------ | ------------------------------ | ---------------------------------------------- |
| Create | `components/GoogleAd.tsx`      | Reusable ad component wrapping AdSense `<ins>` |
| Modify | `app/page.tsx`                 | Refactor to 3-column layout with sidebars      |
| Create | `components/GoogleAd.test.tsx` | Unit test for GoogleAd component (optional)    |

## ✅ Acceptance Criteria

- [ ] GoogleAd component renders `<ins>` tag with correct `data-ad-client`, `data-ad-slot`, `data-ad-format` attributes
- [ ] Ads visible on desktop (≥1024px) in left and right sidebars
- [ ] Ads hidden on tablet (768–1023px) and mobile (<768px)
- [ ] Chess board remains centered and fullscreen on all viewports
- [ ] No layout shift when ads load (CLS <0.1 per Lighthouse)
- [ ] Ads do NOT overlap chess board at any breakpoint
- [ ] AdSense script loads only if `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set (existing behavior)
- [ ] TypeScript builds without errors (`npm run build` succeeds)

## 🚫 Out of Scope

- AdSense account approval (manual, external process)
- Creating ad slots in AdSense dashboard (manual configuration)
- Ad performance tracking beyond built-in AdSense analytics
- "Ad-free toggle" or premium tier (deferred to future ticket)
- Mobile banner ads (desktop sidebar only per spike)

## 🧪 Test Cases

- [ ] Test: Open on 1920×1080 desktop → ads visible both sides, board centered
- [ ] Test: Resize to 768px tablet → ads disappear, board fills viewport
- [ ] Test: Open on 390×844 mobile → no ads, board fullscreen
- [ ] Test: Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` → AdSense script loads
- [ ] Test: Unset `NEXT_PUBLIC_ADSENSE_CLIENT_ID` → no ads render, no script errors
- [ ] Test: Lighthouse audit → CLS <0.1, no accessibility warnings

## ✅ Verification

```bash
npm run build
npm run test
```

Manual verification:

1. Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` in `.env.local`
2. Run `npm run dev`
3. Open at 1280px viewport → ads should show (placeholder until AdSense approved)
4. Resize to 768px → ads disappear
5. Check DevTools console → no errors
6. Run Lighthouse → verify CLS <0.1

**Note:** Ads won't render on localhost. Test on Vercel preview or production domain after deployment.
