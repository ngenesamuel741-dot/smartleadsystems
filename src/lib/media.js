// Media helpers shared by the website, the admin and the SEO code.
// Cloudinary does the heavy lifting: it shrinks, converts to modern formats (WebP/AVIF) and makes video thumbnails.
const CLOUD = /^https:\/\/res\.cloudinary\.com\/([^/]+)\/(image|video)\/upload\/(.+)$/;

export const isVideo = u => /\/video\/upload\//.test(u || "") || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u || "");

// Optimised delivery URL. Non-Cloudinary links are returned unchanged.
export function cdn(url, { w, fmt = "auto" } = {}) {
  const m = String(url || "").match(CLOUD);
  if (!m) return url || "";
  const [, cloud, type, rest] = m;
  if (/^[a-z]{1,3}_[^/]+\//.test(rest)) return url; // already has transformations
  const t = type === "video" ? "f_auto,q_auto" : `f_${fmt},q_auto${w ? `,w_${w},c_limit` : ""}`;
  return `https://res.cloudinary.com/${cloud}/${type}/upload/${t}/${rest}`;
}

// Still image taken from the first frame of a Cloudinary video (used as the video thumbnail).
export function poster(url) {
  const m = String(url || "").match(CLOUD);
  if (!m || m[2] !== "video") return "";
  return `https://res.cloudinary.com/${m[1]}/video/upload/so_0,f_jpg,q_auto,w_900/${m[3].replace(/\.[a-z0-9]+$/i, "")}.jpg`;
}

// Picture used for Google/WhatsApp/LinkedIn link previews: always a JPG, 1200px wide.
export function ogImage(url) {
  if (!url) return url;
  return isVideo(url) ? (poster(url) || "") : cdn(url, { w: 1200, fmt: "jpg" });
}
