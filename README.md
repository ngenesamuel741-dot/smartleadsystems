# Smart Lead Systems website

React + Vite site with a built-in admin (Firebase), lead alerts, ad tracking and SEO. White primary, green `#0D7948` accent.

## Deploy (important: use GitHub, not drag-and-drop)
Netlify must BUILD the site so it can create the sitemap, pages and functions. Push this folder to GitHub, then Netlify → Add new site → Import from Git. `netlify.toml` has everything. Dragging a folder into Netlify skips the build and the functions, which causes 404s on `/sitemap.xml` and inner pages.

## One-time setup
1. **Firestore rules:** Firebase → Firestore → Rules → paste `firestore.rules` → Publish (re-publish whenever this file changes).
2. **Firebase Authentication:** enable Email/Password, create the user `smartleadads.business@gmail.com`. Add your netlify.app and smartlead.ng addresses under Authorized domains.
3. **Admin:** open `/admin`, sign in, and in each section press **Import default content**, then edit.
4. **Netlify environment variables** (Site configuration → Environment variables; then Deploys → Trigger deploy). These are passwords, so they live here and never in the website:

| Variable | What it does | Where to get it |
|---|---|---|
| `RESEND_API_KEY` | Emails you every lead | resend.com → sign up with smartleadads.business@gmail.com → API Keys |
| `LEAD_NOTIFY_EMAIL` | (optional) who gets the alert, comma separated | defaults to the email in Site settings |
| `META_CAPI_TOKEN` | Meta Conversions API | Events Manager → your Pixel → Settings → Conversions API → Generate access token |
| `META_TEST_EVENT_CODE` | (optional) for testing only | Events Manager → Test events. Delete it when you go live |
| `TIKTOK_EVENTS_TOKEN` | TikTok Events API | TikTok Events Manager → Web events → your pixel → Settings → Events API → Generate access token |
| `TIKTOK_TEST_EVENT_CODE` | (optional) for testing only | TikTok Events Manager → Test events |

5. **Pixel IDs** (not secret) go in `/admin` → Site settings → Tracking: Google Analytics ID, Meta Pixel ID, TikTok Pixel ID.
6. **Auto-update (recommended):** Netlify → Build & deploy → Build hooks → add one, paste the URL in `/admin` → Site settings → "Auto-update the live site". Saves in the admin then rebuild the site a minute later so Google sees new pages and the sitemap.
7. **Google Search Console:** submit `https://smartlead.ng/sitemap.xml`.

`/admin` → Site settings → "Connections" shows which of email, Meta and TikTok are connected.

## Photos and videos (no links needed)
Every photo spot in `/admin` has an **Upload from phone** button: pick from your gallery, take a new photo, or (for services, projects and blog covers) record or choose a video. Big photos are shrunk automatically before upload, and Cloudinary converts them to fast modern formats for visitors. In blog articles and the founder bio, tap **+ Add photo or video here** to drop one straight into the text.
Cloudinary setup (already in `src/config.js`: cloud `twlqodtl`, preset `Smartleadsystems`): in Cloudinary → Settings → Upload → the preset must be **Unsigned**, and **Allowed formats should be empty or include images and videos (jpg, png, webp, mp4, mov, webm)**. Free plan limits: photos 10 MB, videos 100 MB.

## WhatsApp buttons
Every WhatsApp button opens WhatsApp with a message already typed, so the visitor only taps send. Edit them in `/admin`: general message and thank-you message under Site settings, and a message per service, package, project and article. Leave one empty to use an automatic message built from its name.

## Lead form
`/admin` → **Lead form questions**: add, edit, reorder, hide and require questions (short answer, long answer, dropdown, multiple choice, tick box). For dropdown and multiple-choice questions, list the **answers that mean NOT a fit**. Those leads:
- are saved under Leads → **Not a fit** (you can still read them or "Mark as qualified"),
- see the **not-a-fit thank-you page** (`/thank-you-info`, editable in Site settings),
- are NOT sent to Meta, TikTok or Google as a Lead.

Qualified leads go to `/thank-you` (editable), are emailed to you, saved in Leads, and sent as a Lead to Meta (Pixel + Conversions API, de-duplicated by event ID), TikTok (Pixel + Events API) and Google Analytics. Name and Email are always on the form. A "monthly budget" example question is included but hidden: turn it on and add the answers you want to screen out.

Each lead also records where it came from (referrer, landing page, UTM campaign). Ad events are only sent for visitors who accepted cookies, unless you tick "Track visitors without asking" in Site settings.

## Leads and export
`/admin` → Leads: today's qualified leads, all-time leads (search, filter), Not a fit, per-day counts, and **Export Excel (.xlsx) / CSV** with a column for every question you have ever asked.

## SEO and AI visibility
`sitemap.xml`, `rss.xml`, `llms.txt` and every page and blog post are written as real files at build time (`scripts/prerender.mjs`). Posts published since the last build are served instantly by `netlify/functions/seo.mjs`. Pages carry full text, structured data and image descriptions. `/admin` and the thank-you pages are noindex and not in the sitemap.

## Run locally
`npm install`, `npm run dev`. `npm run build` makes `dist/`. `npm run build:preview` refreshes `preview/` (open `preview/index.html` in Spck/Acode).

## Brand
Colours are at the top of `src/site.css` and `src/admin.css`.
