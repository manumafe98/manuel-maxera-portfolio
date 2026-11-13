import { expect, test } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "desktop-only behaviour");
test.use({ timezoneId: "UTC" });

test("the Top bar clock shows the lower-case month, the day and the 24-hour time, and turns to the next minute within 15 seconds", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-09-03T17:45:50Z") });
  await page.goto("/");

  await expect(page.getByText("sep 03 17:45", { exact: true })).toBeVisible();

  await page.clock.runFor(15_000);

  await expect(page.getByText("sep 03 17:46", { exact: true })).toBeVisible();
});
