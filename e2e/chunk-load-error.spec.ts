import { expect, test, type Page } from "@playwright/test";

/** Makes every request for the named lazy chunk fail, as on a dropped network. */
const blockChunk = (page: Page, chunk: string) =>
  page.route(`**/assets/${chunk}-*.js`, (route) => route.abort());

test("on desktop, when the Files window's code fails to load, the window says it couldn't load with a reload link, and the Software window still opens", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "desktop-only behaviour");
  await blockChunk(page, "FileManagerWindow");
  await page.goto("/");
  const dock = page.getByRole("navigation", { name: "Dock" });

  await dock.getByRole("button", { name: "My Skills" }).click();

  const failedWindow = page.getByRole("dialog", { name: "My Skills" });
  await expect(failedWindow).toContainText(
    "Couldn't load this. Reload the page",
  );
  await expect(
    failedWindow.getByRole("link", { name: "Reload the page" }),
  ).toBeVisible();
  await dock.getByRole("button", { name: "My Projects" }).click();
  await expect(page.getByRole("dialog", { name: "Software" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Claude Code" })).toBeVisible();
});

test("on a phone, when the Tech skills card's code fails to load, the reply says it couldn't load with a reload link, and the Projects card still shows", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "phone-only behaviour");
  await blockChunk(page, "TechSkillsCard");
  await page.goto("/");
  const openChat = async (title: string) => {
    await page.getByRole("button", { name: "Open Chats" }).click();
    await page
      .getByRole("navigation", { name: "Recents" })
      .getByRole("button", { name: title })
      .click();
    return page.getByRole("region", { name: title });
  };

  const skillsChat = await openChat("Tech stack overview");
  await skillsChat.getByRole("button", { name: "/open-skills" }).click();

  const skillsReply = skillsChat.getByRole("article", { name: "Reply" });
  await expect(skillsReply).toContainText(
    "Couldn't load this. Reload the page",
  );
  await expect(
    skillsReply.getByRole("link", { name: "Reload the page" }),
  ).toBeVisible();
  const projectsChat = await openChat("Side projects showcase");
  await projectsChat.getByRole("button", { name: "/open-projects" }).click();
  await expect(
    projectsChat.getByRole("list", { name: "Projects" }).getByRole("listitem"),
  ).toHaveCount(5);
});
