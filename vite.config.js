import{defineConfig}from"vite";import react from"@vitejs/plugin-react";
// "preview" mode: relative asset paths + hash routing so the built folder runs from any static server / phone editor preview.
export default defineConfig(({mode})=>({plugins:[react()],base:mode==="preview"?"./":"/",build:mode==="preview"?{outDir:"preview",emptyOutDir:true}:{}}));
