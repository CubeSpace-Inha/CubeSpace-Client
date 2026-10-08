import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Electron 없이 브라우저로 renderer만 띄운다 (WSL 등에서 /template 확인용).
export default defineConfig({
  root: "src/renderer",
  plugins: [react()],
});
