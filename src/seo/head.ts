import { experience, profile, site, socialLinks } from "@/content/portfolio";
import type { PageId } from "@/pages/pages";

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const tag = (name: string, attributes: Record<string, string>) =>
  `<${name} ${Object.entries(attributes)
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(" ")} />`;

const metaName = (name: string, content: string) =>
  tag("meta", { name, content });
const metaProperty = (property: string, content: string) =>
  tag("meta", { property, content });
const title = (text: string) => `<title>${escapeHtml(text)}</title>`;

const homeTitle = `${profile.name} | ${profile.title}`;
const homeDescription = profile.shortSummary;

/** Rendered once by scripts/generate-images.js and committed in public/. */
const ogImage = {
  url: new URL("og-image.png", site.url).href,
  width: "1200",
  height: "630",
  alt: `${profile.name}, ${profile.title}: the Claude Code mascot beside his name`,
};

/**
 * Manuel as a schema.org Person, for JSON-LD. No image: he doesn't want a
 * photo published. The contactPoint is on the Person, not on the employer
 * Organization (ADR-0004).
 */
const person = () => {
  const [locality, country] = profile.location.split(", ");
  return {
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.shortSummary,
    url: site.url,
    sameAs: socialLinks.map((link) => link.url),
    knowsAbout: profile.knowsAbout,
    address: {
      "@type": "PostalAddress",
      addressLocality: locality,
      addressCountry: country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: profile.email,
      contactType: "professional inquiries",
    },
    worksFor: { "@type": "Organization", name: experience[0].company },
  };
};

/** The home page as Google's ProfilePage, about the Person. */
const profilePage = () => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: site.url,
  name: homeTitle,
  mainEntity: person(),
});

/** "<" is escaped so the JSON can never close its script element. */
const jsonLd = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(
    /</g,
    "\\u003c",
  )}</script>`;

const heads: Record<PageId, () => string[]> = {
  home: () => [
    title(homeTitle),
    metaName("description", homeDescription),
    tag("link", { rel: "canonical", href: site.url }),
    metaProperty("og:type", "website"),
    metaProperty("og:site_name", profile.name),
    metaProperty("og:title", homeTitle),
    metaProperty("og:description", homeDescription),
    metaProperty("og:url", site.url),
    metaProperty("og:image", ogImage.url),
    metaProperty("og:image:width", ogImage.width),
    metaProperty("og:image:height", ogImage.height),
    metaProperty("og:image:alt", ogImage.alt),
    metaName("twitter:card", "summary_large_image"),
    metaName("twitter:image", ogImage.url),
    metaName("twitter:image:alt", ogImage.alt),
    metaName("twitter:title", homeTitle),
    metaName("twitter:description", homeDescription),
    jsonLd(profilePage()),
  ],
  privacy: () => [
    title(`Privacy | ${profile.name}`),
    metaName(
      "description",
      `How ${profile.name}'s portfolio handles analytics and contact form data.`,
    ),
    tag("link", { rel: "canonical", href: new URL("privacy", site.url).href }),
  ],
  "not-found": () => [
    title(`Page not found | ${profile.name}`),
    metaName("robots", "noindex"),
  ],
};

/** Umami Cloud: one deferred script, no cookies. */
const analyticsScript = () => {
  const { scriptUrl, websiteId, domains } = site.analytics;
  return `<script defer src="${escapeHtml(scriptUrl)}" data-website-id="${escapeHtml(
    websiteId,
  )}" data-domains="${escapeHtml(domains.join(","))}"></script>`;
};

/** The tags for a page's <head>, generated from the content module. */
export const headFor = (page: PageId): string =>
  [...heads[page](), analyticsScript()].join("\n    ");
