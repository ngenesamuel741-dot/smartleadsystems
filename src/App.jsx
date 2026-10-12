import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Work from "./pages/Work";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import Founders from "./pages/Founders";
import Contact from "./pages/Contact";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";
import ThankYou from "./pages/ThankYou";
import Admin from "./pages/Admin";

export default function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/work" element={<Work />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<Post />} />
      <Route path="/founders" element={<Founders />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/thank-you-info" element={<ThankYou qualified={false} />} />
      <Route path="/privacy" element={<LegalPage id="privacy" />} />
      <Route path="/terms" element={<LegalPage id="terms" />} />
      <Route path="*" element={<NotFound />} />
    </Route>
    <Route path="/admin/*" element={<Admin />} />
  </Routes>;
}
