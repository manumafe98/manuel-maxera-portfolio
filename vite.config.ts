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

/** The contact form's EmailJS settings, read from the build environment. */
const emailJsVariables = [
  "EMAILJS_SERVICE_ID",
  "EMAILJS_TEMPLATE_ID",
  "EMAILJS_USER_PUBLIC_KEY",
] as const;

// https://vite.dev/config/
export default defineConfig(({ command, isSsrBuild }) => {
  // Without these the contact form can't send, so a client build without
  // them must not reach production. The SSR build only pre-renders HTML.
  if (command === "build" && !isSsrBuild) {
    const missing = emailJsVariables.filter((name) => !process.env[name]);
    if (missing.length > 0) {
      throw new Error(
        `Missing EmailJS settings: ${missing.join(", ")}. ` +
          "Set them in the build environment (on Netlify: Site configuration > Environment variables); .env-example lists them.",
      );
    }
  }

  return {
    plugins: [tailwindcss(), react(), previewNotFoundPage()],
    define: Object.fromEntries(
      emailJsVariables.map((name) => [
        `import.meta.env.${name}`,
        JSON.stringify(process.env[name]),
      ]),
    ),
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
    },
  };
});
