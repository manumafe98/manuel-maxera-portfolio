import { expect, test } from "@playwright/test";

test.describe("phone", () => {
  test.skip(({ isMobile }) => !isMobile, "phone-only behaviour");

  test("opening the site on a phone redirects to the Service Unavailable page", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/unavailable$/);
    await expect(page.getByText("Service Unavailable")).toBeVisible();
  });
});
