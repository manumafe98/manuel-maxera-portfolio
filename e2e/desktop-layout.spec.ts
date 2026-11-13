import { expect, test } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "desktop-only behaviour");

test("on desktop the phone layout is not visible, only the Ubuntu Desktop", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Dock" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open Chats" })).toBeHidden();
  await expect(
    page.getByRole("navigation", { name: "Recents", includeHidden: true }),
  ).toBeHidden();
});

test("the Desktop requests the Ubuntu wallpaper image", async ({ page }) => {
  const wallpaperRequest = page.waitForRequest((request) =>
    request.url().includes("jammy_wallpaper"),
  );

  await page.goto("/");

  expect((await wallpaperRequest).url()).toMatch(/\.webp$/);
});
