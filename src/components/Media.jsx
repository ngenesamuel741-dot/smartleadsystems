export default function Media({ src, alt }) {
  return <div className="media">{src ? <img src={src} alt={alt || ""} loading="lazy" decoding="async" /> : <div className="placeholder">Smart Lead Systems</div>}</div>;
}
