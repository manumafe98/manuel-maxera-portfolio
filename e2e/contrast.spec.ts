/// <reference lib="dom" />
import { expect, test } from "@playwright/test";
import { contrastRatio } from "./contrast";

test("on desktop the faint sidebar Claude project labels, footer chips and composer placeholder have at least 4.5:1 contrast", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "desktop-only behaviour");
  await page.goto("/");
  const claudeCode = page.getByRole("dialog", { name: "Claude Code" });
  const welcome = claudeCode.getByRole("region", {
    name: "Getting started with Manuel's portfolio",
  });

  const projectLabel = claudeCode
    .getByRole("navigation", { name: "Claude projects" })
    .getByRole("button", { name: "about-me", exact: true });
  const footerChip = welcome.locator(".cc-foot-chip").first();
  const composer = welcome.getByRole("combobox", { name: "Message" });

  expect(await contrastRatio(projectLabel)).toBeGreaterThanOrEqual(4.5);
  expect(await contrastRatio(footerChip)).toBeGreaterThanOrEqual(4.5);
  expect(await contrastRatio(composer, "::placeholder")).toBeGreaterThanOrEqual(
    4.5,
  );
});

test("on a phone the drawer's Recents heading and the composer placeholder have at least 4.5:1 contrast", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "phone-only behaviour");
  await page.goto("/");
  await page.getByRole("button", { name: "Open Chats" }).click();

  const recents = page.getByRole("heading", { name: "Recents" });
  const composer = page
    .getByRole("region", { name: "Getting started with Manuel's portfolio" })
    .getByRole("combobox", { name: "Message" });

  expect(await contrastRatio(recents)).toBeGreaterThanOrEqual(4.5);
  expect(await contrastRatio(composer, "::placeholder")).toBeGreaterThanOrEqual(
    4.5,
  );
});
