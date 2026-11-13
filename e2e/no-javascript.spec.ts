/// <reference lib="dom" />
import { expect, test } from "@playwright/test";

const SITE_URL = "https://manuel-maxera.netlify.app/";

const SUMMARY_START =
  "AI Engineer focused on production LLM agents and backend platforms for enterprise SaaS";

const ROLES = [
  "AI Engineer",
  "Software Engineer",
  "Cloud Engineer",
  "Sysadmin Unix",
];

const PROJECTS = [
  [
    "Trading Strategy Tester",
    "https://github.com/manumafe98/trading_strategy_tester",
  ],
  ["HoytsX", "https://github.com/manumafe98/HoytsX"],
  ["Pokemon Voting", "https://github.com/manumafe98/pokemon_voting_dapp"],
  ["Exercism", "https://github.com/manumafe98/java"],
  ["Vbnb", "https://github.com/manumafe98/Vbnb"],
] as const;

const LINKEDIN = "https://www.linkedin.com/in/manuel-maxera/";
const GITHUB = "https://github.com/manumafe98";

test.describe("with JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("/ shows the profile summary and every experience role", async ({
    page,
  }) => {
    await page.goto("/");
    const content = page.getByRole("main", { name: "Manuel Maxera" });

    await expect(content.getByRole("heading", { level: 1 })).toHaveText(
      "Manuel Maxera",
    );
    await expect(content).toContainText(SUMMARY_START);
    const experience = content.getByRole("region", { name: "Experience" });
    for (const role of ROLES) {
      await expect(
        experience.getByRole("heading", { name: new RegExp(`^${role}`) }),
      ).toBeVisible();
    }
  });

  test("/ lists every Project with a link to its repo", async ({ page }) => {
    await page.goto("/");
    const projects = page.getByRole("region", { name: "Projects" });

    for (const [name, repo] of PROJECTS) {
      const project = projects.getByRole("listitem").filter({
        has: page.getByRole("heading", { name, exact: true }),
      });
      await expect(project.getByRole("link")).toHaveAttribute("href", repo);
    }
  });

  test("/ lists the skills by area and the contact links", async ({ page }) => {
    await page.goto("/");
    const skills = page.getByRole("region", { name: "Skills" });
    const contact = page.getByRole("region", { name: "Contact" });

    await expect(
      skills.getByRole("heading", { name: "AI engineering" }),
    ).toBeVisible();
    await expect(skills).toContainText("LangGraph");
    await expect(skills).toContainText("FastAPI");
    await expect(
      contact.getByRole("link", { name: "LinkedIn" }),
    ).toHaveAttribute("href", LINKEDIN);
    await expect(contact.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      GITHUB,
    );
    await expect(
      contact.getByRole("link", { name: "manumaxerapro@gmail.com" }),
    ).toHaveAttribute("href", "mailto:manumaxerapro@gmail.com");
  });

  test("/ HTML has one title, a description, a canonical URL and lang=en", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("title")).toHaveCount(1);
    await expect(page).toHaveTitle("Manuel Maxera | AI Engineer");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /AI Engineer at Avature/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      SITE_URL,
    );
  });

  test("/ HTML has the Open Graph and Twitter card tags", async ({ page }) => {
    await page.goto("/");
    const meta = (attr: string, key: string) =>
      page.locator(`meta[${attr}="${key}"]`);

    await expect(meta("property", "og:title")).toHaveAttribute(
      "content",
      "Manuel Maxera | AI Engineer",
    );
    await expect(meta("property", "og:description")).toHaveAttribute(
      "content",
      /AI Engineer at Avature/,
    );
    await expect(meta("property", "og:url")).toHaveAttribute(
      "content",
      SITE_URL,
    );
    await expect(meta("property", "og:type")).toHaveAttribute(
      "content",
      "website",
    );
    await expect(meta("property", "og:site_name")).toHaveAttribute(
      "content",
      "Manuel Maxera",
    );
    await expect(meta("name", "twitter:card")).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(meta("name", "twitter:title")).toHaveAttribute(
      "content",
      "Manuel Maxera | AI Engineer",
    );
    await expect(meta("name", "twitter:description")).toHaveAttribute(
      "content",
      /AI Engineer at Avature/,
    );
  });

  test("/ HTML has an absolute 1200x630 Open Graph image with alt text, shared with the Twitter card, and it loads as a PNG", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const meta = (attr: string, key: string) =>
      page.locator(`meta[${attr}="${key}"]`);
    const OG_IMAGE = `${SITE_URL}og-image.png`;

    await expect(meta("property", "og:image")).toHaveAttribute(
      "content",
      OG_IMAGE,
    );
    await expect(meta("property", "og:image:width")).toHaveAttribute(
      "content",
      "1200",
    );
    await expect(meta("property", "og:image:height")).toHaveAttribute(
      "content",
      "630",
    );
    await expect(meta("property", "og:image:alt")).toHaveAttribute(
      "content",
      /Manuel Maxera, AI Engineer/,
    );
    await expect(meta("name", "twitter:image")).toHaveAttribute(
      "content",
      OG_IMAGE,
    );
    // The live URL isn't this build, so load the same path from the server.
    const image = await request.get(new URL(OG_IMAGE).pathname);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toBe("image/png");
  });

  test("/ HTML has a JSON-LD Person with Manuel's job, employer, city and profile links", async ({
    page,
  }) => {
    await page.goto("/");
    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(1);

    const person = JSON.parse((await scripts.textContent()) ?? "");

    expect(person).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Manuel Maxera",
      jobTitle: "AI Engineer",
      url: SITE_URL,
      address: { addressLocality: "Buenos Aires" },
      worksFor: { name: "Avature" },
    });
    expect(person.sameAs).toEqual(expect.arrayContaining([LINKEDIN, GITHUB]));
  });
});

test("with JavaScript on, the noscript content is not shown", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("main", { name: "Manuel Maxera" })).toHaveCount(
    0,
  );
  await expect(page.getByText(SUMMARY_START)).toBeHidden();
});
