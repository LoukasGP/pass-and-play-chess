# User To-Do List

Manual tasks remaining after automated implementation.

---

## 🎨 Design Assets

### OG Image (Social Sharing)

- [x] Create `/public/og.png` (1200×630 pixels)
- [x] Use chess board or logo graphic
- [x] Include "Pass & Play Chess" text
- [ ] Test preview at https://www.opengraph.xyz/

### PWA Icons (Installable App)

- [x] Create `/public/icon-192.png` (192×192 pixels)
- [x] Create `/public/icon-512.png` (512×512 pixels)
- [x] Use chess board or logo graphic (same design, different sizes)
- [ ] Verify in Chrome DevTools → Application → Manifest

---

## 🔧 Environment Variables

### Google Analytics 4

- [ ] Create GA4 property at https://analytics.google.com/
- [ ] Copy Measurement ID (format: `G-XXXXXXXXXX`)
- [ ] Set `NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX` in `.env.local`
- [ ] Verify events in GA4 Real-Time view after deploying

### Google AdSense (Already Set Up)

- [ ] Confirm `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set in production
- [ ] Verify ads render on desktop (≥1024px) after deployment

---

## 🚀 Deployment

- [ ] Deploy to production (Vercel, Netlify, etc.)
- [ ] Verify OG tags with social media preview tools
- [ ] Test PWA install on mobile Chrome (visit 2x → "Add to Home Screen")
- [ ] Check GA4 events in real-time view
- [ ] Monitor ad viewability in AdSense dashboard

---

## 📊 Success Metrics to Track

Once GA4 is configured, monitor these metrics from competitor analysis:

- [ ] Time to first move: target <3 seconds
- [ ] Mobile traffic: target >60% of sessions
- [ ] Bounce rate: target <30%
- [ ] Session duration: target >5 minutes
- [ ] Return visitors: target >20%
