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

test("the sidebar's Claude project rows keep their chevron centred with a 4px gap, unchanged by the phone Project card styles", async ({
  page,
}) => {
  await page.goto("/");
  const row = page
    .getByRole("navigation", { name: "Claude projects" })
    .getByRole("button", { name: "about-me" });

  const layout = await row.evaluate((element) => {
    const style = getComputedStyle(element);
    return { gap: style.columnGap, alignItems: style.alignItems };
  });

  expect(layout).toEqual({ gap: "4px", alignItems: "center" });
});
