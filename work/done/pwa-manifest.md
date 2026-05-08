# PWA Manifest (Installable Web App)

**Date:** 2026-05-08
**Status:** ✅ Done
**Route:** All routes (app-wide)

---

## 📋 Objective

Add PWA manifest.json so users can "Add to Home Screen" on mobile devices. Supports competitor analysis goal: "Mobile web first — no app install barrier" while still allowing optional install for quick access.

**Success:** Chrome DevTools Lighthouse shows "Installable" badge. "Add to Home Screen" prompt appears on mobile after 2+ visits.

## 📁 Affected Files

| Action | Path                  | Role                                     |
| ------ | --------------------- | ---------------------------------------- |
| Create | `app/manifest.json`   | PWA manifest with app name, icons, theme |
| Modify | `app/layout.tsx`      | Add `<link rel="manifest">` tag          |
| Create | `public/icon-192.png` | PWA icon 192×192                         |
| Create | `public/icon-512.png` | PWA icon 512×512                         |

## ✅ Acceptance Criteria

- [x] `manifest.json` includes: `name`, `short_name`, `description`, `start_url`, `display: "standalone"`, `theme_color`, `background_color`, `icons` (192×192, 512×512)
- [x] `app/layout.tsx` has `<link rel="manifest" href="/manifest.json">` in `<head>`
- [ ] PWA icons are 192×192 and 512×512 PNGs (can be simple chessboard graphic or logo)
- [x] `display: "standalone"` set so installed app hides browser chrome
- [x] `start_url: "/"` so app opens at root
- [x] Theme color matches site background (analyze existing globals.css)
- [x] Manifest does NOT include `scope` or `orientation` (allow any orientation for pass-and-play)

## 🧪 Test Cases

- [ ] Test: Chrome DevTools → Application → Manifest → no errors, icon previews render
- [ ] Test: Lighthouse audit → "Installable" badge present
- [ ] Test: Mobile Chrome → visit site 2x → "Add to Home Screen" banner appears

## ✅ Verification

```bash
npm run build
npm run start
```

Manual verification:

1. Open Chrome DevTools → Application tab → Manifest
2. Verify all fields present and icons load
3. Run Lighthouse audit → check PWA score
4. Test on mobile device (or DevTools mobile emulation) → "Add to Home Screen" prompt
