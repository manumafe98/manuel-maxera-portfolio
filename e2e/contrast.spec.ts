/// <reference lib="dom" />
import { expect, test, type Locator } from "@playwright/test";

/**
 * The WCAG 2 contrast ratio between the element's text colour (or its
 * placeholder's) and the first opaque background behind it.
 */
const contrastRatio = (target: Locator, pseudo?: "::placeholder") =>
  target.evaluate((element, pseudoElement) => {
    const rgb = (color: string) =>
      (color.match(/[\d.]+/g) ?? []).map(Number) as number[];
    const luminance = ([r, g, b]: number[]) => {
      const channel = (value: number) => {
        const c = value / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };

    const text = rgb(getComputedStyle(element, pseudoElement).color);
    let node: Element | null = element;
    let background: number[] | null = null;
    while (node && !background) {
      const color = rgb(getComputedStyle(node).backgroundColor);
      if (color.length === 3 || color[3] === 1) background = color;
      node = node.parentElement;
    }
    const [light, dark] = [luminance(text), luminance(background!)].sort(
      (a, b) => b - a,
    );
    return (light + 0.05) / (dark + 0.05);
  }, pseudo);

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
