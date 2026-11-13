/// <reference lib="dom" />
import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";

test.describe("with JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("/privacy shows the privacy page with a link home", async ({ page }) => {
    const response = await page.goto("/privacy");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: "Privacy" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/",
    );
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

test("the build writes dist/404.html and dist/privacy.html for Netlify", () => {
  expect(existsSync("dist/404.html")).toBe(true);
  expect(existsSync("dist/privacy.html")).toBe(true);
});

test("react-router is no longer a dependency", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  expect(
    Object.keys(deps).filter((name) => name.includes("react-router")),
  ).toEqual([]);
});
