# TwinCloud Website — Deployment Guide

This is a **static site — plain HTML/CSS/JS, no build step, no framework, no `package.json`**. Every page is a self-contained `.html` file with its `<style>` and `<script>` inline (by design — this project intentionally duplicates shared CSS/JS blocks per page rather than using a bundler).

## Pages
- `index.html` — main landing page
- `capture-guide.html` — 360° capture guide (linked from the "How It Works" heading on the homepage)
- `impressum.html`, `privacy-policy.html`, `terms.html` — legal pages
- Shared, non-duplicated code lives in `assets/css/cookie-banner.css` and `assets/js/consent.js` (used by all pages)

## Git remotes — currently TWO, in transition

```
origin  → github.com/csinghtwin/twincloud-website-   (personal GitHub, historical)
gitlab  → gitlab.com/twincloud-group/twincloud-website (company GitLab, becoming primary)
```

**Current policy (per Leo): push to GitLab, deploy from Vercel.** GitHub is being kept in sync during the transition but is not meant to be the long-term home. When pushing changes, push to **both** remotes until told otherwise:

```bash
git push origin main
git push gitlab main
```

If `gitlab` push is rejected due to branch protection, you don't have direct-push rights on `main` — open a Merge Request instead:
```bash
git push gitlab your-branch-name:some-new-branch
# then open a Merge Request on gitlab.com from that branch into main
```

## Git LFS — required for videos

Video files (`*.mp4`, `*.mov`, `*.webm`) are tracked via **Git LFS**, not plain Git (see `.gitattributes`). Without `git-lfs` installed locally, you'll only see tiny pointer text files instead of real video content.

Install: https://git-lfs.github.com, then run once per machine:
```bash
git lfs install
```

## Vercel deployment

- The site auto-deploys on every push to `main` — **no manual build/deploy step**, no CI config needed.
- Vercel project settings: Framework Preset = **Other**, no Build Command, Output Directory = root (`.`).
- **Vercel project → Settings → Git → Git Large File Storage (LFS) must be toggled ON.** Without this, Vercel serves LFS pointer stubs instead of real video files in production — the videos will look broken on the live site even though everything works locally.
- **Known pending item:** Vercel is currently still connected to the **GitHub** repo, not GitLab yet. Reconnecting it (Settings → Git → Disconnect → reconnect to GitLab) has been blocked by a GitLab permissions issue when tried from a Developer-role account — it may work fine from an Owner/Maintainer account. Until this is resolved, **pushing to GitLab alone will NOT update the live site** — GitHub is still what triggers deployment.
- If videos or other large-file changes don't show up after a deploy, try a manual redeploy with **"Use existing Build Cache" unchecked** (Deployments tab → "⋯" on latest deployment → Redeploy).

## Cookie consent / GDPR

- Site-wide cookie banner (`assets/js/consent.js`) gates two things behind explicit consent: the Cal.com booking widget (`functional` category) and Google Analytics (`analytics` category, Measurement ID `G-M8WGG4D329`). Neither loads until a visitor consents — this is intentional and shouldn't be changed without re-verifying GDPR compliance.
- Fonts are self-hosted (`assets/fonts/`) specifically to avoid sending visitor data to Google's font CDN — don't reintroduce a `fonts.googleapis.com` link.

## Known open items (as of this writing)
- Vercel ↔ GitLab reconnection (see above)
- Custom domain (twincloud.ai) connection to Vercel — status should be verified, was deferred earlier in the project
- `terms.html` pricing/payment/duration sections (§6, §10) are still placeholder content pending legal review
