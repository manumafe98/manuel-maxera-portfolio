/// <reference lib="dom" />
import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";

/** Every Chat, by Claude project id, in sidebar order. */
const CHATS = [
  ["manuel-maxera-portfolio", "Getting started with Manuel's portfolio"],
  ["about-me", "Who is Manuel Maxera?"],
  ["experience", "Manuel's career timeline"],
  ["projects", "Side projects showcase"],
  ["skills", "Tech stack overview"],
  ["contact", "Reaching out to Manuel"],
] as const;

test.describe("with JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("/privacy shows the privacy page with a link home", async ({ page }) => {
    const response = await page.goto("/privacy");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: "Privacy" }),
    ).toBeVisible();
    const homeLinks = page.getByRole("link", { name: /home/i });
    await expect(homeLinks.last()).toHaveAttribute("href", "/");
  });

  test("/privacy explains the cookie-free Cloudflare analytics, the contact form data sent to EmailJS, and how to ask questions", async ({
    page,
  }) => {
    await page.goto("/privacy");
    const main = page.getByRole("main");

    const analytics = main.getByRole("region", { name: "Analytics" });
    await expect(analytics).toContainText("Cloudflare Web Analytics");
    await expect(analytics).toContainText(/doesn't use cookies/);
    await expect(analytics).toContainText(/aggregated/);

    const contactForm = main.getByRole("region", { name: "Contact form" });
    await expect(contactForm).toContainText("EmailJS");
    await expect(contactForm).toContainText(/email address and your message/);
    await expect(contactForm).toContainText(/only to reply/);

    await expect(main).toContainText(/no cookies/i);
    await expect(main).toContainText(/never sold/);
    await expect(
      main.getByRole("link", { name: "manumaxerapro@gmail.com" }),
    ).toHaveAttribute("href", "mailto:manumaxerapro@gmail.com");
    await expect(main).toContainText(/Last updated: \d{1,2} \w+ \d{4}/);
  });

  test("/privacy has a link home above its heading as well as below the policy", async ({
    page,
  }) => {
    await page.goto("/privacy");
    const main = page.getByRole("main");
    const homeLinks = main.getByRole("link", { name: /home/i });

    await expect(homeLinks).toHaveCount(2);
    const [linkTop, headingTop] = await Promise.all([
      homeLinks.first().evaluate((link) => link.getBoundingClientRect().top),
      main
        .getByRole("heading", { level: 1 })
        .evaluate((heading) => heading.getBoundingClientRect().top),
    ]);
    expect(linkTop).toBeLessThan(headingTop);
    await expect(homeLinks.first()).toHaveAttribute("href", "/");
  });

  test("the 404 page answers like a Chat, with an Unknown command heading, and links to each of the six Chats by title at /?chat=<Claude project id>", async ({
    page,
  }) => {
    await page.goto("/this-page-does-not-exist");
    const main = page.getByRole("main");

    await expect(
      main.getByRole("heading", { level: 1, name: "Unknown command" }),
    ).toBeVisible();
    const chats = main.getByRole("navigation", { name: "Chats" });
    await expect(chats.getByRole("link")).toHaveCount(CHATS.length);
    for (const [id, title] of CHATS) {
      await expect(
        chats.getByRole("link", { name: title, exact: true }),
      ).toHaveAttribute("href", `/?chat=${id}`);
    }
  });

  test("an unknown path responds 404 with the custom 404 page and a link home", async ({
    page,
  }) => {
    const response = await page.goto("/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.getByText("Page not found")).toBeVisible();
    await expect(page.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/",
    );
  });
});

test("the pre-rendered pages hydrate without hydration errors", async ({
  page,
}) => {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(message.text());
    }
  });
  page.on("pageerror", (error) => problems.push(error.message));

  for (const path of ["/", "/privacy", "/this-page-does-not-exist"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
  }

  expect(
    problems.filter((text) =>
      /hydrat|Minified React error #(418|419|423|425)/i.test(text),
    ),
  ).toEqual([]);
});

test("after hydration the 404 page's home link goes to the Welcome Chat", async ({
  page,
}) => {
  await page.goto("/this-page-does-not-exist");
  await page.getByRole("link", { name: /home/i }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(
    page
      .getByRole("region", { name: "Getting started with Manuel's portfolio" })
      .first(),
  ).toBeAttached();
});

for (const [id, title] of CHATS.slice(1)) {
  test(`the 404 page's ${title} link opens / with that Chat shown in place of Welcome`, async ({
    page,
  }) => {
    await page.goto("/this-page-does-not-exist");
    await page
      .getByRole("navigation", { name: "Chats" })
      .getByRole("link", { name: title, exact: true })
      .click();

    await expect(page).toHaveURL(`/?chat=${id}`);
    // Both shells are in the page (ADR-0002); CSS shows one of them.
    const shown = (name: string) =>
      page.getByRole("region", { name }).filter({ visible: true });
    await expect(shown(title)).toHaveCount(1);
    await expect(shown(CHATS[0][1])).toHaveCount(0);
  });
}

test("/?chat= with an unknown Claude project id opens the Welcome Chat", async ({
  page,
}) => {
  await page.goto("/?chat=not-a-project");

  await expect(
    page.getByRole("region", { name: CHATS[0][1] }).filter({ visible: true }),
  ).toHaveCount(1);
});

test("the build writes dist/404.html and dist/privacy.html for Netlify", () => {
  expect(existsSync("dist/404.html")).toBe(true);
  expect(existsSync("dist/privacy.html")).toBe(true);
});
