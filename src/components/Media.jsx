import { useState } from "react";
import { cdn, isVideo, poster } from "../lib/media.js";
import Lightbox from "./Lightbox";

// Shows a photo or a video. Photos are resized and converted by Cloudinary; videos get a thumbnail and play inline on phones.
// onZoom: when given, tapping a photo opens the full-screen viewer.
export default function Media({ src, alt, w = 1200, onZoom }) {
  if (!src) return <div className="media"><div className="placeholder">Smart Lead Systems</div></div>;
  if (isVideo(src)) return <div className="media"><video src={cdn(src)} poster={poster(src) || undefined} controls playsInline preload="metadata" aria-label={alt || ""} /></div>;
  const img = <img src={cdn(src, { w })} alt={alt || ""} loading="lazy" decoding="async" />;
  return <div className={"media" + (onZoom ? " zoomable" : "")}>{onZoom ? <button type="button" className="zoom-btn" onClick={onZoom} aria-label={`View larger: ${alt || "image"}`}>{img}</button> : img}</div>;
}

// A main picture with a strip of thumbnails. Tapping the main picture opens the full-screen viewer.
export function MediaSet({ items, alt, w = 1200 }) {
  const list = (items || []).filter(Boolean), [i, setI] = useState(0), [open, setOpen] = useState(false);
  if (!list.length) return <Media src="" />;
  const at = Math.min(i, list.length - 1);
  return <div className="sl-set"><Media key={list[at]} src={list[at]} alt={alt} w={w} onZoom={() => setOpen(true)} />
    {list.length > 1 && <div className="sl-thumbs">{list.map((u, k) => <button type="button" key={u + k} className={k === at ? "on" : ""} onClick={() => setI(k)} aria-label={`Show ${k + 1} of ${list.length}`}>{isVideo(u) ? <span>▶</span> : <img src={cdn(u, { w: 160 })} alt="" loading="lazy" />}</button>)}</div>}
    {open && <Lightbox items={list} index={at} alt={alt} onClose={() => setOpen(false)} onIndex={setI} />}</div>;
}

// All photos/videos in a grid. zoom: tapping opens the viewer (off for blog posts).
export function MediaGrid({ items, alt, zoom = false }) {
  const list = (items || []).filter(Boolean), [open, setOpen] = useState(-1);
  if (!list.length) return null;
  return <div className="sl-gallery">{list.map((u, k) => <Media key={u + k} src={u} alt={`${alt} ${k + 1}`} w={900} onZoom={zoom ? () => setOpen(k) : undefined} />)}
    {open >= 0 && <Lightbox items={list} index={open} alt={alt} onClose={() => setOpen(-1)} onIndex={setOpen} />}</div>;
}

// A single photo that opens full screen when tapped (founder photo).
export function ZoomPhoto({ src, alt, w = 1000 }) {
  const [open, setOpen] = useState(false);
  return <>{<button type="button" className="zoom-btn zoom-plain" onClick={() => setOpen(true)} aria-label={`View larger: ${alt}`}><img src={cdn(src, { w })} alt={alt} loading="lazy" /></button>}
    {open && <Lightbox items={[src]} index={0} alt={alt} onClose={() => setOpen(false)} onIndex={() => {}} />}</>;
}
