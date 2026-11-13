import { expect, test } from "@playwright/test";

// playwright.config.ts builds with this placeholder CF_BEACON_TOKEN.
const BEACON_TOKEN = "e2e-beacon-token";
const BEACON_SRC = "https://static.cloudflareinsights.com/beacon.min.js";

const PAGES = ["/", "/privacy", "/some/unknown/path"];

for (const path of PAGES) {
  test(`${path} requests the Cloudflare Web Analytics beacon with the build's token`, async ({
    page,
  }) => {
    // Answer the beacon request here, so nothing reaches Cloudflare.
    const beaconRequests: string[] = [];
    await page.route(BEACON_SRC, (route) => {
      beaconRequests.push(route.request().url());
      return route.fulfill({ contentType: "text/javascript", body: "" });
    });

    await page.goto(path);

    const beacon = page.locator(`script[src="${BEACON_SRC}"]`);
    await expect(beacon).toHaveCount(1);
    await expect(beacon).toHaveAttribute("defer", "");
    expect(
      JSON.parse((await beacon.getAttribute("data-cf-beacon")) ?? ""),
    ).toEqual({ token: BEACON_TOKEN });
    await expect.poll(() => beaconRequests).toEqual([BEACON_SRC]);
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
