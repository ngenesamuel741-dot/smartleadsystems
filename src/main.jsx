import React from"react";import{createRoot}from"react-dom/client";import{BrowserRouter,HashRouter}from"react-router-dom";import{HelmetProvider}from"react-helmet-async";import App from"./App";import ErrorBoundary from"./ErrorBoundary";import{captureAttribution}from"./lib/attribution";import"./site.css";captureAttribution();
// Preview builds (npm run build:preview) use a hash router so they work from any static folder, e.g. Spck/Acode live preview.
const Router=import.meta.env.VITE_HASH_ROUTER==="true"?HashRouter:BrowserRouter;
createRoot(document.getElementById("root")).render(<React.StrictMode><ErrorBoundary><HelmetProvider><Router><App/></Router></HelmetProvider></ErrorBoundary></React.StrictMode>);
