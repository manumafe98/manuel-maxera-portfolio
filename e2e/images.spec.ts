/// <reference lib="dom" />
import { expect, test, type Page } from "@playwright/test";

/**
 * Every <img> without an alt attribute, and every <svg> that a screen reader
 * could reach without a name: one that is neither aria-hidden (itself or an
 * ancestor) nor labelled.
 */
const unlabelledImages = (page: Page) =>
  page.evaluate(() => {
    const describe = (element: Element) =>
      element.outerHTML.slice(0, 120).replace(/\s+/g, " ");
    const images = [...document.querySelectorAll("img:not([alt])")];
    const icons = [...document.querySelectorAll("svg")].filter(
      (svg) =>
        !svg.closest('[aria-hidden="true"]') &&
        !svg.getAttribute("aria-label") &&
        !svg.getAttribute("aria-labelledby"),
    );
    return [...images, ...icons].map(describe);
  });

test("on desktop every image has alt text and every icon is labelled or hidden, with all App windows open", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "desktop-only behaviour");
  await page.goto("/");
  const dock = page.getByRole("navigation", { name: "Dock" });
  for (const button of ["My Projects", "My Skills", "Contact Me"]) {
    await dock.getByRole("button", { name: button }).click();
  }
  await expect(page.getByRole("dialog", { name: "Software" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Files" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Gmail" })).toBeVisible();

  expect(await unlabelledImages(page)).toEqual([]);
});

test("on a phone every image has alt text and every icon is labelled or hidden, with the Projects and skills cards shown", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "phone-only behaviour");
  await page.goto("/");
  for (const [title, command] of [
    ["Tech stack overview", "/open-skills"],
    ["Side projects showcase", "/open-projects"],
  ]) {
    await page.getByRole("button", { name: "Open Chats" }).click();
    await page
      .getByRole("dialog", { name: "Claude Code" })
      .getByRole("button", { name: title })
      .click();
    const chat = page.getByRole("region", { name: title });
    await chat.getByRole("button", { name: command }).click();
    await expect(chat.getByRole("article", { name: "Reply" })).toHaveAttribute(
      "aria-busy",
      "false",
    );
  }
  await expect(page.getByRole("img", { name: "HoytsX Logo" })).toBeVisible();

  expect(await unlabelledImages(page)).toEqual([]);
});
