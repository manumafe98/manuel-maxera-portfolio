import { expect, test } from "@playwright/test";

test("/unavailable shows the 404 page, not a Service Unavailable page", async ({
  page,
}) => {
  await page.goto("/unavailable");

  await expect(page).toHaveURL(/\/unavailable$/);
  await expect(page.getByText("Page not found")).toBeVisible();
  await expect(page.getByText("Service Unavailable")).toHaveCount(0);
});
