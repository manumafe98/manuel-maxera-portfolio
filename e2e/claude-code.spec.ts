import { expect, test, type Page } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "desktop-only behaviour");

const claudeCode = (page: Page) =>
  page.getByRole("dialog", { name: "Claude Code" });

const chat = (page: Page, title: string) =>
  claudeCode(page).getByRole("region", { name: title });

const sidebar = (page: Page) =>
  claudeCode(page).getByRole("navigation", { name: "Claude projects" });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Claude Code opens on load with the Welcome Chat active, its intro saying replies are scripted, its chip and a short placeholder", async ({
  page,
}) => {
  const welcome = chat(page, "Getting started with Manuel's portfolio");

  await expect(welcome).toBeVisible();
  await expect(
    sidebar(page).getByRole("button", {
      name: "Getting started with Manuel's portfolio",
    }),
  ).toHaveAttribute("aria-current", "page");
  await expect(welcome).toContainText("Manuel Maxera's portfolio");
  await expect(
    welcome.getByRole("button", { name: "/download-cv" }),
  ).toBeVisible();
  await expect(
    welcome.getByRole("combobox", { name: "Message" }),
  ).toHaveAttribute("placeholder", "Type / for commands");
  await expect(welcome).toContainText(
    "Replies here are scripted, with no live model behind them.",
  );
});

test('clicking "Who is Manuel Maxera?" in the sidebar shows that Chat and hides the Welcome Chat', async ({
  page,
}) => {
  await sidebar(page)
    .getByRole("button", { name: "Who is Manuel Maxera?" })
    .click();

  await expect(chat(page, "Who is Manuel Maxera?")).toBeVisible();
  await expect(chat(page, "Who is Manuel Maxera?")).toContainText("/tldr");
  await expect(
    chat(page, "Getting started with Manuel's portfolio"),
  ).toBeHidden();
});

test("the about-me link in the Welcome intro opens the about-me Chat and marks it current in the sidebar", async ({
  page,
}) => {
  await chat(page, "Getting started with Manuel's portfolio")
    .getByRole("button", { name: "about-me", exact: true })
    .click();

  await expect(chat(page, "Who is Manuel Maxera?")).toBeVisible();
  await expect(
    sidebar(page).getByRole("button", { name: "Who is Manuel Maxera?" }),
  ).toHaveAttribute("aria-current", "page");
});

test("the /tldr chip keeps the input editable while it shows thinking that folds into 'Thought for', a get_profile tool call, then the short summary", async ({
  page,
}) => {
  await sidebar(page)
    .getByRole("button", { name: "Who is Manuel Maxera?" })
    .click();
  const aboutMe = chat(page, "Who is Manuel Maxera?");
  const input = aboutMe.getByRole("combobox", { name: "Message" });

  await aboutMe.getByRole("button", { name: "/tldr" }).click();

  await expect(aboutMe.getByRole("article", { name: "Reply" })).toHaveAttribute(
    "aria-busy",
    "true",
  );
  // Checked once, not retried, so it can't pass by waiting for the reply to end.
  expect(await input.isEditable()).toBe(true);
  await expect(aboutMe.getByText(/^Thought for \d+s$/)).toBeVisible();
  await expect(aboutMe).toContainText(
    'mcp__portfolio__get_profile({ format: "short" })',
  );
  await expect(aboutMe).toContainText(
    "Background in full-stack product engineering and cloud infrastructure.",
  );
});

test("typing /about-me and pressing Enter streams the full background", async ({
  page,
}) => {
  await sidebar(page)
    .getByRole("button", { name: "Who is Manuel Maxera?" })
    .click();
  const aboutMe = chat(page, "Who is Manuel Maxera?");
  const input = aboutMe.getByRole("combobox", { name: "Message" });

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
  await sidebar(page)
    .getByRole("button", { name: "Who is Manuel Maxera?" })
    .click();
  const aboutMe = chat(page, "Who is Manuel Maxera?");

  await aboutMe.getByRole("button", { name: "/about-me" }).click();
  await aboutMe.getByRole("article", { name: "Reply" }).click();

  await expect(aboutMe).toContainText("Italian: Elementary (A2)", {
    timeout: 1000,
  });
  await expect(aboutMe.getByRole("article", { name: "Reply" })).toHaveAttribute(
    "aria-busy",
    "false",
  );
});

test("/download-cv in the Welcome Chat shows a download card that downloads the CV PDF", async ({
  page,
}) => {
  const welcome = chat(page, "Getting started with Manuel's portfolio");
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

  await expect(
    chat(page, "Getting started with Manuel's portfolio"),
  ).toBeVisible();
});

test("the dock offers Claude Code and no Terminal or About Me app", async ({
  page,
}) => {
  const dock = page.getByRole("navigation", { name: "Dock" });

  await expect(dock.getByRole("button", { name: "Claude Code" })).toBeVisible();
  await expect(dock.getByRole("button", { name: /Terminal/ })).toHaveCount(0);
  await expect(dock.getByRole("button", { name: "About Me" })).toHaveCount(0);
});

test("the experience link in the Welcome intro opens the experience Chat and marks it current in the sidebar", async ({
  page,
}) => {
  await chat(page, "Getting started with Manuel's portfolio")
    .getByRole("button", { name: "experience", exact: true })
    .click();

  await expect(chat(page, "Manuel's career timeline")).toBeVisible();
  await expect(
    sidebar(page).getByRole("button", { name: "Manuel's career timeline" }),
  ).toHaveAttribute("aria-current", "page");
});

test("the /show-latest-experience chip shows a fetch_experiences latest tool call and the current AI Engineer role at Avature with its achievements", async ({
  page,
}) => {
  await sidebar(page)
    .getByRole("button", { name: "Manuel's career timeline" })
    .click();
  const experience = chat(page, "Manuel's career timeline");

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
  await sidebar(page)
    .getByRole("button", { name: "Manuel's career timeline" })
    .click();
  const experience = chat(page, "Manuel's career timeline");

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

test.describe("sidebar", () => {
  for (const { id, title } of [
    {
      id: "manuel-maxera-portfolio",
      title: "Getting started with Manuel's portfolio",
    },
    { id: "about-me", title: "Who is Manuel Maxera?" },
    { id: "experience", title: "Manuel's career timeline" },
    { id: "projects", title: "Side projects showcase" },
    { id: "skills", title: "Tech stack overview" },
    { id: "contact", title: "Reaching out to Manuel" },
  ]) {
    test(`the "${title}" Chat under ${id} opens from the sidebar with its title and Claude project in the header`, async ({
      page,
    }) => {
      await sidebar(page).getByRole("button", { name: title }).click();

      const opened = chat(page, title);
      await expect(opened).toBeVisible();
      await expect(opened.getByRole("heading", { level: 2 })).toHaveText(title);
      await expect(opened.locator("header")).toContainText(id);
    });
  }

  test("clicking the experience Claude project folds away its Chat entry and clicking again shows it", async ({
    page,
  }) => {
    const toggle = sidebar(page).getByRole("button", {
      name: "experience",
      exact: true,
    });
    const entry = sidebar(page).getByRole("button", {
      name: "Manuel's career timeline",
    });
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(entry).toBeVisible();

    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(entry).toBeHidden();
    await expect(
      sidebar(page).getByRole("button", { name: "Who is Manuel Maxera?" }),
    ).toBeVisible();

    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(entry).toBeVisible();
  });

  test("folding the Claude project of the open Chat keeps that Chat open in the main pane", async ({
    page,
  }) => {
    await sidebar(page)
      .getByRole("button", { name: "Who is Manuel Maxera?" })
      .click();

    await sidebar(page)
      .getByRole("button", { name: "about-me", exact: true })
      .click();

    await expect(
      sidebar(page).getByRole("button", { name: "Who is Manuel Maxera?" }),
    ).toBeHidden();
    await expect(chat(page, "Who is Manuel Maxera?")).toBeVisible();
  });
});
