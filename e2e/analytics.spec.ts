/// <reference lib="dom" />
import { expect, test, type Page } from "@playwright/test";

// playwright.config.ts makes cloud.umami.is unreachable, so the real Umami
// script never loads and no test ever reports a visit. Command tests stub
// window.umami instead and record its track calls.

const UMAMI_SRC = "https://cloud.umami.is/script.js";
const WEBSITE_ID = "d3d352a7-8cac-4be0-835d-0b7f7174e382";
const DOMAINS = "manuelmaxera.com,www.manuelmaxera.com";

const PAGES = ["/", "/privacy", "/some/unknown/path"];

for (const path of PAGES) {
  test(`${path} loads the Umami script deferred, with the site's Website ID and only the manuelmaxera.com domains`, async ({
    page,
  }) => {
    await page.goto(path);

    const script = page.locator(`script[src="${UMAMI_SRC}"]`);
    await expect(script).toHaveCount(1);
    await expect(script).toHaveAttribute("defer", "");
    await expect(script).toHaveAttribute("data-website-id", WEBSITE_ID);
    await expect(script).toHaveAttribute("data-domains", DOMAINS);
  });

  test(`${path} has no Cloudflare Web Analytics beacon in its HTML`, async ({
    request,
  }) => {
    const html = await (await request.get(path)).text();

    expect(html).toContain(UMAMI_SRC);
    expect(html).not.toMatch(/cloudflareinsights|data-cf-beacon/);
  });
}

test("loading /, /privacy and the 404 page sets no cookies", async ({
  page,
  context,
}) => {
  for (const path of PAGES) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
  }

  expect(await context.cookies()).toEqual([]);
});

const WELCOME = "Getting started with Manuel's portfolio";
const ABOUT_ME = "Who is Manuel Maxera?";
const EXPERIENCE = "Manuel's career timeline";

type TrackCall = unknown[];

/** Replaces Umami with a recorder before any page script runs. */
const recordUmamiCalls = (page: Page) =>
  page.addInitScript(() => {
    const calls: unknown[][] = [];
    Object.assign(window, {
      umamiCalls: calls,
      umami: { track: (...args: unknown[]) => calls.push(args) },
    });
  });

const umamiCalls = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { umamiCalls: TrackCall[] }).umamiCalls,
  );

/** The Chat with this title, in whichever layout is showing. */
const chat = (page: Page, title: string) =>
  page.getByRole("region", { name: title });

const openChat = async (page: Page, isMobile: boolean, title: string) => {
  if (isMobile) {
    await page.getByRole("button", { name: "Open Chats" }).click();
    await page
      .getByRole("dialog", { name: "Claude Code" })
      .getByRole("navigation", { name: "Recents" })
      .getByRole("button", { name: title })
      .click();
  } else {
    await page
      .getByRole("dialog", { name: "Claude Code" })
      .getByRole("navigation", { name: "Claude projects" })
      .getByRole("button", { name: title })
      .click();
  }
  await expect(chat(page, title)).toBeVisible();
};

const waitForReply = (page: Page, title: string) =>
  expect(
    chat(page, title).getByRole("article", { name: "Reply" }).last(),
  ).toHaveAttribute("aria-busy", "false");

const typeCommand = async (page: Page, title: string, text: string) => {
  const input = chat(page, title).getByRole("combobox", { name: "Message" });
  await input.fill(text);
  await input.press("Enter");
};

const CTA_EVENTS = [
  ["/open-contact", "command-open-contact"],
  ["/download-cv", "command-download-cv"],
  ["/socials", "command-socials"],
] as const;

test.describe("call-to-action Commands", () => {
  test.beforeEach(async ({ page }) => {
    await recordUmamiCalls(page);
    await page.goto("/");
  });

  for (const [command, event] of CTA_EVENTS) {
    test(`clicking the ${command} chip sends exactly one "${event}" Umami event`, async ({
      page,
    }) => {
      await chat(page, WELCOME).getByRole("button", { name: command }).click();
      await waitForReply(page, WELCOME);

      expect(await umamiCalls(page)).toEqual([[event]]);
    });

    test(`typing ${command} and pressing Enter sends exactly one "${event}" Umami event`, async ({
      page,
    }) => {
      await typeCommand(page, WELCOME, command);
      await waitForReply(page, WELCOME);

      expect(await umamiCalls(page)).toEqual([[event]]);
    });
  }

  test("typing /OPEN-CONTACT in upper case with surrounding spaces still sends one command-open-contact event", async ({
    page,
  }) => {
    const input = chat(page, WELCOME).getByRole("combobox", {
      name: "Message",
    });
    await input.fill("  /OPEN-CONTACT  ");
    await input.press("Escape");
    await input.press("Enter");
    await waitForReply(page, WELCOME);

    expect(await umamiCalls(page)).toEqual([["command-open-contact"]]);
  });

  test("a Command that isn't a call to action, /about-me, sends no Umami event", async ({
    page,
    isMobile,
  }) => {
    await openChat(page, isMobile, ABOUT_ME);
    await chat(page, ABOUT_ME)
      .getByRole("button", { name: "/about-me" })
      .click();
    await waitForReply(page, ABOUT_ME);

    expect(await umamiCalls(page)).toEqual([]);
  });

  test("typing /download-cv in a Chat that doesn't run it, Experience, sends no Umami event", async ({
    page,
    isMobile,
  }) => {
    await openChat(page, isMobile, EXPERIENCE);
    await typeCommand(page, EXPERIENCE, "/download-cv");
    await waitForReply(page, EXPERIENCE);

    await expect(chat(page, EXPERIENCE)).toContainText(ABOUT_ME);
    expect(await umamiCalls(page)).toEqual([]);
  });
});
