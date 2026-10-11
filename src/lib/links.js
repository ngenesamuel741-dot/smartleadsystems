export const waLink = (settings, text) => "https://wa.me/" + String(settings.whatsapp || "").replace(/\D/g, "") + (text ? "?text=" + encodeURIComponent(text) : "");
export const socials = s => [["Instagram", s.instagram], ["LinkedIn", s.linkedin], ["X", s.x], ["Facebook", s.facebook], ["TikTok", s.tiktok], ["YouTube", s.youtube]].filter(([, u]) => u && /^https?:\/\//i.test(u));
