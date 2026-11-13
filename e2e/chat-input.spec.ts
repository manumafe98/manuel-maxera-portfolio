import { expect, test, type Page } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "desktop-only behaviour");

const claudeCode = (page: Page) =>
  page.getByRole("dialog", { name: "Claude Code" });

const chat = (page: Page, displayName: string) =>
  claudeCode(page).getByRole("region", { name: displayName });

const openChat = (page: Page, displayName: string) =>
  claudeCode(page)
    .getByRole("navigation", { name: "Claude projects" })
    .getByRole("button", { name: displayName })
    .click();

const commandInput = (page: Page, displayName: string) =>
  chat(page, displayName).getByRole("combobox", { name: "Message" });

const commandList = (page: Page, displayName: string) =>
  chat(page, displayName).getByRole("listbox", { name: "Commands" });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("the / list", () => {
  test("typing / in About Me lists its Commands and /socials, each with a one-line description", async ({
    page,
  }) => {
    await openChat(page, "About Me");
    const input = commandInput(page, "About Me");

    await input.fill("/");

    await expect(input).toHaveAttribute("aria-expanded", "true");
    const options = commandList(page, "About Me").getByRole("option");
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
    await openChat(page, "About Me");

    await commandInput(page, "About Me").fill("/tl");

    await expect(commandList(page, "About Me").getByRole("option")).toHaveText([
      /^\/tldr/,
    ]);
  });

  test("ArrowDown then Enter runs the highlighted Command", async ({
    page,
  }) => {
    await openChat(page, "About Me");
    const input = commandInput(page, "About Me");
    await input.fill("/");

    await input.press("ArrowDown");
    await expect(
      commandList(page, "About Me").getByRole("option", { selected: true }),
    ).toHaveText(/^\/tldr/);
    await input.press("Enter");

    await expect(chat(page, "About Me")).toContainText(
      'mcp__portfolio__get_profile({ format: "short" })',
    );
    await expect(commandList(page, "About Me")).toBeHidden();
  });

  test("ArrowUp from the first Command wraps to the last, and Tab completes it into the input without running it", async ({
    page,
  }) => {
    await openChat(page, "About Me");
    const input = commandInput(page, "About Me");
    await input.fill("/");

    await input.press("ArrowUp");
    await input.press("Tab");

    await expect(input).toHaveValue("/socials");
    await expect(input).toBeFocused();
    await expect(
      chat(page, "About Me").getByRole("article", { name: "Reply" }),
    ).toHaveCount(0);
  });

  test("clicking a Command in the list runs it", async ({ page }) => {
    await openChat(page, "About Me");
    await commandInput(page, "About Me").fill("/");

    await commandList(page, "About Me")
      .getByRole("option", { name: /\/tldr/ })
      .click();

    await expect(chat(page, "About Me")).toContainText(
      'mcp__portfolio__get_profile({ format: "short" })',
    );
  });

  test("Escape closes the list and keeps the typed text", async ({ page }) => {
    await openChat(page, "About Me");
    const input = commandInput(page, "About Me");
    await input.fill("/t");

    await input.press("Escape");

    await expect(commandList(page, "About Me")).toBeHidden();
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(input).toHaveValue("/t");
  });
});

test("/tldr typed in the Experience Chat names the About Me Chat, and its link opens About Me", async ({
  page,
}) => {
  await openChat(page, "Experience");
  const input = commandInput(page, "Experience");
  await input.fill("/tldr");
  await input.press("Enter");

  const reply = chat(page, "Experience").getByRole("article", {
    name: "Reply",
  });
  await expect(reply).toContainText("/tldr lives in the About Me Chat");
  await reply.getByRole("button", { name: "Open About Me" }).click();

  await expect(chat(page, "About Me")).toBeVisible();
  await expect(chat(page, "Experience")).toBeHidden();
});

test("with reduced motion, a reply shows its full answer at once without streaming", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openChat(page, "About Me");

  await chat(page, "About Me")
    .getByRole("button", { name: "/about-me" })
    .click();

  // Streamed, /about-me takes several seconds; here it is complete at once.
  const reply = chat(page, "About Me").getByRole("article", { name: "Reply" });
  await expect(reply).toHaveAttribute("aria-busy", "false", { timeout: 500 });
  await expect(reply).toContainText("Italian: Elementary (A2)");
  await expect(reply.getByText(/^Thought for \d+s$/)).toBeVisible();
});

for (const displayName of ["Welcome", "Experience", "Skills"]) {
  test(`/socials in the ${displayName} Chat calls get_socials and links LinkedIn and GitHub in a new tab`, async ({
    page,
  }) => {
    await openChat(page, displayName);
    const input = commandInput(page, displayName);
    await input.fill("/socials");
    await input.press("Enter");

    const reply = chat(page, displayName).getByRole("article", {
      name: "Reply",
    });
    await expect(reply).toContainText("mcp__portfolio__get_socials()");
    const linkedIn = reply.getByRole("link", { name: "LinkedIn" });
    const gitHub = reply.getByRole("link", { name: "GitHub" });
    await expect(linkedIn).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/manuelmaxera/",
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

test("while a reply streams, neither the chips, the input nor the / list can start another Command", async ({
  page,
}) => {
  await openChat(page, "About Me");
  const aboutMe = chat(page, "About Me");
  const input = commandInput(page, "About Me");
  await input.fill("/");
  await commandList(page, "About Me")
    .getByRole("option", { name: /\/about-me/ })
    .click();

  await expect(input).toBeDisabled();
  await expect(commandList(page, "About Me")).toBeHidden();
  await expect(aboutMe.getByRole("button", { name: "/tldr" })).toBeDisabled();
  await expect(aboutMe).toContainText("Italian: Elementary (A2)");
  await expect(aboutMe.getByRole("article", { name: "Reply" })).toHaveCount(1);
});
