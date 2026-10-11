export const waLink = (settings, text) => "https://wa.me/" + String(settings.whatsapp || "").replace(/\D/g, "") + (text ? "?text=" + encodeURIComponent(text) : "");

// The message that is already typed in the person's WhatsApp when they tap a button. Editable in the admin.
// An item's own message (service, package, project, article) wins; otherwise a sensible default is built from its name.
export function waMsg(s, kind, item) {
  if (item && item.waMessage && item.waMessage.trim()) return item.waMessage.trim();
  const n = s.name || "Smart Lead Systems";
  switch (kind) {
    case "service": return `Hi ${n}, I'd like to sign up for your ${item.title} service. Can you tell me how to get started?`;
    case "plan": return `Hi ${n}, I'm interested in the ${item.title} package (${[item.price, item.period].filter(Boolean).join(" ")}). Can we talk?`;
    case "project": return `Hi ${n}, I saw your ${item.title} project and I'd like something similar for my business.`;
    case "post": return `Hi ${n}, I read your article "${item.title}" and I'd like help applying it to my business.`;
    case "thanks": return (s.waMessageThanks || "").trim() || `Hi ${n}, I just sent a message through your website and wanted to follow up.`;
    default: return (s.waMessage || "").trim() || `Hi ${n}, I'd like to talk about a project for my business.`;
  }
}
export const socials = s => [["Instagram", s.instagram], ["LinkedIn", s.linkedin], ["X", s.x], ["Facebook", s.facebook], ["TikTok", s.tiktok], ["YouTube", s.youtube]].filter(([, u]) => u && /^https?:\/\//i.test(u));
