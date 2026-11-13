// Renders the PNG icons and the Open Graph image from public/favicon.svg with
// Playwright's Chromium. Run it by hand when the mascot or the OG design
// changes, and commit the PNGs it writes to public/:
//
//   node scripts/generate-images.js
import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const publicDir = path.resolve(import.meta.dirname, "..", "public");
const mascot = await readFile(path.join(publicDir, "favicon.svg"), "utf8");

// The Claude Code palette (src/components/claude-code/claude-code.css).
const background = "#1f1e1d";
const text = "#e8e6e1";
const muted = "#9b978f";
const accent = "#d97757";
const border = "#34322f";
// Single quotes only: these go inside double-quoted style attributes.
const mono = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";
const sans = "system-ui, -apple-system, 'Segoe UI', sans-serif";

/** The mascot centred on the dark background, with room around it. */
const icon = (size) => ({
  width: size,
  height: size,
  html: `<body style="margin:0;width:${size}px;height:${size}px;background:${background};display:flex;align-items:center;justify-content:center">
    <div style="width:${Math.round(size * 0.72)}px;display:flex">${mascot}</div>
  </body>`,
});

const ogImage = {
  width: 1200,
  height: 630,
  html: `<body style="margin:0;width:1200px;height:630px;background:${background};color:${text};font-family:${sans};box-sizing:border-box;padding:48px;display:flex">
    <div style="flex:1;border:2px solid ${border};border-radius:20px;padding:56px 64px;display:flex;align-items:center;gap:48px">
      <div style="flex:1">
        <p style="margin:0 0 28px;font-family:${mono};font-size:28px;color:${muted}"><span style="color:${accent}">&gt;</span> claude --portfolio</p>
        <h1 style="margin:0;font-size:84px;line-height:1.05;font-weight:700">Manuel Maxera</h1>
        <p style="margin:16px 0 0;font-size:48px;font-weight:600;color:${accent}">AI Engineer</p>
        <p style="margin:28px 0 0;font-size:30px;line-height:1.4;color:${muted}">Production LLM agents, MCP integrations<br>and AI tooling.</p>
      </div>
      <div style="width:300px;display:flex">${mascot}</div>
    </div>
  </body>`,
};

const images = {
  "apple-touch-icon.png": icon(180),
  "icon-192.png": icon(192),
  "icon-512.png": icon(512),
  "og-image.png": ogImage,
};

const browser = await chromium.launch();
for (const [file, { width, height, html }] of Object.entries(images)) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"></head>${html}</html>`,
  );
  await page.screenshot({ path: path.join(publicDir, file) });
  await page.close();
  console.log(`wrote public/${file}`);
}
await browser.close();
