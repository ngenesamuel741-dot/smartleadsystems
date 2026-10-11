import { Helmet } from "react-helmet-async";
import { abs } from "../lib/seo.js";

// Renders the title/description/canonical/social tags for the current route (computed in Layout).
export default function SEO({ seo, url }) {
  const u = abs({ settings: { url } }, seo.path === "/" ? "/" : seo.path);
  return <Helmet>
    <title>{seo.title}</title>
    <meta name="description" content={seo.description} />
    <meta name="robots" content={seo.noindex ? "noindex,follow" : "index,follow,max-image-preview:large,max-snippet:-1"} />
    {!seo.noindex && <link rel="canonical" href={u} />}
    <meta property="og:type" content={seo.type} />
    <meta property="og:title" content={seo.title} />
    <meta property="og:description" content={seo.description} />
    <meta property="og:url" content={u} />
    {seo.image && <meta property="og:image" content={seo.image} />}
    {seo.image && <meta name="twitter:image" content={seo.image} />}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={seo.title} />
    <meta name="twitter:description" content={seo.description} />
    {seo.published && <meta property="article:published_time" content={seo.published} />}
  </Helmet>;
}
