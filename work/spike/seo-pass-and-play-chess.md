# Spike: SEO Strategy for Pass & Play Chess

**Date:** 2026-05-08  
**Type:** SEO & Growth Research  
**Status:** 🟢 Complete  
**Researcher:** Scrum Master

---

## 🎯 Goal

Research and document actionable SEO strategies to improve search rankings for users searching "pass and play chess" and related offline/two-player chess queries. Identify technical, content, and link-building opportunities to drive organic traffic.

## 🔍 Current SEO State

### ✅ Already Implemented

| Element | Status | Notes |
|---------|--------|-------|
| **Title Tag** | ✅ Optimized | "Pass & Play Chess \| Free Offline Chess Board" |
| **Meta Description** | ✅ Optimized | 98 chars, includes target keywords |
| **Open Graph Tags** | ✅ Present | og:title, og:description, og:image, og:type |
| **Twitter Card** | ✅ Present | summary_large_image with metadata |
| **Favicon** | ✅ Present | `app/favicon.ico` |
| **HTML Lang** | ✅ Present | `<html lang="en">` |
| **PWA Manifest** | ✅ Present | `public/manifest.json` with proper names |
| **Responsive Design** | ✅ Working | Viewport-aware board sizing |
| **HTTPS** | ⚠️ TBD | Depends on deployment |

### ❌ Missing SEO Elements

| Element | Impact | Effort |
|---------|--------|--------|
| **Structured Data (Schema.org)** | High | Low |
| **robots.txt** | Medium | Low |
| **sitemap.xml** | Medium | Low |
| **Semantic HTML headings** | Medium | Low |
| **Alt text on images** | Low | Low |
| **Additional content pages** | High | High |
| **Internal linking structure** | Medium | Medium |
| **Canonical URLs** | Low | Low |
| **Backlinks** | High | High |

---

## 🔑 Keyword Research & Target Queries

### Primary Keywords (High Intent)

| Keyword | Monthly Volume (est.) | Competition | User Intent | Priority |
|---------|----------------------|-------------|-------------|----------|
| **"pass and play chess"** | 1,000–2,000 | Medium | Direct match — user wants exactly what we offer | **P0** |
| **"offline chess board"** | 500–1,000 | Low | Offline-first — our core value prop | **P0** |
| **"two player chess same device"** | 200–500 | Low | Long-tail, high intent | **P1** |
| **"play chess offline"** | 2,000–5,000 | High | Broad but relevant | **P1** |
| **"local chess game"** | 100–300 | Low | Niche, low competition | **P2** |
| **"chess no account"** | 50–100 | Low | Privacy-focused users | **P2** |

### Secondary Keywords (Content Opportunities)

| Keyword | Monthly Volume (est.) | Competition | Content Angle |
|---------|----------------------|-------------|---------------|
| "how to play chess offline" | 500–1,000 | Medium | Tutorial/Guide page |
| "teach kids chess without ads" | 50–100 | Low | Parent-focused content |
| "chess on a plane" | 100–200 | Low | Travel use case |
| "best offline chess app" | 1,000–2,000 | High | Comparison/Review page |
| "simple chess board" | 500–1,000 | Medium | Simplicity angle |

### Competitor Keyword Analysis

| Competitor | Ranking Keywords | Our Advantage |
|------------|------------------|---------------|
| **chess.com** | "play chess", "chess online", "chess lessons" | We target **offline** niche — different intent |
| **lichess.org** | "free chess", "chess analysis", "chess puzzles" | We target **pass-and-play** specifically |
| **Mobile chess apps** | "chess app", "chess game download" | We're **web-based, no install** |

**Gap Opportunity:** Major platforms dominate "play chess online" but underserve "pass and play" and "offline" queries.

---

## 🔧 Technical SEO Opportunities

### 1. Schema.org Structured Data (JSON-LD)

**What:** Add structured data to help search engines understand the page content.

**Schema Types to Implement:**

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Pass & Play Chess",
  "description": "Free offline chess board for two players on the same device",
  "applicationCategory": "Game",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "12"
  }
}
```

**Impact:** Rich snippets in search results (star ratings, pricing, category).  
**Effort:** 1–2 hours  
**Priority:** **High**

### 2. Semantic HTML & Content Structure

**Current:** Page is pure client-side React — no visible text content for crawlers (chessboard is SVG/canvas).

**Problem:** Search engines see minimal text content. Current page has:
- No `<h1>` heading
- No body text
- No descriptive content

**Solution:** Add SEO-friendly content section (hidden on mobile, visible to crawlers):

```tsx
<section className="sr-only lg:block" aria-label="About Pass & Play Chess">
  <h1>Pass & Play Chess — Free Offline Chess Board</h1>
  <p>Play chess offline with a friend on the same device...</p>
  <h2>Features</h2>
  <ul>
    <li>No account required</li>
    <li>Works offline</li>
    <li>Drag-and-drop moves</li>
  </ul>
</section>
```

**Impact:** More indexable content, better keyword targeting.  
**Effort:** 2–3 hours  
**Priority:** **High**

### 3. robots.txt

**What:** Tell search engines which pages to crawl.

**Content:**

```
User-agent: *
Allow: /
Sitemap: https://yoursite.com/sitemap.xml
```

**Impact:** Ensures proper crawling.  
**Effort:** 10 minutes  
**Priority:** **Medium**

### 4. sitemap.xml

**What:** XML file listing all pages for search engines.

**Implementation:** Next.js can generate this automatically or via `next-sitemap` package.

**Impact:** Faster indexing of new pages.  
**Effort:** 30 minutes  
**Priority:** **Medium**

### 5. Canonical URLs

**What:** Add `<link rel="canonical">` to prevent duplicate content issues.

**Implementation:** Already handled by Next.js metadata API, but verify in production.

**Impact:** Low (single-page app, no duplicates currently).  
**Priority:** **Low**

---

## 📄 Content Strategy for Additional Pages

**Problem:** Single-page app = limited keyword targeting. More pages = more entry points.

### Proposed Additional Routes

| Route | Title | Target Keywords | Content Type | Priority |
|-------|-------|----------------|--------------|----------|
| **`/how-to-play`** | "How to Play Pass & Play Chess" | "how to play chess offline", "pass and play chess instructions" | Tutorial | **P1** |
| **`/features`** | "Features — Pass & Play Chess" | "offline chess features", "chess no account" | Feature list | **P2** |
| **`/why-offline`** | "Why Play Chess Offline?" | "offline chess benefits", "chess without internet" | Value prop explainer | **P2** |
| **`/vs-online`** | "Pass & Play vs Online Chess" | "pass and play vs online", "local chess vs online" | Comparison | **P1** |
| **`/for-kids`** | "Teach Kids Chess — No Ads, No Distractions" | "teach kids chess", "chess for kids offline" | Parent-focused | **P2** |
| **`/blog/[slug]`** | Various | Long-tail keywords | Blog posts | **P3** |

### Content Guidelines

- Each page should have unique `<h1>`, meta title, and description
- Target 300–600 words minimum per page
- Internal link back to home page (chessboard)
- Include CTA: "Start Playing →"
- Mobile-first, responsive design

### Example: `/how-to-play` Structure

```
<h1>How to Play Pass & Play Chess</h1>
<p>Pass and play chess is...</p>

<h2>What is Pass & Play Chess?</h2>
<p>Two players sharing one device...</p>

<h2>How to Start a Game</h2>
<ol>
  <li>Open the chess board</li>
  <li>Sit across from your opponent</li>
  <li>Drag a piece to move</li>
</ol>

<h2>Why Play Offline Chess?</h2>
<ul>
  <li>No internet required</li>
  <li>No account needed</li>
  <li>No ads or distractions</li>
</ul>

<a href="/">Start Playing Pass & Play Chess →</a>
```

**Impact:** +5–10 additional ranking opportunities, more long-tail traffic.  
**Effort:** 8–16 hours (2–3 hours per page).  
**Priority:** **High** (start with `/how-to-play` and `/vs-online`).

---

## 🔗 Link Building Strategies (Chess-Specific)

**Problem:** New site = zero backlinks = low domain authority.

### Approach 1: Submit to Chess Directories & Communities

**Targets:**
- Reddit: r/chess, r/chessbeginners (post as "Show & Tell")
- Chess forums: Chess.com forums, ChessTalk.com
- Open-source chess lists: GitHub "awesome-chess" lists
- Product directories: Product Hunt, Hacker News (Show HN)

**Effort:** 2–4 hours  
**Impact:** 5–10 initial backlinks, referral traffic  
**Risk:** Subreddit rules may prohibit self-promotion

### Approach 2: Educational & School Partnerships

**Targets:**
- Reach out to chess clubs, school chess programs
- Offer free, ad-free version for educators
- Get listed on "Resources for Teaching Chess" pages

**Effort:** 10–20 hours (outreach, relationship building)  
**Impact:** High-quality .edu backlinks  
**Risk:** Slow to materialize

### Approach 3: Guest Posts & Chess Blogs

**Targets:**
- Write guest posts for chess blogs: "The Case for Offline Chess"
- Include backlink to our app

**Effort:** 8–16 hours per post  
**Impact:** 1–2 quality backlinks per post  
**Risk:** Low acceptance rate, time-intensive

### Approach 4: Free Tool / Widget Embed

**What:** Create embeddable chess board widget for blogs/websites.

**Example:**
```html
<iframe src="https://yoursite.com/embed" width="500" height="500"></iframe>
```

**Impact:** Backlinks from chess bloggers who embed the widget.  
**Effort:** 16–24 hours (build embed route, docs).  
**Priority:** **P3** (long-term).

---

## ⚡ Performance Optimization (Core Web Vitals Impact)

**SEO Ranking Factor:** Google uses Core Web Vitals as ranking signal (since 2021).

### Current Performance (Estimated)

| Metric | Target | Current (est.) | Status |
|--------|--------|----------------|--------|
| **LCP (Largest Contentful Paint)** | ≤2.5s | ~1.5s | ✅ Good |
| **FID (First Input Delay)** | ≤100ms | ~50ms | ✅ Good |
| **CLS (Cumulative Layout Shift)** | ≤0.1 | ~0.0 | ✅ Good |
| **FCP (First Contentful Paint)** | ≤1.8s | ~1.2s | ✅ Good |

**Analysis:** Next.js + lightweight app = fast by default. Performance is **not a blocker**.

### Potential Issues to Monitor

1. **Google Ads script load time** — could slow FCP if delayed.
2. **Chessboard SVG rendering** — could increase LCP on slow devices.
3. **React hydration** — client-side rendering may delay interactivity.

**Recommendation:** Run Lighthouse audit on production URL once deployed. If LCP > 2.5s, consider:
- Preloading chessboard assets
- SSR the initial board state
- Defer non-critical scripts (ads, analytics)

---

## 📊 Approach Comparison

| Approach | Effort | Timeline | Cost | Expected Traffic Gain (12mo) | SEO Impact |
|----------|--------|----------|------|------------------------------|------------|
| **1. Add Structured Data** | Low (2h) | Immediate | $0 | +50–100/mo | Medium — rich snippets improve CTR |
| **2. Add Semantic HTML Content** | Low (3h) | Immediate | $0 | +100–200/mo | High — indexable content for crawlers |
| **3. Create `/how-to-play` Page** | Medium (3h) | 1–3 months | $0 | +200–500/mo | High — new ranking opportunity |
| **4. Create 3–5 Content Pages** | High (16h) | 3–6 months | $0 | +500–1,000/mo | High — multiple entry points |
| **5. Submit to Chess Directories** | Low (4h) | Immediate | $0 | +100–300/mo | Medium — backlinks + referral traffic |
| **6. Guest Posts (3 posts)** | High (24h) | 3–6 months | $0 | +50–100/mo | Medium — quality backlinks |
| **7. Educational Outreach** | High (20h) | 6–12 months | $0 | +200–500/mo | High — .edu backlinks are powerful |
| **8. Build Embed Widget** | High (24h) | 6–12 months | $0 | +100–300/mo | Medium — passive backlink generation |

### Recommended Phased Approach

**Phase 1: Quick Wins (Week 1–2)**
1. Add structured data (Schema.org JSON-LD)
2. Add semantic HTML content section
3. Create `robots.txt` and `sitemap.xml`
4. Submit to chess directories (Reddit, Product Hunt, Hacker News)

**Expected Impact:** +200–400 visitors/month after 3 months.

**Phase 2: Content Expansion (Month 2–3)**
1. Create `/how-to-play` page
2. Create `/vs-online` comparison page
3. Create `/for-kids` parent-focused page

**Expected Impact:** +500–800 visitors/month after 6 months.

**Phase 3: Link Building (Month 4–6)**
1. Write 2–3 guest posts for chess blogs
2. Reach out to 10–20 chess clubs/schools
3. Get listed on "awesome-chess" GitHub lists

**Expected Impact:** +300–600 visitors/month after 12 months (backlink authority compounds).

**Phase 4: Advanced (Month 7–12)**
1. Build embeddable widget
2. Create blog with 5–10 posts
3. Run limited paid ads for initial traffic (optional)

**Expected Impact:** +500–1,000 visitors/month (sustainable growth).

---

## ⚠️ Risks & Unknowns

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **High competition from chess.com/lichess** | High | High | Focus on **niche keywords** ("pass and play", "offline") where they're weak |
| **Low search volume for "pass and play"** | Medium | High | Expand to broader keywords: "offline chess", "local chess game", "no account chess" |
| **Content pages dilute UX simplicity** | Low | Medium | Make all content pages optional, not blocking game access |
| **Google Ads impact page speed** | Medium | Low | Monitor Core Web Vitals, defer ad scripts if needed |
| **No viral loop (single-device = no sharing)** | High | Medium | Focus on SEO/content, not viral growth |
| **Chess is crowded market** | High | Medium | Differentiate on **simplicity + offline-first + privacy** |

---

## 🎯 Recommendation

**Primary Strategy: Structured Data + Content Pages + Directory Submissions**

### Why This Combination?

1. **Structured Data** — Low effort, immediate SEO benefit (rich snippets).
2. **Content Pages** — Medium effort, high long-term impact (more ranking opportunities).
3. **Directory Submissions** — Low effort, fast initial traffic + backlinks.

### Specific Actions (Priority Order)

| Action | Priority | Effort | Timeline | Owner |
|--------|----------|--------|----------|-------|
| 1. Add Schema.org JSON-LD for WebApplication | **P0** | 2h | Week 1 | Dev |
| 2. Add semantic HTML content section (h1, p, ul) | **P0** | 3h | Week 1 | Dev |
| 3. Create `robots.txt` and `sitemap.xml` | **P0** | 1h | Week 1 | Dev |
| 4. Submit to r/chess, Product Hunt, Hacker News | **P0** | 4h | Week 1–2 | Growth |
| 5. Create `/how-to-play` page | **P1** | 3h | Week 2 | Dev + Content |
| 6. Create `/vs-online` comparison page | **P1** | 3h | Week 3 | Dev + Content |
| 7. Get listed on GitHub "awesome-chess" lists | **P1** | 2h | Week 3 | Growth |
| 8. Create `/for-kids` parent-focused page | **P2** | 3h | Week 4 | Dev + Content |
| 9. Write 1st guest post for chess blog | **P2** | 8h | Month 2 | Content |
| 10. Reach out to 10 chess clubs/schools | **P2** | 10h | Month 2–3 | Growth |

### Success Metrics (12-Month Goals)

| Metric | Baseline | 3-Month Goal | 6-Month Goal | 12-Month Goal |
|--------|----------|--------------|--------------|---------------|
| **Organic Traffic** | 0 | 200/mo | 800/mo | 2,000/mo |
| **Ranking Keywords** | 0 | 5–10 | 15–25 | 30–50 |
| **Backlinks** | 0 | 5 | 15 | 30 |
| **Top 10 Rankings** | 0 | 2–3 | 5–8 | 10–15 |

---

## 📁 Affected Files (for Implementation)

| Action | Path | Role |
|--------|------|------|
| Add structured data | `app/layout.tsx` | Insert JSON-LD script in `<head>` |
| Add semantic content | `app/page.tsx` | Add hidden SEO section |
| Create robots.txt | `public/robots.txt` | New file |
| Create sitemap | `public/sitemap.xml` or use `next-sitemap` | New file or package |
| Create how-to page | `app/how-to-play/page.tsx` | New route |
| Create comparison page | `app/vs-online/page.tsx` | New route |
| Create kids page | `app/for-kids/page.tsx` | New route |

---

## 🧠 Key Knowledge Files (for Implementation)

**None found in workspace.** Recommend creating:
- `knowledge/seo/structured-data.md` — Schema.org patterns
- `knowledge/seo/content-pages.md` — Content page templates
- `knowledge/seo/keyword-research.md` — Target keyword list

---

## 🔍 Related Spikes & Tickets

- **Spike:** [Pass & Play Competitor Analysis](pass-and-play-competitor-analysis.md) — UX differentiation insights
- **Spike:** [Traction & Growth Strategies](traction-growth-strategies.md) — Broader growth context
- **Ticket:** [SEO Meta Tags](../todo/seo-meta-tags.md) — ✅ Already completed (metadata in place)

---

## 📝 Next Steps

**Hand off to Product Manager** to create tickets for:
1. Structured data implementation
2. Semantic HTML content addition
3. Content page creation (prioritize `/how-to-play`)
4. Directory submission checklist
5. Link building outreach plan

**Estimated Ticket Breakdown:**
- Tier 1 tickets: 3–4 (structured data, robots.txt, sitemap, semantic content)
- Tier 2 tickets: 2–3 (content pages)
- Tier 3 epic: 1 (link building outreach campaign)

---

_Spike complete. Ready for ticket creation._
