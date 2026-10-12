import NotFound from "./NotFound";
import { useContent } from "../hooks/useContent";
import { mdToHtml } from "../lib/md.js";

export default function LegalPage({ id }) {
  const { pages } = useContent(), p = pages.find(x => x.id === id);
  if (!p) return <NotFound />;
  return <article className="sl-article sl-container"><span className="sl-eyebrow">LEGAL</span><h1>{p.title}</h1><div className="sl-article-body" dangerouslySetInnerHTML={{ __html: mdToHtml(p.content) }} /></article>;
}
