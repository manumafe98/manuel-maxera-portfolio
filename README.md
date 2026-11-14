# Manuel Maxera portfolio

A personal portfolio that simulates an Ubuntu desktop, explored through a simulated Claude Code app. It is pre-rendered at build time (see `docs/adr/`) and hosted on Netlify.

## Scripts

- `npm run dev`: the Vite dev server.
- `npm run build`: type-checks, builds, and pre-renders `/`, `/privacy` and the 404 page into `dist/`, together with `llms.txt`, `robots.txt`, `sitemap.xml` and `site.webmanifest`, all generated from `src/content/portfolio.ts`.
- `npm test`: unit tests (Vitest).
- `npm run test:e2e`: end-to-end tests (Playwright) against the production build.
- `node scripts/generate-images.js`: re-renders the PNG icons and the Open Graph image in `public/` from `public/favicon.svg`. Run it by hand and commit the PNGs.

## Environment variables

Set these in the build environment (on Netlify: Site configuration > Environment variables). `.env-example` lists them.

| Variable                                                               | Used for                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_USER_PUBLIC_KEY` | Sending the contact form through EmailJS. Required: `npm run build` fails with "Missing EmailJS settings" naming any that are empty. For a local build without real keys, pass placeholders, such as `EMAILJS_SERVICE_ID=x EMAILJS_TEMPLATE_ID=x EMAILJS_USER_PUBLIC_KEY=x npm run build`. |

## Analytics

Every pre-rendered page loads [Umami Cloud](https://umami.is/), which is cookie-free. Its script URL, Website ID and the domains it counts are public values in `site.analytics` in `src/content/portfolio.ts`, not environment variables. Umami only counts visits on `manuelmaxera.com` and `www.manuelmaxera.com`, so deploy previews, the netlify.app address and local builds never count.
