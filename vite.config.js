import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deploying to GitHub Pages as a project site: username.github.io/staff/
// base must match the repo name exactly. If you deploy to Vercel/Netlify
// or a custom domain instead, change base back to "/".
export default defineConfig({
  plugins: [react()],
  base: "/staff/",
});
