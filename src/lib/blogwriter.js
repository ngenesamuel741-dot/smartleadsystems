// Shared logic for the AI blog writer: default settings, the prompt, the post "form" the AI must fill in, and checks.
// Used by the Netlify function (netlify/functions/blog-writer-background.mjs) and by the admin page.

export const DEFAULT_WRITER = {
  enabled: true,
  autoPublish: false,        // false = every post is saved as a DRAFT so you can add your own photo, then tick "Published"
  postsPerDay: 2,
  author: "Smart Lead Systems",
  pillars: [
    "Marketing and lead generation for small businesses",
    "Website creation, conversion and speed",
    "Meta and Google Ads: getting results and wasting less",
    "AI automation for business owners",
    "AI advancement: what the latest AI news means for a business owner",
    "Ecommerce growth and store conversion",
    "Fintech and trust: marketing and building for money products",
    "Branding, graphics design and video for sales",
    "Social media management that brings customers",
    "Customer follow-up, CRM and sales systems"
  ],
  voice: "Clear, direct and friendly, like a smart consultant talking to a busy business owner. Short paragraphs. Plain words, no jargon without explaining it. Confident but honest. Practical over theoretical.",
  extraRules: ""
};

export const RESEARCH_PILLAR = /ai advance|ai news|latest ai|trend/i;

// The form the AI must fill in (it is forced to answer through this, so the result is always clean data).
export const POST_TOOL = {
  name: "save_blog_post",
  description: "Save the finished blog post.",
  input_schema: {
    type: "object",
    properties: {
      question: { type: "string", description: "The ONE real question from a business owner that this post answers, written the way they would ask it." },
      title: { type: "string", description: "Post title, under 70 characters, natural and specific. Do not copy the pattern of recent titles." },
      slug: { type: "string", description: "URL slug: lowercase words joined by hyphens." },
      excerpt: { type: "string", description: "1-2 sentences, under 220 characters. Shown on cards and in Google." },
      category: { type: "string", description: "A short category, e.g. Marketing, Websites, AI Automation, Ads, Ecommerce, Fintech, AI News." },
      content: { type: "string", description: "The full article in Markdown, following the format rules." },
      coverAlt: { type: "string", description: "Description of a suitable cover photo (used as alt text)." },
      imageIdea: { type: "string", description: "One or two sentences telling the owner what photo to upload for this post (shape and subject)." },
      metaTitle: { type: "string", description: "SEO title, under 60 characters." },
      metaDescription: { type: "string", description: "SEO description, 140-155 characters." },
      angle: { type: "string", description: "One sentence: the angle and structure used, so future posts can vary." },
      styleNotes: { type: "string", description: "UPDATED notes (max 900 characters) on how this blog 'sounds': tone, sentence rhythm, how posts open and close, phrases and structures to avoid repeating. Merge what you learned from the earlier posts with this one." }
    },
    required: ["question", "title", "slug", "excerpt", "category", "content", "coverAlt", "imageIdea", "metaTitle", "metaDescription", "angle", "styleNotes"]
  }
};

export function systemPrompt() {
  return `You are the staff writer for the Smart Lead Systems blog. Smart Lead Systems is a full-service digital agency in Lagos, Nigeria (website development, graphics design, Meta and Google Ads, video editing, AI automation and social media management) serving business owners in Nigeria, the UK and the US, with a focus on ecommerce and fintech.

WHAT EVERY POST MUST DO
1. Answer ONE real question a business owner has. Put the direct answer in the first 2-3 sentences, then explain how and why, with concrete steps, examples and trade-offs the reader can act on today. The post must be genuinely useful even to someone who never hires us.
2. Present Smart Lead Systems as the right team to do the work. Do this honestly and specifically:
   - mention us naturally once or twice in the body where our service truly fits, using Markdown links such as [our website development service](/services), [pricing](/pricing) or [talk to us](/contact);
   - end with a section titled "How Smart Lead Systems can help" (## heading) that ties THIS post's problem to the specific services that solve it, and invites the reader to message us on WhatsApp or use the contact page.
3. Never invent facts. No made-up statistics, studies, quotes, client names, case studies, results, awards or guarantees. If you use numbers, make them clearly illustrative ("for example, if you spend 100,000 naira...") or well established. Do not claim anything about Smart Lead Systems beyond the facts you are given.
4. Be honest about trade-offs and when something is not worth doing. Credibility is what makes the call-to-action work.

FORMAT RULES (the website renders this Markdown)
- 900 to 1,400 words. Do NOT write an H1 title inside the content.
- Use ## for main sections and ### for sub-sections. Use "- " for bullet lists.
- Numbered lists: write 1. 2. 3. on consecutive lines in ONE list, then put any explanation inside the same item (indent it) rather than between items.
- Never make a line "heading-like" with bold only; use ### instead. Use **bold** only inside sentences for key phrases.
- No tables, no HTML, no images, no emojis, no horizontal rules.
- Short paragraphs (1-3 sentences). Vary how you open and close compared with the recent posts.

VOICE
Match the blog's established voice (you are given the voice guide, your own style notes and the latest posts). Keep it consistent, but do not repeat the same openings, structures, phrases or titles as recent posts.`;
}

const short = (s, n) => { s = String(s || ""); return s.length > n ? s.slice(0, n) + "…" : s; };

// Builds the message that asks for the next post.
export function userPrompt({ today, pillar, settings, memory, samples, recentTitles, agency, research }) {
  const parts = [];
  parts.push(`TODAY: ${today}`);
  parts.push(`TOPIC AREA FOR THIS POST: ${pillar}\nChoose a specific question inside this area that a business owner is likely to be asking right now. It must be clearly different from every title below.`);
  parts.push(`ABOUT SMART LEAD SYSTEMS (the only facts you may state about us):\n${agency}`);
  parts.push(`VOICE GUIDE FROM THE OWNER:\n${settings.voice || DEFAULT_WRITER.voice}`);
  if (settings.extraRules && settings.extraRules.trim()) parts.push(`EXTRA RULES FROM THE OWNER:\n${settings.extraRules.trim()}`);
  parts.push(`YOUR OWN STYLE NOTES FROM EARLIER POSTS:\n${(memory.styleNotes || "").trim() || "(none yet: this is one of the first posts, so set a strong, consistent voice)"}`);
  parts.push(`RECENT POST TITLES (do not repeat these topics or title patterns):\n${recentTitles.length ? recentTitles.map(t => "- " + t).join("\n") : "(none yet)"}`);
  if (samples.length) parts.push(`LATEST POSTS, so you can match how this blog writes (study the voice and structure, never copy sentences):\n\n` + samples.map((p, k) => `--- Example ${k + 1}: ${p.title} ---\n${short(p.content, 5000)}`).join("\n\n"));
  if (research) parts.push(`RESEARCH BRIEFING (current facts gathered from the web; only state developments that appear here, and say where they come from in plain words):\n${research}`);
  parts.push("Now write the post and save it with the save_blog_post tool.");
  return parts.join("\n\n");
}

// What the AI is told about the agency, built from the live website content (so it stays true when you edit the site).
export function agencyFacts(d) {
  const s = d.settings || {};
  const services = (d.services || []).map(x => `- ${x.title}: ${short(x.description, 220)}`).join("\n");
  return [`Name: ${s.name}. ${s.tagline || ""}`.trim(), s.siteDescription ? `About: ${s.siteDescription}` : "", `Website: ${s.url}. Pages: /services, /work, /pricing, /blog, /contact`, s.location ? `Based in: ${s.location}` : "", `Services:\n${services}`].filter(Boolean).join("\n");
}

export const researchPrompt = pillar => `Search the web for the 3 most important, genuinely recent developments (last 2-3 weeks) related to: "${pillar}", that a small or medium business owner should care about. For each give: what happened, who announced it, the date if known, and why it matters to a business owner. Be factual and brief. Do not speculate.`;

export const pickPillar = (pillars, memory) => {
  const list = (pillars && pillars.length ? pillars : DEFAULT_WRITER.pillars);
  const used = (memory.recent || []).map(r => r.pillar);
  let best = list[0], bestAt = Infinity;
  for (const p of list) { const at = used.lastIndexOf(p); if (at < bestAt) { best = p; bestAt = at; } if (at === -1) return p; }
  return best;
};

export const slugOf = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);

// Checks and tidies the AI's answer. Throws a plain-English error if the post is not good enough to save.
export function checkPost(p, { siteName = "Smart Lead Systems" } = {}) {
  if (!p || typeof p !== "object") throw new Error("The AI did not return a post.");
  const content = String(p.content || "").replace(/\r\n?/g, "\n").trim();
  if (!p.title || content.length < 2500) throw new Error("The AI returned a post that was too short, so nothing was saved.");
  let fixed = content.replace(/^#\s+.*\n+/, ""); // drop an accidental H1
  if (!new RegExp(siteName.split(" ")[0], "i").test(fixed)) fixed += `\n\n## How ${siteName} can help\n\nIf you want this done properly, [talk to ${siteName}](/contact). We build the website, run the ads and set up the automation so it all works together.`;
  return { ...p, content: fixed, slug: slugOf(p.slug || p.title) };
}
