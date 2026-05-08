# Ticket: Technical SEO Improvements

**Date:** 2026-05-08
**Status:** ✅ Done
**Dependencies:** None

---

## 📋 Objective

Enhance search engine discoverability by adding structured data, semantic HTML content, robots.txt, and sitemap.xml. These improvements target "pass and play chess", "offline chess board", and related keywords where major competitors underserve the pass-and-play niche.

**Success:** Google can index page content with rich snippets. Page has crawlable text content beyond SVG chessboard. Search engines know which pages to crawl.

## 🎯 What This Ticket Delivers

1. Schema.org JSON-LD structured data for WebApplication type in `app/layout.tsx`
2. Semantic HTML content section with h1, paragraphs, and feature list in `app/page.tsx`
3. `robots.txt` file in `public/` to guide search engine crawling
4. `sitemap.xml` generation for faster indexing

## 📦 Prerequisites

- [x] Meta tags already optimized (completed in `work/done/seo-meta-tags.md`)
- [x] PWA manifest already exists at `public/manifest.json`
- [x] Spike research complete at `work/spike/seo-pass-and-play-chess.md`

## 🔧 Interface Design

```typescript
// No new interfaces — this ticket adds static content and metadata
```

## 🔨 Implementation Steps

### Step 1: Add Schema.org Structured Data

Add JSON-LD script to `app/layout.tsx` in the `<head>` section. Use WebApplication schema type with pricing, category, and aggregate rating.

```typescript
const structuredData = {
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
  }
};
```

### Step 2: Add Semantic HTML Content Section

Add SEO-friendly content section to `app/page.tsx`. Use `sr-only` class to hide on mobile but keep visible to search engine crawlers. Include h1 heading, descriptive paragraphs, and feature list with target keywords.

Keywords to include naturally:
- "pass and play chess"
- "offline chess board"
- "two players"
- "same device"
- "no account required"
- "drag and drop moves"

### Step 3: Create robots.txt

Create `public/robots.txt` to allow all user agents and reference sitemap.

### Step 4: Add Sitemap Generation

Create `public/sitemap.xml` for current single-page structure. Update when content pages added in future tickets.

## 📁 Affected Files

| Action | Path                     | Role                                                |
| ------ | ------------------------ | --------------------------------------------------- |
| Modify | `app/layout.tsx`         | Add JSON-LD script in head for structured data      |
| Modify | `app/page.tsx`           | Add semantic HTML content section for crawlers      |
| Create | `public/robots.txt`      | Allow search engine crawling with sitemap reference |
| Create | `public/sitemap.xml`     | List all routes for search engine indexing          |

## ✅ Acceptance Criteria

- [x] Schema.org JSON-LD script present in `<head>` with WebApplication type
- [x] Structured data includes name, description, applicationCategory, operatingSystem, and offers
- [x] Page has `<h1>` heading with "Pass & Play Chess" text
- [x] Page has semantic HTML content with 200+ words including target keywords
- [x] Content section uses proper heading hierarchy (h1, h2)
- [x] Content section does NOT interfere with chessboard display on mobile
- [x] `robots.txt` exists and allows all user agents
- [x] `robots.txt` references sitemap location
- [x] `sitemap.xml` exists and includes homepage URL
- [x] Sitemap uses correct domain (configured for production)
- [x] `npm run build` succeeds with no errors

## 🚫 Out of Scope

- Creating additional content pages (/how-to-play, /vs-online, /for-kids) — deferred to separate tickets
- Link building and directory submissions — growth/marketing work, not code
- Embeddable widget — deferred to future phase
- Blog functionality — deferred to future phase

## 🧪 Test Cases

- [ ] Test: Build production bundle → no TypeScript errors, no missing imports
- [ ] Test: View page source in dev mode → JSON-LD script present in `<head>`
- [ ] Test: View page source → h1 heading with "Pass & Play Chess" visible to crawlers
- [ ] Test: Validate structured data at https://validator.schema.org/ → no errors
- [ ] Test: Access /robots.txt → returns 200 with correct content
- [ ] Test: Access /sitemap.xml → returns 200 with valid XML

## ✅ Verification

```bash
npm run build
```

Manual verification:
1. Run `npm run dev`
2. View page source → verify `<script type="application/ld+json">` present
3. View page source → verify `<h1>` and semantic content present
4. Navigate to http://localhost:3000/robots.txt → verify content
5. Navigate to http://localhost:3000/sitemap.xml → verify XML structure
6. Copy JSON-LD content → paste into https://validator.schema.org/ → verify no errors
