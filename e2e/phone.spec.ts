/// <reference lib="dom" />
import { expect, test, type Page } from "@playwright/test";

test.skip(({ isMobile }) => !isMobile, "phone-only behaviour");

const WELCOME = "Getting started with Manuel's portfolio";

const CHAT_TITLES = [
  WELCOME,
  "Who is Manuel Maxera?",
  "Manuel's career timeline",
  "Side projects showcase",
  "Tech stack overview",
  "Reaching out to Manuel",
];

const chat = (page: Page, title: string) =>
  page.getByRole("region", { name: title });

const menuButton = (page: Page) =>
  page.getByRole("button", { name: "Open Chats" });

const drawer = (page: Page) =>
  page.getByRole("dialog", { name: "Claude Code" });

const recents = (page: Page) =>
  drawer(page).getByRole("navigation", { name: "Recents" });

const dock = (page: Page) => page.getByRole("navigation", { name: "Dock" });

test("on a phone the Welcome Chat is open on load and no part of the Ubuntu Desktop is shown", async ({
  page,
}) => {
  await page.goto("/");

  await expect(chat(page, WELCOME)).toBeVisible();
  await expect(page.getByRole("banner")).toContainText(WELCOME);
  await expect(dock(page)).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Close Claude Code" }),
  ).toBeHidden();
});

test("on a phone the Ubuntu Desktop is never visible, from the first render of the page on", async ({
  page,
}) => {
  // Runs before any page script: records every DOM change in which the dock
  // is visible. Observer callbacks run before the browser paints.
  await page.addInitScript(() => {
    const seen: string[] = [];
    (window as unknown as { desktopSeen: string[] }).desktopSeen = seen;
    new MutationObserver(() => {
      const dock = document.querySelector('nav[aria-label="Dock"]');
      if (dock?.checkVisibility()) seen.push("dock");
    }).observe(document, { childList: true, subtree: true });
  });

  await page.goto("/");
  await expect(menuButton(page)).toBeVisible();

  const dockRendered = await page.evaluate(
    () => !!document.querySelector('nav[aria-label="Dock"]'),
  );
  expect(dockRendered).toBe(true);
  expect(
    await page.evaluate(
      () => (window as unknown as { desktopSeen: string[] }).desktopSeen,
    ),
  ).toEqual([]);
});

test("the menu button opens a drawer headed Claude Code that lists the six Chats under Recents, with Welcome marked current", async ({
  page,
}) => {
  await page.goto("/");

  await menuButton(page).click();

  await expect(drawer(page)).toBeVisible();
  await expect(
    drawer(page).getByRole("heading", { name: "Claude Code" }),
  ).toBeVisible();
  await expect(recents(page).getByRole("button")).toHaveText(CHAT_TITLES);
  await expect(
    recents(page).getByRole("button", { name: WELCOME }),
  ).toHaveAttribute("aria-current", "page");
});

test("tapping a Chat in the drawer opens that Chat, shows its title in the header and closes the drawer", async ({
  page,
}) => {
  await page.goto("/");
  await menuButton(page).click();

  await recents(page)
    .getByRole("button", { name: "Manuel's career timeline" })
    .click();

  await expect(drawer(page)).toBeHidden();
  await expect(chat(page, "Manuel's career timeline")).toBeVisible();
  await expect(chat(page, WELCOME)).toBeHidden();
  await expect(page.getByRole("banner")).toContainText(
    "Manuel's career timeline",
  );
  await expect(menuButton(page)).toBeFocused();
});

test("opening the drawer moves focus into it, and Escape closes it and returns focus to the menu button", async ({
  page,
}) => {
  await page.goto("/");
  await menuButton(page).click();

  await expect(
    recents(page).getByRole("button", { name: WELCOME }),
  ).toBeFocused();
  await page.keyboard.press("Escape");

  await expect(drawer(page)).toBeHidden();
  await expect(menuButton(page)).toBeFocused();
  await expect(chat(page, WELCOME)).toBeVisible();
});

test("tapping outside the drawer closes it and keeps the open Chat", async ({
  page,
}) => {
  await page.goto("/");
  await menuButton(page).click();
  await expect(drawer(page)).toBeVisible();

  const viewport = page.viewportSize()!;
  await page.mouse.click(viewport.width - 10, viewport.height / 2);

  await expect(drawer(page)).toBeHidden();
  await expect(chat(page, WELCOME)).toBeVisible();
});

test("on a phone the /tldr chip shows thinking that folds into 'Thought for', a get_profile tool call, then streams the short summary", async ({
  page,
}) => {
  await page.goto("/");
  await menuButton(page).click();
  await recents(page)
    .getByRole("button", { name: "Who is Manuel Maxera?" })
    .click();
  const aboutMe = chat(page, "Who is Manuel Maxera?");

  await aboutMe.getByRole("button", { name: "/tldr" }).click();

  const reply = aboutMe.getByRole("article", { name: "Reply" });
  await expect(reply).toHaveAttribute("aria-busy", "true");
  await expect(
    aboutMe.getByRole("combobox", { name: "Message" }),
  ).toBeDisabled();
  await expect(reply.getByText(/^Thought for \d+s$/)).toBeVisible();
  await expect(reply).toContainText(
    'mcp__portfolio__get_profile({ format: "short" })',
  );
  await expect(reply).toContainText(
    "Background in full-stack product engineering and cloud infrastructure.",
  );
  await expect(reply).toHaveAttribute("aria-busy", "false");
  await expect(
    aboutMe.getByRole("combobox", { name: "Message" }),
  ).toBeEnabled();
});

test("typing /about-me in the phone composer and tapping Send streams the full background", async ({
  page,
}) => {
  await page.goto("/");
  await menuButton(page).click();
  await recents(page)
    .getByRole("button", { name: "Who is Manuel Maxera?" })
    .click();
  const aboutMe = chat(page, "Who is Manuel Maxera?");

  await aboutMe.getByRole("combobox", { name: "Message" }).fill("/about-me");
  await aboutMe.getByRole("button", { name: "Send" }).click();

  await expect(aboutMe).toContainText("mcp__portfolio__get_profile()");
  await expect(aboutMe).toContainText("Spanish: Native");
});

/** Opens a Chat from the drawer, runs a Skill chip and waits for its reply. */
const runSkill = async (page: Page, title: string, command: string) => {
  await page.goto("/");
  await menuButton(page).click();
  await recents(page).getByRole("button", { name: title }).click();
  const skillChat = chat(page, title);
  await skillChat.getByRole("button", { name: command }).click();
  const reply = skillChat.getByRole("article", { name: "Reply" });
  await expect(reply).toHaveAttribute("aria-busy", "false");
  return reply;
};

const anyAppWindow = (page: Page) =>
  page.getByRole("dialog", {
    name: /^(Software|Files|Gmail)$/,
    includeHidden: true,
  });

test.describe("Skill cards", () => {
  test("on a phone /open-projects shows one card per Project under a summary that describes the cards, and opens no App window", async ({
    page,
  }) => {
    const reply = await runSkill(
      page,
      "Side projects showcase",
      "/open-projects",
    );

    await expect(reply).toContainText(
      "Here are Manuel's 5 Projects, each linking to its code:",
    );
    await expect(reply).not.toContainText("Opened Software");
    const cards = reply
      .getByRole("list", { name: "Projects" })
      .getByRole("listitem");
    await expect(cards.getByRole("heading")).toHaveText([
      "Trading Strategy Tester",
      "HoytsX",
      "Pokemon Voting",
      "Exercism",
      "Vbnb",
    ]);
    await expect(cards.nth(1)).toContainText("Your cinema in the blockchain");
    await expect(
      cards.nth(1).getByRole("img", { name: "HoytsX Logo" }),
    ).toBeVisible();
    await expect(cards.nth(0)).toContainText("TST");
    await expect(anyAppWindow(page)).toHaveCount(0);
  });

  test("each phone Project card links to its GitHub repo in a new tab with rel noopener noreferrer", async ({
    page,
  }) => {
    const reply = await runSkill(
      page,
      "Side projects showcase",
      "/open-projects",
    );

    const repoLinks = reply.getByRole("link", { name: /on GitHub$/ });
    await expect(repoLinks).toHaveCount(5);
    const hoytsx = reply.getByRole("link", { name: "HoytsX on GitHub" });
    await expect(hoytsx).toHaveAttribute(
      "href",
      "https://github.com/manumafe98/HoytsX",
    );
    await expect(hoytsx).toHaveAttribute("target", "_blank");
    await expect(hoytsx).toHaveAttribute("rel", "noopener noreferrer");
    expect((await hoytsx.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });

  test("on a phone /open-skills shows the skills as tag chips grouped by area, Python with its icon, and opens no App window", async ({
    page,
  }) => {
    const reply = await runSkill(page, "Tech stack overview", "/open-skills");

    await expect(reply).toContainText(
      "Here are Manuel's 38 skills in 6 areas:",
    );
    await expect(reply.getByRole("heading")).toHaveText([
      "Languages",
      "Frameworks",
      "AI engineering",
      "Search and backend",
      "Quality and observability",
      "AI developer tooling",
    ]);
    await expect(
      reply.getByRole("list", { name: "Languages" }).getByRole("listitem"),
    ).toHaveText([
      "Python",
      "PHP",
      "TypeScript",
      "Java",
      "Solidity",
      "JavaScript",
    ]);
    await expect(
      reply
        .getByRole("list", { name: "AI developer tooling" })
        .getByRole("listitem"),
    ).toHaveText(["Devin", "Windsurf", "Codex", "Opencode"]);
    await expect(
      reply
        .getByRole("listitem")
        .filter({ hasText: /^Python$/ })
        .locator("svg"),
    ).toBeVisible();
    await expect(anyAppWindow(page)).toHaveCount(0);
  });
});

test("a phone never requests the Ubuntu wallpaper image", async ({ page }) => {
  const wallpaperRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("jammy_wallpaper")) {
      wallpaperRequests.push(request.url());
    }
  });

  await page.goto("/");
  await expect(menuButton(page)).toBeVisible();
  await page.waitForLoadState("networkidle");

  expect(wallpaperRequests).toEqual([]);
});

test("the menu button, the drawer's Chats, the chips, the input and Send are at least 44px tall for touch", async ({
  page,
}) => {
  await page.goto("/");
  const welcome = chat(page, WELCOME);
  const targets = [
    menuButton(page),
    welcome.getByRole("button", { name: "/download-cv" }),
    welcome.getByRole("combobox", { name: "Message" }),
    welcome.getByRole("button", { name: "Send" }),
  ];
  for (const target of targets) {
    expect((await target.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }

  await menuButton(page).click();
  for (const title of CHAT_TITLES) {
    const recent = recents(page).getByRole("button", { name: title });
    expect((await recent.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
});
