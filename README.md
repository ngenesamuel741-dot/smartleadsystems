# Smart Lead Systems website: complete guide

A fast website with a built-in admin (control room), lead capture with email alerts, ad tracking and strong SEO. This guide is written for the owner, in plain language. Developers: see the last section.

---

## 1. Your addresses

| What | Address | Notes |
|---|---|---|
| Website | `https://smartlead.ng` | Pages: Services, Work, Pricing, Insights (blog), Contact |
| **Lead form** | `https://smartlead.ng/contact` | This IS the lead form. It has no separate link. |
| Pricing page | `https://smartlead.ng/pricing` | Each package button opens the lead form with that package chosen |
| Admin | `https://smartlead.ng/admin` | Hidden from visitors. Sign in with your admin email |
| Founder page | `https://smartlead.ng/founders` | Linked from the footer only |
| Sitemap / RSS / AI guide | `/sitemap.xml`, `/rss.xml`, `/llms.txt` | Created automatically |

### Links you can use in ads, bio and WhatsApp (the form opens already filled in)
- Choose a package: `https://smartlead.ng/contact?plan=Growth%20Retainer` (use the exact package name; `%20` is a space)
- Choose a service: `https://smartlead.ng/contact?service=Website%20Development`
- Add `&utm_source=meta&utm_campaign=october` to any link to see which ad a lead came from.

### Why don't I see pricing on the contact page?
Packages are shown on **/pricing** and in the form as a dropdown named **"Which package are you interested in?"**. If your form does not have it yet: Admin → Overview → press **Apply update** on "Add a package question to the lead form". The dropdown fills itself from Admin → Pricing. If a package is missing on the site, open Admin → Pricing → the package → tick **Show on site**.

---

## 2. Putting the site online (GitHub → Netlify)
1. Put all files in your GitHub repo (the files `netlify.toml`, `package.json` and folders `src`, `netlify`, `scripts` must be at the **top level**, not inside another folder).
2. Netlify → your site → **Deploys**. A new deploy starts by itself. Wait for **Published**.
3. If it says **Failed**, open it and read the red line near the bottom. A failed deploy leaves the previous version live.
4. Do NOT drag and drop a folder into Netlify. That skips the build and the functions.

---

## 3. One-time setup checklist
- [ ] **Firebase → Firestore → Rules:** paste the contents of `firestore.rules` and press **Publish** (do this again whenever that file changes).
- [ ] **Firebase → Authentication:** Email/Password on; create the user `smartleadads.business@gmail.com`. Add `smartlead.ng` and your `.netlify.app` address under Authorized domains.
- [ ] **Admin first login:** `/admin`. In each section press **Import default content**, then edit it. On Overview, press **Apply update** on any update cards.
- [ ] **Cloudinary:** preset `Smartleadsystems` must be **Unsigned**, with Allowed formats empty or including images and videos.
- [ ] **Netlify environment variables** (section 4 and 8).
- [ ] **Google Search Console:** submit `https://smartlead.ng/sitemap.xml`.

---

## 4. Email alerts with Resend (every lead emailed to you)

### Set up (5 minutes)
1. Go to **resend.com** and sign up with **smartleadads.business@gmail.com** (the same email you sign in to /admin with). Verify the email.
2. Resend → **API Keys** → **Create API Key** → name `smartlead-site`, permission **Sending access** → copy the key (starts with `re_`).
3. Netlify → your site → **Site configuration → Environment variables → Add a variable**:
   - Key: `RESEND_API_KEY`   Value: your `re_…` key
   - Make sure it is available to **Functions** (leave all scopes ticked).
4. Netlify → **Deploys → Trigger deploy → Clear cache and deploy site**. (Variables only take effect after a new deploy.)
5. Open `/admin` → **Site settings** → at the top, **Connections** → press **Send a test email**.
   - ✓ green message: it works. Check your inbox and Spam. Mark it "Not spam".
   - ✗ red message: read it; it is Resend's exact answer. See the table below.

### Who receives the alerts?
In this order: the Netlify variable `LEAD_NOTIFY_EMAIL` → the admin setting **"Email that receives lead alerts"** (Site settings → Lead form & thank-you pages) → your admin email.
**Important:** with Resend's free sender (`onboarding@resend.dev`), Resend only delivers to the email you signed up with. The site now detects this and re-sends to that address automatically, so alerts are not lost.

### If something is wrong (what the message means)
| You see | Meaning | Fix |
|---|---|---|
| `RESEND_API_KEY is not set` | Netlify does not have the key | Add the variable (step 3), then redeploy (step 4) |
| `Resend said 401 … API key is invalid` | Wrong or deleted key | Create a new key, replace the variable, redeploy |
| `403 … You can only send testing emails to your own email address (x@y.com)` | Free sender can only email its owner | Nothing needed: it re-sends to x@y.com. To email any address, verify a domain (below) |
| `403 … domain is not verified` | `RESEND_FROM` uses a domain you have not verified | Verify the domain in Resend → Domains, or delete `RESEND_FROM` |
| `Could not reach the function` | Site not deployed with the latest code | Check Netlify Deploys, redeploy |
| "Please sign in to the admin again" | Admin session expired | Sign out and in again |
| Test works but real leads send nothing | Lead was saved but the function was blocked | Netlify → **Logs → Functions → lead** shows a line for every lead, e.g. `lead abc email=sent` |

### Optional: send from your own address (alerts@smartlead.ng, any recipient)
Resend → **Domains** → add `smartlead.ng` → add the DNS records it shows (at your domain provider) → when verified, add Netlify variable `RESEND_FROM` = `Smart Lead Systems <alerts@smartlead.ng>` and redeploy. You can then set `LEAD_NOTIFY_EMAIL` to several addresses separated by commas.

### Where to look when a lead email is missing
1. Admin → Leads: the lead is always saved there first.
2. Spam folder.
3. Netlify → Logs → Functions → `lead`.

---

## 5. The lead form and Leads
- **Edit the form:** Admin → **Lead form questions**. Add, hide, reorder, require. Types: short text, long text, dropdown, multiple choice, tick box.
- **Qualifying:** for dropdown/multiple-choice questions, list the **answers that mean NOT a fit** (exactly as written in the choices). Those people:
  - are saved under **Leads → Not a fit** (you can still read them, or press **Mark as qualified**),
  - see the **not-a-fit thank-you page** (editable in Site settings),
  - are NOT sent to Meta, TikTok or Google as a Lead.
- **Qualified leads:** go to the thank-you page (editable), are emailed to you, and are sent as a Lead to Meta (Pixel + Conversions API), TikTok (Pixel + Events API) and Google Analytics.
- **Leads page:** Today, All-time (search and filter), Not a fit, leads per day, and **Export Excel (.xlsx)** or CSV. Each lead shows where it came from (ad campaign, Google, ChatGPT...).
- A "monthly budget" example question is included but hidden. Turn it on and add the answers you want to screen out.

---

## 6. Editing your website (Admin)
Everything on the website is edited in `/admin`:
Site settings (hero, contact, footer, SEO, social, tracking, WhatsApp messages), Services, Work, Pricing, Blog posts, Testimonials, Client logos, Founder, FAQs, How we work, Who we help, Lead form questions, Legal pages, Leads.

### Photos and videos
Every photo spot has **Upload from phone** (gallery or camera). Services, projects, blog posts and the founder page also have **More photos** (choose several at once, reorder, remove). Blog articles have **+ Add photo or video here**. Big photos are shrunk before upload; Cloudinary makes them fast.
**Clickable images:** on Services, Work and the Founder page, tapping a photo opens it full screen (swipe or arrows for the rest). Blog post images are not clickable.

### WhatsApp buttons
Every WhatsApp button opens WhatsApp with a message already typed. Edit them: general and thank-you messages in Site settings; one per service, package, project and article in each item (leave empty for an automatic message).

### Auto-update
Netlify → Build & deploy → Build hooks → add one → paste it in Admin → Site settings → **Auto-update the live site**. After you save content the site rebuilds a minute later so Google sees it.

---

## 7. Ads tracking
- **Pixel IDs** (not secret): Admin → Site settings → Tracking: Google Analytics, Meta Pixel, TikTok Pixel.
- **Secret tokens** go in Netlify variables: `META_CAPI_TOKEN`, `TIKTOK_EVENTS_TOKEN` (optional testing: `META_TEST_EVENT_CODE`, `TIKTOK_TEST_EVENT_CODE`; delete these after testing).
  - Meta token: Events Manager → your Pixel → Settings → Conversions API → Generate access token.
  - TikTok token: Events Manager → Web events → your pixel → Settings → Events API → Generate access token.
- Admin → Site settings → **Connections** shows which are connected. Ad events are sent only for visitors who accepted cookies (unless you tick "Track visitors without asking").

---

## 8. Netlify variables at a glance
| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Lead emails (required for alerts) |
| `LEAD_NOTIFY_EMAIL` | Optional: who gets alerts (comma separated) |
| `RESEND_FROM` | Optional: your verified sender |
| `META_CAPI_TOKEN`, `META_TEST_EVENT_CODE` | Meta Conversions API |
| `TIKTOK_EVENTS_TOKEN`, `TIKTOK_TEST_EVENT_CODE` | TikTok Events API |
| `ADMIN_EMAILS` | Optional: extra admin emails allowed to press "Send a test email" |
After changing any variable: **Deploys → Trigger deploy**.

---

## 9. SEO and AI visibility
`sitemap.xml`, `rss.xml`, `llms.txt` and every page and blog post are real files made at build time. Posts published since the last build are served instantly by a function. Pages have full text, structured data (Organization, BlogPosting, FAQ, Person, Breadcrumbs) and image descriptions.
Sitemap: every page is `daily` with high priority (home and blog 1.0). Google treats these as hints; what really speeds indexing is publishing often, an accurate `lastmod` (set from your newest post), the RSS feed, and **Request indexing** in Search Console for important new posts.
`/admin` and the thank-you pages are not indexed and not in the sitemap.

---

## 10. Troubleshooting
- **Site shows an old version / old error screen:** Netlify → Deploys → is the latest deploy **Published** and from your latest commit? Is smartlead.ng attached to the right Netlify site (Domain management)?
- **Admin can't save ("permission denied"):** the Firestore rules are not published, or you are not signed in with the admin email.
- **Upload fails:** the Cloudinary preset must be Unsigned and allow images and videos. Photos max 10 MB, videos max 100 MB on the free plan.
- **/sitemap.xml shows 404:** the site was not built by Netlify (see section 2). Deploy from GitHub.
- **Edits don't show on the live site yet:** wait a minute (auto-update) or Netlify → Trigger deploy.

---

## 11. For developers
- `npm install`, `npm run dev`, `npm run build` (makes `dist/`, then writes the sitemap and static pages), `npm run build:preview` (Spck/Acode preview folder).
- `src/` React app; `src/content/seed.js` default content; `src/content/schema.js` admin fields; `src/lib/` shared logic (SEO, markdown, lead form, media).
- `netlify/functions/seo.mjs` serves pages added after the last build; `netlify/functions/lead.mjs` sends lead emails and Meta/TikTok events and the admin test email.
- `scripts/prerender.mjs` writes static pages, sitemap, RSS and llms.txt after each build.
- Colours: top of `src/site.css` and `src/admin.css`.
