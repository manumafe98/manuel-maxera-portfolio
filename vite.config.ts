import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "path";
import { defineConfig, type Plugin } from "vite";

/**
 * Makes `vite preview` answer unknown paths like Netlify does: with
 * dist/404.html and a 404 status, instead of falling back to index.html.
 */
const previewNotFoundPage = (): Plugin => ({
  name: "preview-not-found-page",
  configurePreviewServer(server) {
    const dist = path.resolve(server.config.root, server.config.build.outDir);
    const isFile = (urlPath: string) => {
      const file = path.join(dist, urlPath);
      return (
        file.startsWith(dist) && existsSync(file) && statSync(file).isFile()
      );
    };
    server.middlewares.use((req, res, next) => {
      const pathname = decodeURIComponent(
        new URL(req.url ?? "/", "http://localhost").pathname,
      );
      const served = [
        pathname,
        `${pathname}.html`,
        path.posix.join(pathname, "index.html"),
      ].some(isFile);
      if (served) return next();
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(readFileSync(path.join(dist, "404.html")));
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), previewNotFoundPage()],
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
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
