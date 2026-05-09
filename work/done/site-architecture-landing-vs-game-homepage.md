# Spike: Site Architecture — Landing Page vs Game-as-Homepage

**Date:** 2026-05-08  
**Type:** Architecture & SEO Research  
**Status:** 🟢 Complete  
**Researcher:** Scrum Master

---

## 🎯 Problem Statement

Current site structure has chess game at homepage (`/`) with content pages (`/for-kids`, `/how-to-play`, `/vs-online`) that link TO game via CTAs. But:

- **No navigation bar** — users on game can't discover content pages
- **No internal linking FROM game** — content pages are dead-ends in reverse direction
- **Single-purpose homepage** — `/` is 100% game, SEO content hidden in sr-only section
- **Fragmented site** — feels like isolated pages, not cohesive website

**Question:** Should we restructure to:

1. Content-rich landing page at `/` with keywords, features, CTA
2. Game moved to `/play` or similar route
3. Navigation bar on all pages linking everything together

**Success Criteria:** Choose architecture that maximizes SEO while preserving UX simplicity.

---

## 🔍 Current State Analysis

### Homepage (`/`) — Game-as-Homepage

**Structure:**

```tsx
<section className="sr-only">  {/* SEO content — hidden visually */}
  <h1>Pass & Play Chess — Free Offline Chess Board</h1>
  <p>300+ words of keyword-rich content</p>
</section>
<div style="fullscreen">  {/* Visible UI */}
  <GoogleAd slot="left-sidebar" />
  <Chessboard />
  <GoogleAd slot="right-sidebar" />
</div>
```

**Layout:** `body { overflow: hidden }` — no scroll, fullscreen game only.

**Pros:**

- ✅ Zero clicks from URL to playable game (core value prop)
- ✅ Distraction-free fullscreen UI
- ✅ Fast — no layout shift or content before game
- ✅ SEO content present (sr-only section for crawlers)

**Cons:**

- ❌ No navigation — users can't discover `/for-kids`, `/how-to-play`, `/vs-online`
- ❌ SEO content hidden — may be flagged as "cloaking" by Google if too aggressive
- ❌ Single-purpose page — can't add more features/links without breaking fullscreen

### Content Pages — Isolated Pages with One-Way Links

**Structure:**

- `/for-kids` — full content page, CTA: "Start Teaching Chess →" links to `/`
- `/how-to-play` — full content page, CTA: "Start Playing →" links to `/`
- `/vs-online` — full content page, CTA: "Start Playing →" links to `/`

**Pros:**

- ✅ Good keyword targeting per page
- ✅ Internal links TO game (drives traffic to core product)

**Cons:**

- ❌ No internal links FROM game (users on `/` can't discover these pages)
- ❌ No navigation between content pages (users on `/for-kids` can't reach `/how-to-play`)
- ❌ Siloed — each page is isolated, no site-wide cohesion

**Current Internal Linking Map:**

```
     /for-kids  →  /  (game)
                    ↑
   /how-to-play  →  /
                    ↑
    /vs-online  →  /

No reverse links. No lateral links.
```

---

## 🏗️ Architecture Alternatives (Comparison)

### Approach 1: Keep Current (Game-as-Homepage, No Nav)

**What:**

- Homepage (`/`) stays as fullscreen game
- No changes to layout or navigation
- Just fix internal linking: add footer/header to content pages with links to each other

**Pros:**

- ✅ Preserves "zero clicks to game" UX (core differentiator)
- ✅ No rework of homepage
- ✅ SEO content already in sr-only section
- ✅ Simplest fix — just add cross-links to content pages

**Cons:**

- ❌ Still no way to discover content pages FROM game
- ❌ Homepage can't showcase features, testimonials, use cases
- ❌ Limited keyword targeting on homepage (sr-only content is 300 words max)
- ❌ Can't add more site-wide elements (nav, footer, announcements) without breaking fullscreen

**SEO Impact:** Medium — improves internal linking but homepage keyword targeting remains limited.

**UX Impact:** Low — game experience unchanged, content pages slightly more connected.

**Effort:** Low (1–2 hours) — add footer to content pages with navigation links.

---

### Approach 2: Landing Page + Game Route + Navigation Bar

**What:**

- **New homepage (`/`):** Content-rich landing page with:
  - Hero section: "Pass & Play Chess — Free Offline Chess Board"
  - Features list: offline, no account, drag-and-drop, etc.
  - Use cases: planes, teaching kids, distraction-free
  - CTA: "Play Now →" links to `/play`
  - Navigation bar: Home | How to Play | For Kids | Pass & Play vs Online
- **Game moves to `/play`:** Same fullscreen board, same UX
- **Navigation bar on all pages:** Sticky nav at top, minimal height (48px)
- **Footer on all pages:** Links to content pages, GitHub, privacy policy

**Pros:**

- ✅ Better SEO — homepage can have 1,000+ words of keyword-rich content
- ✅ Showcases value props before user commits to playing
- ✅ Internal linking works both ways (game ↔ content pages)
- ✅ Site feels cohesive (nav/footer tie everything together)
- ✅ Room to grow — can add blog, FAQ, features page later
- ✅ Standard web pattern — users expect nav bar

**Cons:**

- ❌ No longer "zero clicks to game" — adds one extra click from URL to board
- ❌ More complex — landing page needs design, copy, layout
- ❌ Potential performance hit — landing page adds render time (though game route stays fast)
- ❌ Risk of over-complicating — nav bar may distract from "simple" positioning

**SEO Impact:** High — homepage becomes primary keyword target with rich content. Game route (`/play`) still indexes but as secondary page.

**UX Impact:** Medium — adds one click to play, but improves discoverability of content.

**Effort:** High (1–2 weeks) — design/build landing page, add nav component, migrate game to `/play`, update all routes.

---

### Approach 3: Hybrid (Game-as-Homepage + Sticky Nav Bar)

**What:**

- Homepage (`/`) keeps fullscreen game
- Add **minimal sticky nav bar** at top (transparent or minimal height)
- Nav includes: Logo + Links (How to Play | For Kids | Vs Online)
- Footer remains off-screen (game is still fullscreen)
- Content pages get same nav bar for consistency

**Pros:**

- ✅ Preserves "zero clicks to game" UX
- ✅ Adds internal linking FROM game (users can discover content)
- ✅ Minimal design work (just nav bar component)
- ✅ Site feels more cohesive
- ✅ Can expand nav later (add About, FAQ, Blog links)

**Cons:**

- ❌ Nav bar takes vertical space (reduces game board size slightly)
- ❌ Homepage still can't showcase features/testimonials (game is still fullscreen)
- ❌ Limited keyword expansion on homepage (sr-only content is still hidden)
- ❌ Nav bar may distract from "distraction-free" positioning

**SEO Impact:** Low — internal linking improves but homepage keyword targeting unchanged.

**UX Impact:** Low — adds navigation without major flow changes.

**Effort:** Medium (3–5 days) — build nav component, add to all routes, handle responsive design.

---

### Approach 4: Game-as-Homepage + Hero Content Above Board

**What:**

- Homepage (`/`) has scrollable layout:
  - **Hero section:** 1 viewport tall — headline, features, CTA to scroll/jump to board
  - **Game section:** Fullscreen board below hero (users scroll down to play)
  - **Footer:** Below game with links to content pages
- Navigation bar at top of page
- Content pages get same nav + footer

**Pros:**

- ✅ Best of both worlds — landing page content + game on homepage
- ✅ Users can jump straight to board if they want (skip hero)
- ✅ SEO gets rich content on homepage
- ✅ Internal linking works in all directions

**Cons:**

- ❌ Adds friction — users must scroll to reach game (breaks "zero clicks")
- ❌ Complex layout — hero + fullscreen game + footer is unusual pattern
- ❌ Mobile UX unclear — how does scroll work on touch devices?
- ❌ Potentially confusing — is game primary or secondary content?

**SEO Impact:** High — homepage has rich content and game both indexed on same URL.

**UX Impact:** High — changes core interaction pattern (no longer "instant board").

**Effort:** High (1–2 weeks) — redesign homepage layout, handle scroll behavior, responsive design.

---

## 🔍 Competitor Analysis

| Site                     | Homepage Structure                                          | Game Access                        | Navigation                                               |
| ------------------------ | ----------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| **chess.com**            | Landing page with login/signup CTAs                         | Click "Play" → modal → matchmaking | Full nav bar with Play, Learn, Watch, News, Social       |
| **lichess.org**          | Hybrid — login prompt + "Play with a friend" board embedded | Immediate (board on homepage)      | Full nav bar with Play, Puzzles, Learn, Watch, Community |
| **Physical board sites** | Varied — some landing pages, some game-first                | Mixed                              | Usually minimal or no nav                                |

**Key Insight:** Major platforms (chess.com, lichess) have nav bars and landing pages, but they target **online multiplayer** (requires accounts/matchmaking). Our niche is **offline pass-and-play** (instant access), so their patterns may not apply.

---

## 📊 SEO Considerations

### Landing Page Benefits

**For:**

- More keyword targeting space (1,000+ words vs 300 sr-only)
- Can add features section, testimonials, use cases, FAQs
- Better internal linking (homepage as hub)
- Room to grow (blog index, feature highlights)

**Against:**

- Adds click before user reaches game (may increase bounce rate)
- Splits PageRank between homepage and game route
- More pages = more maintenance

### Game-as-Homepage Benefits

**For:**

- Direct UX match to primary keyword ("pass and play chess" → instant board)
- All PageRank goes to single URL
- Simpler site structure (fewer pages to optimize)

**Against:**

- Limited keyword targeting (sr-only content is constrained)
- Harder to showcase features/social proof
- Can't expand homepage without breaking fullscreen

### Technical SEO Truth

**Reality:** Google can index sr-only content if it's legitimate accessibility text (WCAG pattern). Risk of "cloaking" penalty is low if:

- sr-only content matches visible experience (✅ it does — both are about chess game)
- Content isn't spammy or misleading (✅ it's not — just descriptions)
- Content is genuinely useful for screen reader users (✅ it is)

**Verdict:** sr-only SEO content on game-as-homepage is safe and already working.

---

## 🎯 Recommendation

### ✅ **Approach 3: Hybrid (Game-as-Homepage + Sticky Nav Bar)**

**Why:**

- Preserves core value prop: "zero clicks from URL to playing chess"
- Fixes internal linking problem (nav bar lets users discover content)
- Minimal design/engineering work (just nav component)
- Keeps site simple while improving cohesion
- Allows future expansion (can add more links to nav later)

**Next Steps:**

1. Build reusable `<NavigationBar />` component
2. Add nav to all routes: `/`, `/for-kids`, `/how-to-play`, `/vs-online`
3. Update homepage layout: nav bar + game (reduce board height by 48px)
4. Add footer to content pages with cross-links

**Timeline:** 3–5 days  
**Risk:** Low — nav bar is standard pattern, minimal UX disruption

---

### ❌ **Not Recommended: Approach 2 (Landing Page + `/play` Route)**

**Why:**

- Breaks core differentiator ("zero clicks to game")
- High effort (redesign homepage, build landing page, migrate game)
- SEO benefit is marginal (sr-only content already working)
- Adds complexity without proportional user value

**When to Reconsider:**

- After validating product-market fit (100+ daily active users)
- When you want to add blog, tutorials, or feature showcase
- If conversion rate is high and users want to learn before playing

---

## 📐 Implementation Plan (Approach 3)

### Phase 1: Build Navigation Component (Day 1–2)

**File:** `components/NavigationBar.tsx`

**Structure:**

```tsx
export default function NavigationBar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 h-12">
      <div className="flex items-center justify-between px-4 h-full">
        <Link href="/" className="font-bold text-lg">
          ♟️ Pass & Play Chess
        </Link>
        <div className="flex gap-4">
          <Link href="/how-to-play">How to Play</Link>
          <Link href="/for-kids">For Kids</Link>
          <Link href="/vs-online">Pass & Play vs Online</Link>
        </div>
      </div>
    </nav>
  );
}
```

**Responsive:**

- Desktop: Horizontal nav with all links visible
- Mobile: Hamburger menu (collapsible)

**Accessibility:**

- `<nav>` landmark for screen readers
- `aria-label="Main navigation"`
- Keyboard navigation support

### Phase 2: Add Nav to All Routes (Day 2–3)

**Files to Modify:**

- `app/layout.tsx` — add `<NavigationBar />` to layout
- `app/page.tsx` — adjust board height to account for nav bar (calc(100vh - 48px))
- `app/for-kids/page.tsx` — already has content layout, nav integrates automatically
- `app/how-to-play/page.tsx` — already has content layout, nav integrates automatically
- `app/vs-online/page.tsx` — already has content layout, nav integrates automatically

**Layout Change:**

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavigationBar />
        {children}
      </body>
    </html>
  );
}

// app/page.tsx (game)
<div style={{ height: "calc(100vh - 48px)" }}>
  {" "}
  {/* Subtract nav height */}
  <Chessboard />
</div>;
```

### Phase 3: Add Footer to Content Pages (Day 3)

**File:** `components/Footer.tsx`

**Structure:**

```tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 px-4 mt-12">
      <div className="max-w-3xl mx-auto text-center">
        <nav className="flex justify-center gap-6 mb-4">
          <Link href="/">Play Chess</Link>
          <Link href="/how-to-play">How to Play</Link>
          <Link href="/for-kids">For Kids</Link>
          <Link href="/vs-online">Pass & Play vs Online</Link>
        </nav>
        <p className="text-sm text-gray-600">
          © 2026 Pass & Play Chess. Free forever.
        </p>
      </div>
    </footer>
  );
}
```

**Add to Content Pages:**

- `app/for-kids/page.tsx`
- `app/how-to-play/page.tsx`
- `app/vs-online/page.tsx`

### Phase 4: Testing & Verification (Day 4–5)

**Test Cases:**

- [ ] Nav bar visible on all routes
- [ ] Nav bar sticky (stays at top on scroll)
- [ ] Mobile: hamburger menu works, links accessible
- [ ] Desktop: all links visible and clickable
- [ ] Game board height correct (calc(100vh - 48px))
- [ ] Lighthouse: Performance ≥90, Accessibility ≥90
- [ ] Internal linking works: can navigate from any page to any other page
- [ ] Footer visible on content pages (not on game page)

---

## 🚨 Risks & Mitigation

### Risk 1: Nav Bar Reduces Board Size

**Impact:** Game board is 48px shorter (nav bar height).

**Mitigation:**

- Use minimal nav height (48px, not 64px)
- Consider semi-transparent nav on game page only
- Option: Hide nav on game page (show only on content pages)

### Risk 2: Nav Bar Distracts from "Distraction-Free" Positioning

**Impact:** Marketing claims "zero distractions" but now there's a nav bar.

**Mitigation:**

- Keep nav minimal (logo + 3 links, no ads/promos)
- Position as "simple navigation" not "distraction"
- Consider hiding nav on game page after 3 seconds of inactivity (auto-hide)

### Risk 3: Mobile UX with Hamburger Menu

**Impact:** Mobile users must tap hamburger to see links.

**Mitigation:**

- Use standard hamburger icon (widely understood)
- Test with mobile users (informal testing)
- Ensure touch targets are 44×44px (WCAG 2.5.5)

---

## 📈 Success Metrics

**Goal:** Increase content page traffic by 50% within 30 days of launch.

**How to Measure:**

- Google Analytics: Track navigation clicks from game page (`/`)
- GA4 Events:
  - `nav_click` — user clicks nav link from game page
  - `footer_click` — user clicks footer link from content page
- Compare traffic to `/for-kids`, `/how-to-play`, `/vs-online` before/after nav launch

**Target:**

- 10%+ of game page users click nav links within session
- Content page bounce rate decreases by 10%+ (users navigate between pages)

---

## 📚 Reference Files

**Knowledge Files:**

- `work/spike/seo-pass-and-play-chess.md` — keyword targeting, SEO strategy
- `work/spike/traction-growth-strategies.md` — growth channels, SEO tactics
- `qa/reports/2026-05-08-initial-review.md` — current state audit

**Applicable Standards:**

- `qa-review.instructions.md` — WCAG 2.1 AA requirements (nav accessibility)
- `coding-standards.instructions.md` — component structure, TypeScript patterns
- `testing-standards.instructions.md` — component testing requirements

**Related Tickets:**

- `work/done/seo-technical-improvements.md` — sr-only content already implemented
- `work/done/content-page-how-to-play.md` — existing content page with CTA
- `work/done/content-page-for-kids.md` — existing content page with CTA

---

## ✅ Spike Complete

**Summary:**

- Researched 4 architecture alternatives
- Compared SEO impact, UX tradeoffs, effort
- Recommend: **Hybrid approach (game-as-homepage + nav bar)**
- Preserves core UX, fixes internal linking, minimal effort

**Ready for Product Manager to write ticket.**
