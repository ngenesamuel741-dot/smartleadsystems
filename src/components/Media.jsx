import { cdn, isVideo, poster } from "../lib/media.js";

// Shows a photo or a video. Photos are resized and converted by Cloudinary; videos get a thumbnail and play inline on phones.
export default function Media({ src, alt, w = 1200 }) {
  if (!src) return <div className="media"><div className="placeholder">Smart Lead Systems</div></div>;
  if (isVideo(src)) return <div className="media"><video src={cdn(src)} poster={poster(src) || undefined} controls playsInline preload="metadata" aria-label={alt || ""} /></div>;
  return <div className="media"><img src={cdn(src, { w })} alt={alt || ""} loading="lazy" decoding="async" /></div>;
}
