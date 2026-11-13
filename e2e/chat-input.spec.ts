import { expect, test, type Page } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "desktop-only behaviour");

const claudeCode = (page: Page) =>
  page.getByRole("dialog", { name: "Claude Code" });

const chat = (page: Page, title: string) =>
  claudeCode(page).getByRole("region", { name: title });

const openChat = (page: Page, title: string) =>
  claudeCode(page)
    .getByRole("navigation", { name: "Claude projects" })
    .getByRole("button", { name: title })
    .click();

const commandInput = (page: Page, title: string) =>
  chat(page, title).getByRole("combobox", { name: "Message" });

const commandList = (page: Page, title: string) =>
  chat(page, title).getByRole("listbox", { name: "Commands" });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("the / list", () => {
  test("typing / in About Me lists its Commands and /socials, each with a one-line description", async ({
    page,
  }) => {
    await openChat(page, "Who is Manuel Maxera?");
    const input = commandInput(page, "Who is Manuel Maxera?");

    await input.fill("/");

    await expect(input).toHaveAttribute("aria-expanded", "true");
    const options = commandList(page, "Who is Manuel Maxera?").getByRole(
      "option",
    );
    await expect(options).toHaveText([
      /^\/about-me.*Manuel's full background/,
      /^\/tldr.*a two-line summary/,
      /^\/download-cv.*download the current CV as a PDF/,
      /^\/socials.*Manuel's LinkedIn and GitHub links/,
    ]);
  });

  test("typing more after / filters the list to the matching Commands", async ({
    page,
  }) => {
    await openChat(page, "Who is Manuel Maxera?");

    await commandInput(page, "Who is Manuel Maxera?").fill("/tl");

    await expect(
      commandList(page, "Who is Manuel Maxera?").getByRole("option"),
    ).toHaveText([/^\/tldr/]);
  });

  test("ArrowDown then Enter runs the highlighted Command", async ({
    page,
  }) => {
    await openChat(page, "Who is Manuel Maxera?");
    const input = commandInput(page, "Who is Manuel Maxera?");
    await input.fill("/");

    await input.press("ArrowDown");
    await expect(
      commandList(page, "Who is Manuel Maxera?").getByRole("option", {
        selected: true,
      }),
    ).toHaveText(/^\/tldr/);
    await input.press("Enter");

    await expect(chat(page, "Who is Manuel Maxera?")).toContainText(
      'mcp__portfolio__get_profile({ format: "short" })',
    );
    await expect(commandList(page, "Who is Manuel Maxera?")).toBeHidden();
  });

  test("ArrowUp from the first Command wraps to the last, and Tab completes it into the input without running it", async ({
    page,
  }) => {
    await openChat(page, "Who is Manuel Maxera?");
    const input = commandInput(page, "Who is Manuel Maxera?");
    await input.fill("/");

    await input.press("ArrowUp");
    await input.press("Tab");

    await expect(input).toHaveValue("/socials");
    await expect(input).toBeFocused();
    await expect(
      chat(page, "Who is Manuel Maxera?").getByRole("article", {
        name: "Reply",
      }),
    ).toHaveCount(0);
  });

  test("clicking a Command in the list runs it", async ({ page }) => {
    await openChat(page, "Who is Manuel Maxera?");
    await commandInput(page, "Who is Manuel Maxera?").fill("/");

    await commandList(page, "Who is Manuel Maxera?")
      .getByRole("option", { name: /\/tldr/ })
      .click();

    await expect(chat(page, "Who is Manuel Maxera?")).toContainText(
      'mcp__portfolio__get_profile({ format: "short" })',
    );
  });

  test("Escape closes the list and keeps the typed text", async ({ page }) => {
    await openChat(page, "Who is Manuel Maxera?");
    const input = commandInput(page, "Who is Manuel Maxera?");
    await input.fill("/t");

    await input.press("Escape");

    await expect(commandList(page, "Who is Manuel Maxera?")).toBeHidden();
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(input).toHaveValue("/t");
  });
});

test('/tldr typed in the experience Chat names the "Who is Manuel Maxera?" Chat and the about-me Claude project, and its button opens that Chat', async ({
  page,
}) => {
  await openChat(page, "Manuel's career timeline");
  const input = commandInput(page, "Manuel's career timeline");
  await input.fill("/tldr");
  await input.press("Enter");

  const reply = chat(page, "Manuel's career timeline").getByRole("article", {
    name: "Reply",
  });
  await expect(reply).toContainText(
    "/tldr lives in Who is Manuel Maxera? (about-me)",
  );
  await reply
    .getByRole("button", { name: "Open Who is Manuel Maxera?" })
    .click();

  await expect(chat(page, "Who is Manuel Maxera?")).toBeVisible();
  await expect(chat(page, "Manuel's career timeline")).toBeHidden();
});

test("with reduced motion, a reply shows its full answer at once without streaming", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openChat(page, "Who is Manuel Maxera?");

  await chat(page, "Who is Manuel Maxera?")
    .getByRole("button", { name: "/about-me" })
    .click();

  // Streamed, /about-me takes several seconds; here it is complete at once.
  const reply = chat(page, "Who is Manuel Maxera?").getByRole("article", {
    name: "Reply",
  });
  await expect(reply).toHaveAttribute("aria-busy", "false", { timeout: 500 });
  await expect(reply).toContainText("Italian: Elementary (A2)");
  await expect(reply.getByText(/^Thought for \d+s$/)).toBeVisible();
});

for (const title of [
  "Getting started with Manuel's portfolio",
  "Manuel's career timeline",
  "Tech stack overview",
]) {
  test(`/socials in the ${title} Chat calls get_socials and links LinkedIn and GitHub in a new tab`, async ({
    page,
  }) => {
    await openChat(page, title);
    const input = commandInput(page, title);
    await input.fill("/socials");
    await input.press("Enter");

    const reply = chat(page, title).getByRole("article", {
      name: "Reply",
    });
    await expect(reply).toContainText("mcp__portfolio__get_socials()");
    const linkedIn = reply.getByRole("link", { name: "LinkedIn" });
    const gitHub = reply.getByRole("link", { name: "GitHub" });
    await expect(linkedIn).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/manuel-maxera/",
    );
    await expect(gitHub).toHaveAttribute(
      "href",
      "https://github.com/manumafe98",
    );
    for (const link of [linkedIn, gitHub]) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
}

test("the /socials LinkedIn and GitHub links sit in a row with no list bullets, so no bullet overlaps the LinkedIn text", async ({
  page,
}) => {
  const title = "Getting started with Manuel's portfolio";
  await openChat(page, title);
  const input = commandInput(page, title);
  await input.fill("/socials");
  await input.press("Enter");

  const reply = chat(page, title).getByRole("article", { name: "Reply" });
  const items = reply
    .getByRole("link", { name: /^(LinkedIn|GitHub)$/ })
    .locator("xpath=ancestor::li[1]");
  await expect(items).toHaveCount(2);
  const bullets = await items.evaluateAll((lis) =>
    lis.map((li) => getComputedStyle(li).listStyleType),
  );
  expect(bullets).toEqual(["none", "none"]);
});

test("while a reply streams, the input takes typing but neither Enter, Send, the chips nor the / list start a second reply, and the typed text waits in the input", async ({
  page,
}) => {
  await openChat(page, "Who is Manuel Maxera?");
  const aboutMe = chat(page, "Who is Manuel Maxera?");
  const input = commandInput(page, "Who is Manuel Maxera?");
  const reply = aboutMe.getByRole("article", { name: "Reply" });
  await aboutMe.getByRole("button", { name: "/about-me" }).click();
  await expect(reply).toHaveAttribute("aria-busy", "true");

  await input.fill("/tldr");
  await input.press("Enter");

  await expect(input).toHaveValue("/tldr");
  await expect(commandList(page, "Who is Manuel Maxera?")).toBeHidden();
  await expect(aboutMe.getByRole("button", { name: "Send" })).toBeDisabled();
  await expect(aboutMe.getByRole("button", { name: "/tldr" })).toBeDisabled();
  await expect(reply).toHaveAttribute("aria-busy", "true");
  await expect(aboutMe).toContainText("Italian: Elementary (A2)");
  await expect(reply).toHaveAttribute("aria-busy", "false");
  await expect(reply).toHaveCount(1);
  await expect(input).toHaveValue("/tldr");

  await input.press("Enter");

  await expect(reply).toHaveCount(2);
});
