import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you deploy this to GitHub Pages as a project site (username.github.io/employee-master),
// set base to "/employee-master/". If you deploy to Vercel/Netlify or a custom domain, leave it as "/".
export default defineConfig({
  plugins: [react()],
  base: "/employee-master/",
});
