import { expect, test } from "@playwright/test";

// playwright.config.ts makes cloud.umami.is unreachable, so the real Umami
// script never loads and no test ever reports a visit.

const UMAMI_SRC = "https://cloud.umami.is/script.js";
const WEBSITE_ID = "d3d352a7-8cac-4be0-835d-0b7f7174e382";
const DOMAINS = "manuelmaxera.com,www.manuelmaxera.com";

const PAGES = ["/", "/privacy", "/some/unknown/path"];

for (const path of PAGES) {
  test(`${path} loads the Umami script deferred, with the site's Website ID and only the manuelmaxera.com domains`, async ({
    page,
  }) => {
    await page.goto(path);

    const script = page.locator(`script[src="${UMAMI_SRC}"]`);
    await expect(script).toHaveCount(1);
    await expect(script).toHaveAttribute("defer", "");
    await expect(script).toHaveAttribute("data-website-id", WEBSITE_ID);
    await expect(script).toHaveAttribute("data-domains", DOMAINS);
  });

  test(`${path} has no Cloudflare Web Analytics beacon in its HTML`, async ({
    request,
  }) => {
    const html = await (await request.get(path)).text();

    expect(html).toContain(UMAMI_SRC);
    expect(html).not.toMatch(/cloudflareinsights|data-cf-beacon/);
  });
}

test("loading /, /privacy and the 404 page sets no cookies", async ({
  page,
  context,
}) => {
  for (const path of PAGES) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
  }

  expect(await context.cookies()).toEqual([]);
});
