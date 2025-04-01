import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: {
    "import.meta.env.EMAILJS_SERVICE_ID": JSON.stringify(
      process.env.EMAILJS_SERVICE_ID,
    ),
    "import.meta.env.EMAILJS_TEMPLATE_ID": JSON.stringify(
      process.env.EMAILJS_TEMPLATE_ID,
    ),
    "import.meta.env.EMAILJS_USER_PUBLIC_KEY": JSON.stringify(
      process.env.EMAILJS_USER_PUBLIC_KEY,
    ),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
