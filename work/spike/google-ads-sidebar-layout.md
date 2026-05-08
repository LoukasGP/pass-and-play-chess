# Spike: Google Ads Sidebar Layout (Desktop Only)

**Date:** 2026-05-08  
**Type:** Feature Spike  
**Status:** 🟡 Research Complete

---

## 🎯 Problem Statement

Add Google Ads on either side of chess board. Visible desktop only. Mobile/tablet shows board only.

**User intent**: Monetize via display ads without disrupting gameplay on small screens.

---

## ⚠️ Strategy Conflict Detected

**Conflict**: `work/spike/traction-growth-strategies.md` lists "No ads, no tracking" as core value prop and differentiation vs. chess.com.

**Options**:
1. Proceed with ads → update growth strategy, reposition as "distraction-free gameplay" (ads present but not intrusive)
2. Defer ads → keep "no ads" positioning for Product Hunt/HN launch, add ads later based on user feedback
3. Hybrid → "optional ads" toggle or "ad-free premium" tier

**Recommendation**: Clarify monetization strategy before implementation. If ads approved, proceed with technical plan below.

---

## 🔍 Current State

**Layout**: Chess board centered, fullscreen, 100vh × 100vw
**Styling**: Inline styles, no component structure
**Tailwind**: Installed but unused
**Target breakpoint**: Desktop = `lg:` (≥1024px per Tailwind default)

---

## 🚀 Technical Approaches

### Approach 1: Google AdSense (Automatic)

**What**:
- Sign up for AdSense account (requires approval)
- Add AdSense script to `app/layout.tsx`
- Use `<ins>` tags with `data-ad-client` and `data-ad-slot`
- Google serves ads automatically

**Pros**:
- Easy setup (10 minutes after approval)
- Auto-optimized ad content
- No manual ad inventory management

**Cons**:
- Approval takes 1–7 days (not instant)
- Less control over ad dimensions/placement
- Revenue share lower than direct deals

**Code Pattern**:
```tsx
// app/layout.tsx
<Script
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
  strategy="afterInteractive"
  crossOrigin="anonymous"
/>

// components/GoogleAd.tsx
<ins
  className="adsbygoogle"
  style={{ display: 'block' }}
  data-ad-client="ca-pub-XXXXXXXX"
  data-ad-slot="YYYYYYYYYY"
  data-ad-format="vertical"
/>
```

**Effort**: Low (if already approved)  
**Timeline**: 1–7 days approval + 1 hour implementation

---

### Approach 2: Google Ad Manager (Manual Control)

**What**:
- Use Google Ad Manager (formerly DFP) for precise ad unit control
- Define custom ad sizes (160×600 skyscraper, 300×600 half-page)
- GPT (Google Publisher Tag) library for rendering

**Pros**:
- Full control over ad sizes, positions, frequency
- Better for programmatic deals
- More flexible for A/B testing

**Cons**:
- More complex setup
- Requires Ad Manager account (separate from AdSense)
- Overkill for simple use case

**Effort**: Medium  
**Timeline**: 2–3 hours (after Ad Manager setup)

---

### Approach 3: `react-google-adsense` Package

**What**:
- Use npm package `react-google-adsense` or `nextjs-google-adsense`
- Wraps AdSense API in React component

**Pros**:
- Clean React API
- Handles script loading
- TypeScript support (some packages)

**Cons**:
- Third-party dependency (maintenance risk)
- `react-google-adsense` last updated 2021 (stale)
- Adds 50KB to bundle

**Effort**: Low  
**Timeline**: 1 hour

---

### Approach 4: Manual Script + `<ins>` Tags (Recommended)

**What**:
- Add AdSense script via Next.js `<Script>` component in layout
- Create reusable `<GoogleAd>` component wrapping `<ins>` tag
- Control visibility with Tailwind responsive classes

**Pros**:
- No external dependencies
- Full control
- Tailwind for responsive visibility (built-in)
- Works with AdSense or Ad Manager

**Cons**:
- Manual script management

**Effort**: Low  
**Timeline**: 1–2 hours

---

## 🎨 Layout Approaches

### Option 1: CSS Flexbox (3-Column)

**Structure**:
```tsx
<div className="flex justify-center items-center h-screen">
  <GoogleAd className="hidden lg:block w-[160px]" slot="LEFT_SLOT" />
  <div className="max-w-[min(100vh,100vw)] w-full aspect-square">
    <Chessboard />
  </div>
  <GoogleAd className="hidden lg:block w-[160px]" slot="RIGHT_SLOT" />
</div>
```

**Pros**:
- Simple, idiomatic
- Works with current layout (minimal refactor)

**Cons**:
- Fixed ad widths may not adapt well

**Effort**: Low

---

### Option 2: CSS Grid (3-Column)

**Structure**:
```tsx
<div className="grid grid-cols-[160px_1fr_160px] lg:grid-cols-[160px_auto_160px] h-screen">
  <GoogleAd className="hidden lg:block" />
  <div className="flex justify-center items-center">
    <Chessboard />
  </div>
  <GoogleAd className="hidden lg:block" />
</div>
```

**Pros**:
- More semantic for multi-column layout
- Better for complex responsive rules

**Cons**:
- Slightly more verbose

**Effort**: Low

---

### Option 3: Absolute Positioning

**Structure**:
```tsx
<div className="relative h-screen">
  <GoogleAd className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2" />
  <div className="flex justify-center items-center h-full">
    <Chessboard />
  </div>
  <GoogleAd className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2" />
</div>
```

**Pros**:
- Board remains centered, unaffected by ad presence
- Ads overlay whitespace (not part of layout flow)

**Cons**:
- Ads may overlap board on narrow desktop screens (1024–1280px)

**Effort**: Low

---

## 🎯 Recommendation

**Ad Implementation**: Approach 4 (Manual Script + `<ins>` Tags)
- **Why**: No dependencies, full control, works with AdSense (easiest approval path)

**Layout**: Option 1 (CSS Flexbox)
- **Why**: Simplest, works with current centered layout, clear responsive breakpoint

**Responsive Breakpoint**: Tailwind `lg:` (≥1024px)
- **Why**: Standard desktop threshold, enough space for 160px ads + 640px board

**Ad Dimensions**: 160×600 (wide skyscraper) or 300×250 (medium rectangle)
- **Why**: Standard AdSense sizes, high fill rate

---

## 📐 Component Structure

```
app/
  page.tsx          → Update to 3-column flexbox layout
  layout.tsx        → Add AdSense script
components/
  GoogleAd.tsx      → Reusable ad component with slot prop
```

---

## ⚠️ Risks & Unknowns

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **AdSense approval rejection** — gambling/adult content policy | Low | High | Chess is safe content, approval likely |
| **Ads don't render on localhost** — AdSense blocks dev domains | High | Low | Test on Vercel preview URL or production |
| **Layout shift when ads load** — CLS penalty | Medium | Medium | Reserve space with `min-h-[600px]` placeholder |
| **Ad revenue too low** — CPM <$1 | Medium | Medium | Validate traffic first (Product Hunt launch) before ads |
| **User backlash** — "you said no ads!"** | High | High | Update growth strategy, communicate clearly |
| **Breakpoint too low (1024px)** — ads overlap board | Low | Medium | Test on 1024px screen, adjust to `xl:` (1280px) if needed |

---

## 🧪 Testing Checklist

- [ ] Desktop (≥1024px): Ads visible both sides, board centered
- [ ] Tablet (768–1023px): No ads, board centered
- [ ] Mobile (<768px): No ads, board fills screen
- [ ] Layout shift: Measure CLS before/after (Lighthouse)
- [ ] Ad rendering: Verify ads load on production domain (not localhost)
- [ ] Keyboard nav: Tab order skips ads (or ads are `tabindex="-1"`)

---

## 📦 Deliverables (If Proceeding)

1. **`components/GoogleAd.tsx`** — Reusable ad component
2. **Updated `app/page.tsx`** — 3-column flexbox layout with responsive classes
3. **Updated `app/layout.tsx`** — AdSense script tag
4. **Ad slots configured** in AdSense dashboard (2 slots: `left-sidebar`, `right-sidebar`)
5. **Lighthouse audit** — verify CLS <0.1 after ads load
6. **Updated growth strategy** — revise "no ads" positioning if applicable

---

## 🧭 Next Steps

1. **Clarify monetization strategy** with stakeholder:
   - Proceed with ads? → Update `work/spike/traction-growth-strategies.md`
   - Defer ads? → Close this spike
   - Hybrid model? → Spike on "ad-free toggle" feature
2. **Apply for AdSense** (if not approved) — takes 1–7 days
3. **Hand off to Product Manager** for ticket breakdown

---

## 📏 Success Metrics (If Implemented)

- [ ] Ads render on desktop (≥1024px) within 2s of page load
- [ ] No ads visible on mobile/tablet (<1024px)
- [ ] CLS <0.1 (no layout shift when ads load)
- [ ] Ad viewability >70% (AdSense dashboard)
- [ ] No user complaints about ads disrupting gameplay

---

## 🔗 References

- [Google AdSense Sign Up](https://www.google.com/adsense/start/)
- [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)
- [AdSense Ad Sizes](https://support.google.com/adsense/answer/9183460)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Core Web Vitals: CLS](https://web.dev/cls/)

---

**Status**: ✅ Ready for decision  
**Recommendation**: Clarify monetization strategy first. If ads approved, implement via Approach 4 (manual script) + Option 1 (flexbox layout).
