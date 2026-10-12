import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";

// "Share this article": a copyable link, the phone's own share sheet (any app), and quick share buttons.
export default function ShareBox({ url, title, text }) {
  const [copied, setCopied] = useState(false), canShare = typeof navigator !== "undefined" && !!navigator.share;
  const enc = encodeURIComponent, msg = `${title} ${url}`;
  async function copy() {
    try { await navigator.clipboard.writeText(url); }
    catch (e) { const t = document.createElement("textarea"); t.value = url; t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (x) { /* ignore */ } t.remove(); }
    setCopied(true); setTimeout(() => setCopied(false), 2200);
  }
  async function share() { try { await navigator.share({ title, text: text || title, url }); } catch (e) { /* cancelled */ } }
  return <aside className="sl-share" aria-label="Share this article">
    <span className="sl-share-title">Share this article</span>
    <div className="sl-share-link"><input readOnly value={url} aria-label="Article link" onFocus={e => e.target.select()} /><button type="button" onClick={copy}>{copied ? <><Check size={15} /> Copied</> : <><Link2 size={15} /> Copy link</>}</button></div>
    <div className="sl-share-btns">
      {canShare && <button type="button" className="sl-share-main" onClick={share}><Share2 size={15} /> Share…</button>}
      <a href={`https://wa.me/?text=${enc(msg)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noopener noreferrer">X</a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
      <a href={`mailto:?subject=${enc(title)}&body=${enc(msg)}`}>Email</a>
    </div></aside>;
}
