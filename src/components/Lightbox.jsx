import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cdn, isVideo } from "../lib/media.js";

// Full-screen viewer: tap outside or the cross to close, arrows or swipe to move between pictures.
export default function Lightbox({ items, index, alt, onClose, onIndex }) {
  const list = (items || []).filter(Boolean), at = Math.min(Math.max(index, 0), list.length - 1), touch = useRef(null);
  const go = d => { if (list.length > 1) onIndex((at + d + list.length) % list.length); };
  useEffect(() => {
    const key = e => { if (e.key === "Escape") onClose(); else if (e.key === "ArrowRight") go(1); else if (e.key === "ArrowLeft") go(-1); };
    document.addEventListener("keydown", key); const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", key); document.body.style.overflow = prev; };
  });
  if (!list.length) return null;
  const u = list[at];
  return createPortal(
    <div className="sl-lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={onClose}
      onTouchStart={e => { touch.current = e.touches[0].clientX; }} onTouchEnd={e => { if (touch.current == null) return; const dx = e.changedTouches[0].clientX - touch.current; touch.current = null; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); }}>
      <button type="button" className="sl-lb-close" onClick={onClose} aria-label="Close"><X size={26} /></button>
      {list.length > 1 && <button type="button" className="sl-lb-nav sl-lb-prev" onClick={e => { e.stopPropagation(); go(-1); }} aria-label="Previous"><ChevronLeft size={30} /></button>}
      <div className="sl-lb-stage" onClick={e => e.stopPropagation()}>
        {isVideo(u) ? <video key={u} src={cdn(u)} controls autoPlay playsInline /> : <img key={u} src={cdn(u, { w: 2000 })} alt={alt || ""} />}
        {list.length > 1 && <span className="sl-lb-count">{at + 1} / {list.length}</span>}
      </div>
      {list.length > 1 && <button type="button" className="sl-lb-nav sl-lb-next" onClick={e => { e.stopPropagation(); go(1); }} aria-label="Next"><ChevronRight size={30} /></button>}
    </div>, document.body);
}
