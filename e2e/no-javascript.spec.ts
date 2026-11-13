/// <reference lib="dom" />
import { expect, test } from "@playwright/test";
import { contrastRatio } from "./contrast";

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

  test("/ HTML, read with or without its noscript block, starts with an H1 and never skips a heading level going deeper", async ({
    page,
  }) => {
    await page.goto("/");
    // Parsers that treat <noscript> as text only see the headings in #root.
    for (const scope of ["body", "#root"]) {
      const levels = await page
        .locator(scope)
        .locator("h1, h2, h3, h4, h5, h6")
        .evaluateAll((headings) =>
          headings.map((heading) => Number(heading.tagName[1])),
        );

      expect(levels[0], scope).toBe(1);
      const skips = levels.filter(
        (level, i) => i > 0 && level > levels[i - 1] + 1,
      );
      expect(skips, `${scope}: ${levels.join(" ")}`).toEqual([]);
    }
  });

  test("/ HTML's first H1 names Manuel Maxera as an AI Engineer, while it still reads Claude Code on screen", async ({
    page,
  }) => {
    await page.goto("/");
    const firstH1 = page.locator("#root h1").first();

    await expect(firstH1).toHaveText(/Manuel Maxera, AI Engineer/);
    await expect(firstH1).toContainText("Claude Code");
  });

  test("/ shows the content with headings sized H1 over H2 over H3 over body text, and space between the sections", async ({
    page,
  }) => {
    await page.goto("/");
    const content = page.getByRole("main", { name: "Manuel Maxera" });
    const fontSize = async (selector: string) =>
      parseFloat(
        await content
          .locator(selector)
          .first()
          .evaluate((element) => getComputedStyle(element).fontSize),
      );

    const [h1, h2, h3, text] = await Promise.all(
      ["h1", "h2", "h3", "p"].map(fontSize),
    );
    expect(h1).toBeGreaterThan(h2);
    expect(h2).toBeGreaterThan(h3);
    expect(h3).toBeGreaterThan(text);

    const gaps = await content
      .locator(":scope > header, :scope > section")
      .evaluateAll((blocks) =>
        blocks
          .slice(1)
          .map(
            (block, i) =>
              block.getBoundingClientRect().top -
              blocks[i].getBoundingClientRect().bottom,
          ),
      );
    expect(gaps).toHaveLength(4);
    for (const gap of gaps) expect(gap).toBeGreaterThanOrEqual(24);
  });

  test("/ shows the content's links in a colour other than the text's, with at least 4.5:1 contrast", async ({
    page,
  }) => {
    await page.goto("/");
    const content = page.getByRole("main", { name: "Manuel Maxera" });
    const link = content.getByRole("link", { name: "LinkedIn" });
    const color = (locator: typeof link) =>
      locator.evaluate((element) => getComputedStyle(element).color);

    expect(await color(link)).not.toBe(
      await color(content.locator("p").first()),
    );
    expect(await contrastRatio(link)).toBeGreaterThanOrEqual(4.5);
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

  test("/ HTML has a JSON-LD Person whose knowsAbout terms all appear in the page text", async ({
    page,
  }) => {
    await page.goto("/");
    const person = JSON.parse(
      (await page
        .locator('script[type="application/ld+json"]')
        .textContent()) ?? "",
    );
    const pageText = await page.locator("body").innerText();

    expect(person.knowsAbout).toEqual(
      expect.arrayContaining([
        "LLM agents",
        "Model Context Protocol",
        "Python",
        "FastAPI",
        "LangGraph",
        "AWS Bedrock",
      ]),
    );
    for (const term of person.knowsAbout) {
      expect(pageText, term).toContain(term);
    }
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

test("with JavaScript on, the page has no CSS rule for the noscript content, so its styles can't change the Desktop or the phone layout", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const noscriptRules = await page.evaluate(() =>
    [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .map((rule) => rule.cssText)
      .filter((text) => text.includes("noscript")),
  );

  expect(noscriptRules).toEqual([]);
});
