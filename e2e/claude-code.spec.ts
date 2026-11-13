import { expect, test, type Page } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "desktop-only behaviour");

const claudeCode = (page: Page) =>
  page.getByRole("dialog", { name: "Claude Code" });

const chat = (page: Page, displayName: string) =>
  claudeCode(page).getByRole("region", { name: displayName });

const sidebar = (page: Page) =>
  claudeCode(page).getByRole("navigation", { name: "Claude projects" });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Claude Code opens on load with the Welcome Chat active and its intro, chip and scripted-reply placeholder", async ({
  page,
}) => {
  const welcome = chat(page, "Welcome");

  await expect(welcome).toBeVisible();
  await expect(
    sidebar(page).getByRole("button", { name: "Welcome" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(welcome).toContainText("Manuel Maxera's portfolio");
  await expect(
    welcome.getByRole("button", { name: "/download-cv" }),
  ).toBeVisible();
  await expect(
    welcome.getByRole("textbox", { name: "Message" }),
  ).toHaveAttribute(
    "placeholder",
    "Type / for commands. Replies are scripted, no live model.",
  );
});

test("clicking About Me in the sidebar shows the About Me Chat and hides Welcome", async ({
  page,
}) => {
  await sidebar(page).getByRole("button", { name: "About Me" }).click();

  await expect(chat(page, "About Me")).toBeVisible();
  await expect(chat(page, "About Me")).toContainText("/tldr");
  await expect(chat(page, "Welcome")).toBeHidden();
});

test("the About Me link in the Welcome intro opens the About Me Chat", async ({
  page,
}) => {
  await chat(page, "Welcome").getByRole("button", { name: "About Me" }).click();

  await expect(chat(page, "About Me")).toBeVisible();
  await expect(
    sidebar(page).getByRole("button", { name: "About Me" }),
  ).toHaveAttribute("aria-current", "page");
});

test("the /tldr chip locks the input, shows thinking that folds into 'Thought for', a get_profile tool call, then the short summary", async ({
  page,
}) => {
  await sidebar(page).getByRole("button", { name: "About Me" }).click();
  const aboutMe = chat(page, "About Me");
  const input = aboutMe.getByRole("textbox", { name: "Message" });

  await aboutMe.getByRole("button", { name: "/tldr" }).click();

  await expect(input).toBeDisabled();
  await expect(aboutMe.getByText(/^Thought for \d+s$/)).toBeVisible();
  await expect(aboutMe).toContainText(
    'mcp__portfolio__get_profile({ format: "short" })',
  );
  await expect(aboutMe).toContainText(
    "Background in full-stack product engineering and cloud infrastructure.",
  );
  await expect(input).toBeEnabled();
});

test("typing /about-me and pressing Enter streams the full background", async ({
  page,
}) => {
  await sidebar(page).getByRole("button", { name: "About Me" }).click();
  const aboutMe = chat(page, "About Me");
  const input = aboutMe.getByRole("textbox", { name: "Message" });

  await input.fill("/about-me");
  await input.press("Enter");

  await expect(aboutMe).toContainText("mcp__portfolio__get_profile()");
  await expect(aboutMe).toContainText(
    "AI Engineer focused on production LLM agents and backend platforms for enterprise SaaS",
  );
  await expect(aboutMe).toContainText("Spanish: Native");
});

test("clicking a reply while it streams shows its full answer at once", async ({
  page,
}) => {
  await sidebar(page).getByRole("button", { name: "About Me" }).click();
  const aboutMe = chat(page, "About Me");

  await aboutMe.getByRole("button", { name: "/about-me" }).click();
  await aboutMe.getByRole("article", { name: "Reply" }).click();

  await expect(aboutMe).toContainText("Italian: Elementary (A2)", {
    timeout: 1000,
  });
  await expect(aboutMe.getByRole("textbox", { name: "Message" })).toBeEnabled();
});

test("/download-cv in the Welcome Chat shows a download card that downloads the CV PDF", async ({
  page,
}) => {
  const welcome = chat(page, "Welcome");
  await welcome.getByRole("button", { name: "/download-cv" }).click();

  const downloading = page.waitForEvent("download");
  await welcome
    .getByRole("link", { name: /Manuel_Maxera_Resume\.pdf/ })
    .click();
  const download = await downloading;

  expect(download.suggestedFilename()).toBe("Manuel_Maxera_Resume.pdf");
  const stream = await download.createReadStream();
  const [firstChunk] = await stream.toArray();
  expect(Buffer.from(firstChunk).subarray(0, 4).toString()).toBe("%PDF");
});

test("Claude Code reopens from the dock after being closed", async ({
  page,
}) => {
  await claudeCode(page)
    .getByRole("button", { name: "Close Claude Code" })
    .click();
  await expect(claudeCode(page)).toBeHidden();

  await page
    .getByRole("navigation", { name: "Dock" })
    .getByRole("button", { name: "Claude Code" })
    .click();

  await expect(chat(page, "Welcome")).toBeVisible();
});

test("the dock no longer offers the Terminal or Sublime apps", async ({
  page,
}) => {
  const dock = page.getByRole("navigation", { name: "Dock" });

  await expect(dock.getByRole("button", { name: "Claude Code" })).toBeVisible();
  await expect(dock.getByRole("button", { name: /Terminal/ })).toHaveCount(0);
  await expect(dock.getByRole("button", { name: "About Me" })).toHaveCount(0);
});

test("the Experience link in the Welcome intro opens the Experience Chat", async ({
  page,
}) => {
  await chat(page, "Welcome")
    .getByRole("button", { name: "Experience" })
    .click();

  await expect(chat(page, "Experience")).toBeVisible();
  await expect(
    sidebar(page).getByRole("button", { name: "Experience" }),
  ).toHaveAttribute("aria-current", "page");
});

test("the /show-latest-experience chip shows a fetch_experiences latest tool call and the current AI Engineer role at Avature with its achievements", async ({
  page,
}) => {
  await sidebar(page).getByRole("button", { name: "Experience" }).click();
  const experience = chat(page, "Experience");

  await experience
    .getByRole("button", { name: "/show-latest-experience" })
    .click();

  await expect(experience).toContainText(
    'mcp__portfolio__fetch_experiences({ scope: "latest" })',
  );
  const reply = experience.getByRole("article", { name: "Reply" });
  await expect(reply).toContainText("AI Engineer · Avature");
  await expect(reply).toContainText("September 2025 – Present");
  await expect(reply).toContainText(
    "Migrated seven agents to a shared prompt architecture",
  );
  await expect(reply).not.toContainText("Sysadmin Unix");
});

test("the /show-full-experience chip shows a fetch_experiences all tool call and a timeline of every role, newest first", async ({
  page,
}) => {
  await sidebar(page).getByRole("button", { name: "Experience" }).click();
  const experience = chat(page, "Experience");

  await experience
    .getByRole("button", { name: "/show-full-experience" })
    .click();

  await expect(experience).toContainText(
    'mcp__portfolio__fetch_experiences({ scope: "all" })',
  );
  const roles = experience
    .getByRole("list", { name: "Experience timeline" })
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading") });
  await expect(roles.getByRole("heading")).toHaveText([
    "AI Engineer · Avature",
    "Software Engineer · Avature",
    "Cloud Engineer · Avature",
    "Sysadmin Unix · IBM – Kyndryl",
  ]);
  await expect(roles.nth(3)).toContainText("November 2019 – March 2022");
  await expect(roles.nth(3)).toContainText(
    "Led server and data migrations and implemented Ansible automation",
  );
});

test("the dock offers Claude Code, Software, Files and Gmail, and no VS Code", async ({
  page,
}) => {
  const dock = page.getByRole("navigation", { name: "Dock" });

  await expect(dock.getByRole("button")).toHaveText(
    ["Claude Code", "Contact Me", "My Projects", "My Skills"].map(
      (name) => new RegExp(name),
    ),
  );
  await expect(
    dock.getByRole("button", { name: "Working Experience" }),
  ).toHaveCount(0);
  await expect(page.getByText("Visual Studio Code")).toHaveCount(0);
});
