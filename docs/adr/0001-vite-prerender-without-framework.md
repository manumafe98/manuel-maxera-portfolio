# Pre-render with Vite's own SSG pattern, no framework or router

The site must put its content in the initial HTML for agents and crawlers that don't run JavaScript (is-agentic.com). It has only three pages: `/`, `/privacy` and the 404. We pre-render them with a small build script that follows Vite's documented pre-rendering pattern and uses React's `prerender`. Then the browser hydrates the result. We dropped `react-router` because three static files don't need a router.

## Considered Options

- **Astro with a React island**: the common choice for portfolios. It's worth switching to if the site grows into many content pages (blog, case studies). For one interactive app plus two static pages, it's a framework for nothing.
- **React Router framework mode**: rebuilds the app around its conventions to pre-render three pages.
- **Third-party SSG packages** (`vite-react-ssg`): a runtime dependency with weaker long-term maintenance than Vite's own pattern.
