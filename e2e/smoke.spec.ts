import { expect, test } from "@playwright/test";

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "desktop-only behaviour");

  test("choosing About Me in the Terminal opens the Sublime window with the AI Engineer summary from the CV", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText("Please select an option:")).toBeVisible();

    await page.keyboard.press("Enter");

    const aboutMeWindow = page
      .getByRole("dialog")
      .filter({ hasText: "About_me.md" });
    await expect(aboutMeWindow).toBeVisible();
    await expect(aboutMeWindow).toContainText(
      "AI Engineer focused on production LLM agents and backend platforms for enterprise SaaS",
    );
  });
});

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
