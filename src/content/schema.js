// Describes every editable thing in the admin. Field types: text, textarea, markdown, list, image, number, bool, date.
const T = (k, label, extra = {}) => ({ k, label, t: "text", ...extra });
const A = (k, label, extra = {}) => ({ k, label, t: "textarea", ...extra });
const I = (k, label, extra = {}) => ({ k, label, t: "image", ...extra });
const N = (k, label = "Order (1 = first)") => ({ k, label, t: "number" });
const L = (k, label, hint) => ({ k, label, t: "list", hint: hint || "One per line" });
const B = (k, label, def = true) => ({ k, label, t: "bool", def });
const S = (k, label, options, extra = {}) => ({ k, label, t: "select", options, ...extra });

export const COLLECTIONS = {
  posts: { label: "Blog posts", single: "post", title: "title", fields: [
    T("title", "Title"), T("slug", "URL slug", { hint: "Leave empty to create it from the title. Used in the link: /blog/your-slug" }), B("published", "Published (untick to keep as a draft)"), { k: "date", label: "Date", t: "date" },
    T("category", "Category"), T("author", "Author"), A("excerpt", "Excerpt", { hint: "1–2 sentences. Shown on cards and used as the Google description." }),
    I("coverImage", "Cover image"), T("coverAlt", "Cover image description (for accessibility and Google Images)"),
    { k: "content", label: "Article", t: "markdown", hint: "Write with ## Heading, - bullet lists, **bold**, [link text](https://…), ![alt](image-url)" },
    T("metaTitle", "SEO title (optional)", { hint: "Overrides the title in Google results" }), A("metaDescription", "SEO description (optional)", { hint: "About 150 characters" })
  ] },
  services: { label: "Services", single: "service", title: "title", fields: [T("title", "Service name"), T("accent", "Small label (e.g. BUILD)"), N("order"), A("description", "Description"), I("image", "Image"), L("capabilities", "What's included")] },
  projects: { label: "Work / Portfolio", single: "project", title: "title", fields: [T("title", "Project name"), T("category", "Category (e.g. Web Development)"), T("link", "Link to live project (optional)"), N("order"), A("summary", "Summary"), I("image", "Image")] },
  pricing: { label: "Pricing", single: "plan", title: "title", fields: [T("title", "Plan name"), T("price", "Price (e.g. From $500)"), T("period", "Period (e.g. per month)"), A("description", "Short description"), L("features", "Features"), T("cta", "Button text"), B("highlight", "Highlight as most popular", false), B("visible", "Show on site"), N("order")] },
  testimonials: { label: "Testimonials", single: "testimonial", title: "name", fields: [T("name", "Person's name"), T("role", "Role"), T("company", "Company"), A("quote", "What they said"), I("photo", "Photo (optional)"), N("order")] },
  clients: { label: "Client logos", single: "client", title: "name", fields: [T("name", "Client name"), I("logo", "Logo image"), N("order")] },
  founders: { label: "Founder", single: "founder", title: "name", fields: [T("name", "Name"), T("role", "Role / title"), I("photo", "Photo"), T("photoAlt", "Photo description (for Google Images)"), { k: "bio", label: "Bio", t: "markdown", hint: "Shown on the Founder page (footer link) and used by Google and AI assistants" }, T("linkedin", "LinkedIn URL"), T("x", "X (Twitter) URL"), T("instagram", "Instagram URL"), N("order")] },
  faqs: { label: "FAQs", single: "FAQ", title: "question", fields: [T("question", "Question"), A("answer", "Answer"), N("order")] },
  process: { label: "How we work steps", single: "step", title: "title", fields: [T("title", "Step name"), A("description", "Description"), N("order")] },
  industries: { label: "Who we help", single: "industry", title: "title", fields: [T("title", "Industry"), A("description", "Description"), L("points", "Points"), N("order")] },
  formfields: { label: "Lead form questions", single: "question", title: "label", fields: [
    T("label", "Question"), S("type", "Answer type", ["text", "email", "phone", "textarea", "select", "radio", "checkbox"], { hint: "text = short answer, textarea = long answer, select = dropdown, radio = tap-one choices, checkbox = single tick box" }), B("required", "Required", false),
    T("placeholder", "Hint shown inside the box"), L("options", "Choices (dropdown / multiple choice)"),
    L("disqualify", "Answers that mean NOT a fit", "One per line, written exactly like the choice. A lead who picks one is saved under 'Not a fit' and is NOT counted as a Lead in Meta, TikTok or Google. They see your 'not a fit' thank-you page."),
    T("key", "Internal name (optional)", { hint: "Leave empty. Never change it for name, email, phone, company, service or message." }), N("order"), B("visible", "Show on the form")
  ] },
  pages: { label: "Legal pages", single: "page", title: "title", noNew: true, noDelete: true, fields: [T("title", "Page title"), { k: "content", label: "Content", t: "markdown", hint: "Privacy Policy and Terms of Service. Have a lawyer review these before launch." }] }
};

export const SETTINGS_GROUPS = [
  ["Business details", [T("name", "Business name"), T("tagline", "Tagline (shown in Google title)"), T("url", "Website address", { hint: "e.g. https://smartlead.ng (used for Google links)" }), T("email", "Email"), T("whatsapp", "WhatsApp number", { hint: "With country code, e.g. +2349078581006" }), T("location", "Location")]],
  ["Homepage hero", [T("heroEyebrow", "Small heading"), T("heroLine1", "Headline line 1"), T("heroLine2", "Headline line 2 (green)"), T("heroLine3", "Headline line 3"), A("heroText", "Intro text"), T("heroCta", "Button text")]],
  ["Homepage sections", [T("approachTitle", "Approach heading"), T("approachAccent", "Approach heading (green part)"), A("approachText1", "Approach paragraph 1"), A("approachText2", "Approach paragraph 2"), T("pricingTitle", "Pricing heading"), A("pricingNote", "Pricing note"), T("ctaEyebrow", "Call-to-action small heading"), T("ctaTitle", "Call-to-action heading"), T("ctaAccent", "Call-to-action heading (green part)"), A("ctaText", "Call-to-action text")]],
  ["Contact page & footer", [T("contactTitle", "Contact heading"), T("contactAccent", "Contact heading (green part)"), A("contactText", "Contact text"), A("footerText", "Footer text")]],
  ["SEO & sharing", [A("siteDescription", "Site description (Google & AI summary)"), I("ogImage", "Share image (1200×630)"), I("logoUrl", "Logo override (optional)")]],
  ["Lead form & thank-you pages", [T("submitText", "Submit button text"), T("formNote", "Note under the button"), T("thanksTitle", "Qualified lead: thank-you heading"), A("thanksText", "Qualified lead: message (e.g. we'll reach out within 24 hours)"), T("unqualTitle", "Not-a-fit: heading"), A("unqualText", "Not-a-fit: message"), T("unqualButtonText", "Not-a-fit: button text"), T("unqualButtonLink", "Not-a-fit: button link", { hint: "e.g. /blog or https://…" }), B("notifyUnqualified", "Still email me about not-a-fit enquiries", true)]],
  ["Social profiles", [T("instagram", "Instagram URL"), T("linkedin", "LinkedIn URL"), T("x", "X (Twitter) URL"), T("facebook", "Facebook URL"), T("tiktok", "TikTok URL"), T("youtube", "YouTube URL")]],
  ["Tracking (loads only after visitors accept cookies)", [T("gaId", "Google Analytics ID", { hint: "e.g. G-XXXXXXXXXX" }), T("metaPixelId", "Meta Pixel ID", { hint: "Numbers only. Same ID is used for the Conversions API." }), T("tiktokPixelId", "TikTok Pixel ID", { hint: "From TikTok Events Manager, e.g. C1ABCDEF…" }), B("trackWithoutConsent", "Track visitors without asking for cookie consent", false)]]
];
