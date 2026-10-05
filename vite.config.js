import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins:[react()],
  // Use VITE_BASE_PATH when hosting under a repository path.
  // The default "/" is correct for smartlead.ng and normal web hosting.
  base:process.env.VITE_BASE_PATH||"/",
  server:{host:true},
  preview:{host:true}
});
