import { expect, test, type Locator, type Page } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "desktop-only behaviour");

const claudeCode = (page: Page) =>
  page.getByRole("dialog", { name: "Claude Code" });

const chat = (page: Page, title: string) =>
  claudeCode(page).getByRole("region", { name: title });

const sidebar = (page: Page) =>
  claudeCode(page).getByRole("navigation", { name: "Claude projects" });

const appWindow = (page: Page, name: string) =>
  page.getByRole("dialog", { name });

const dock = (page: Page) => page.getByRole("navigation", { name: "Dock" });

/**
 * Passes only when a click on the element's centre would reach it, so no
 * other window or menu covers it.
 */
const expectInFront = (locator: Locator) =>
  locator.click({ trial: true, timeout: 3000 });

test.describe("Skills", () => {
  for (const { project, command, skill, app, window } of [
    {
      project: "Side projects showcase",
      command: "/open-projects",
      skill: "open-projects",
      app: "ubuntu-software",
      window: "Software",
    },
    {
      project: "Tech stack overview",
      command: "/open-skills",
      skill: "open-skills",
      app: "files",
      window: "Files",
    },
    {
      project: "Reaching out to Manuel",
      command: "/open-contact",
      skill: "open-contact",
      app: "gmail",
      window: "Gmail",
    },
  ]) {
    test(`the ${command} chip in ${project} shows Skill(${skill}) and launch_app("${app}"), opens the ${window} window in front of Claude Code, and leaves a summary in the Chat`, async ({
      page,
    }) => {
      await page.goto("/");
      await sidebar(page).getByRole("button", { name: project }).click();
      const projectChat = chat(page, project);

      await projectChat.getByRole("button", { name: command }).click();

      await expect(appWindow(page, window)).toBeVisible();
      await expectInFront(appWindow(page, window));
      const reply = projectChat.getByRole("article", { name: "Reply" });
      await expect(reply).toContainText(`Skill(${skill})`);
      await expect(reply).toContainText(`mcp__portfolio__launch_app("${app}")`);
      await expect(reply).toContainText(`Opened ${window}`);
    });
  }

  test("/open-skills shows all 35 skills in one Files grid with no area headings, Claude Code and herdr included, each tile with its own logo and none with the generic Documents icon", async ({
    page,
  }) => {
    await page.goto("/");
    await sidebar(page)
      .getByRole("button", { name: "Tech stack overview" })
      .click();
    await chat(page, "Tech stack overview")
      .getByRole("button", { name: "/open-skills" })
      .click();
    const files = appWindow(page, "Files");
    const tiles = files
      .getByRole("list", { name: "Skills" })
      .getByRole("listitem");

    await expect(tiles).toHaveCount(35);
    await expect(files.getByRole("heading")).toHaveCount(0);
    await expect(tiles.filter({ hasText: /^Claude Code$/ })).toHaveCount(1);
    await expect(tiles.filter({ hasText: /^herdr$/ })).toHaveCount(1);
    const logos = await tiles.evaluateAll((items) =>
      items.map((item) => item.querySelector("svg, img")?.innerHTML ?? null),
    );
    expect(logos.filter((logo) => !logo)).toEqual([]);
    expect(new Set(logos).size).toBe(logos.length);
    const documentsIcon = await files
      .getByText("Documents", { exact: true })
      .locator("xpath=..")
      .locator("svg")
      .innerHTML();
    expect(logos).not.toContain(documentsIcon);
  });

  test("the Welcome intro links to the projects, skills and contact Claude projects, and each link opens that Claude project's Chat", async ({
    page,
  }) => {
    await page.goto("/");

    for (const { id, title } of [
      { id: "projects", title: "Side projects showcase" },
      { id: "skills", title: "Tech stack overview" },
      { id: "contact", title: "Reaching out to Manuel" },
    ]) {
      await chat(page, "Getting started with Manuel's portfolio")
        .getByRole("button", { name: id, exact: true })
        .click();
      await expect(chat(page, title)).toBeVisible();
      await expect(
        sidebar(page).getByRole("button", { name: title }),
      ).toHaveAttribute("aria-current", "page");
      await sidebar(page)
        .getByRole("button", {
          name: "Getting started with Manuel's portfolio",
        })
        .click();
    }
  });

  test("the /open-contact chip next to /download-cv in the Welcome Chat opens the Gmail window", async ({
    page,
  }) => {
    await page.goto("/");
    const welcome = chat(page, "Getting started with Manuel's portfolio");
    await expect(
      welcome.getByRole("button", { name: "/download-cv" }),
    ).toBeVisible();

    await welcome.getByRole("button", { name: "/open-contact" }).click();

    await expect(appWindow(page, "Gmail")).toBeVisible();
    await expectInFront(appWindow(page, "Gmail"));
  });

  test("running /open-projects again brings the already open Software window back in front of Claude Code", async ({
    page,
  }) => {
    await page.goto("/");
    await sidebar(page)
      .getByRole("button", { name: "Side projects showcase" })
      .click();
    const projects = chat(page, "Side projects showcase");
    const chip = projects.getByRole("button", { name: "/open-projects" });
    await chip.click();
    await expect(appWindow(page, "Software")).toBeVisible();
    await expect(projects).toContainText("Opened Software");

    await dock(page).getByRole("button", { name: "Claude Code" }).click();
    await expectInFront(chip);
    await chip.click();

    await expect(projects.getByRole("article", { name: "Reply" })).toHaveCount(
      2,
    );
    await expect(
      projects.getByRole("article", { name: "Reply" }).last(),
    ).toContainText("Opened Software");
    await expectInFront(appWindow(page, "Software"));
  });
});

test.describe("dock", () => {
  for (const { button, window } of [
    { button: "My Projects", window: "Software" },
    { button: "My Skills", window: "Files" },
    { button: "Contact Me", window: "Gmail" },
  ]) {
    test(`the ${button} dock button opens the ${window} window in front of Claude Code`, async ({
      page,
    }) => {
      await page.goto("/");

      await dock(page).getByRole("button", { name: button }).click();

      await expect(appWindow(page, window)).toBeVisible();
      await expectInFront(appWindow(page, window));
    });
  }

  test("clicking Gmail in the dock again brings it in front of the Files window opened after it", async ({
    page,
  }) => {
    await page.goto("/");
    await dock(page).getByRole("button", { name: "Contact Me" }).click();
    await dock(page).getByRole("button", { name: "My Skills" }).click();
    await expectInFront(appWindow(page, "Files"));

    await dock(page).getByRole("button", { name: "Contact Me" }).click();

    await expectInFront(appWindow(page, "Gmail"));
  });

  test("closing an App window hides it and reopening it from the dock shows it again", async ({
    page,
  }) => {
    await page.goto("/");
    await dock(page).getByRole("button", { name: "My Projects" }).click();

    await appWindow(page, "Software")
      .getByRole("button", { name: "Close Software" })
      .click();
    await expect(appWindow(page, "Software")).toBeHidden();
    await dock(page).getByRole("button", { name: "My Projects" }).click();

    await expect(appWindow(page, "Software")).toBeVisible();
  });
});

/** Presses Tab until the element has focus, as a keyboard user would. */
const tabTo = async (page: Page, target: Locator) => {
  for (let presses = 0; presses < 80; presses++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error("Tab never reached the element");
};

test.describe("close buttons", () => {
  for (const { dockButton, window } of [
    { dockButton: null, window: "Claude Code" },
    { dockButton: "My Projects", window: "Software" },
    { dockButton: "My Skills", window: "Files" },
    { dockButton: "Contact Me", window: "Gmail" },
  ]) {
    test(`the ${window} window's close button is named "Close ${window}" and shows an outline at least 2px wide when reached with Tab`, async ({
      page,
    }) => {
      await page.goto("/");
      if (dockButton) {
        await dock(page).getByRole("button", { name: dockButton }).click();
      }
      const close = appWindow(page, window).getByRole("button", {
        name: `Close ${window}`,
        exact: true,
      });

      await tabTo(page, close);

      const outline = await close.evaluate((el) => {
        const style = getComputedStyle(el);
        return { style: style.outlineStyle, width: style.outlineWidth };
      });
      expect(outline.style).not.toBe("none");
      expect(parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
    });
  }
});

test.describe("Top bar", () => {
  test.use({ viewport: { width: 1024, height: 768 } });

  test("the Socials menu opens in front of the App windows it overlaps", async ({
    page,
  }) => {
    await page.goto("/");
    await dock(page).getByRole("button", { name: "Contact Me" }).click();
    await expect(appWindow(page, "Gmail")).toBeVisible();

    await page.getByText("Socials", { exact: true }).click();

    for (const name of ["LinkedIn", "GitHub", "Download Curriculum"]) {
      await expectInFront(page.getByRole("link", { name }));
    }
  });
});

test.describe("lazy loading", () => {
  const windowChunk =
    /\/(UbuntuSoftwareWindow|FileManagerWindow|GmailWindow)-[^/]*\.js$/;

  test("the initial page load requests no App window code and no EmailJS code, which load once the windows open and a message is sent", async ({
    page,
  }) => {
    const scripts: { url: string; body: Promise<string> }[] = [];
    page.on("response", (response) => {
      if (response.request().resourceType() === "script") {
        scripts.push({ url: response.url(), body: response.text() });
      }
    });
    await page.route("https://api.emailjs.com/**", (route) =>
      route.fulfill({ status: 200, body: "OK" }),
    );

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(
      chat(page, "Getting started with Manuel's portfolio"),
    ).toBeVisible();
    const initial = [...scripts];
    const initialBodies = await Promise.all(initial.map((s) => s.body));

    expect(initial.length).toBeGreaterThan(0);
    expect(initial.filter((s) => windowChunk.test(s.url))).toEqual([]);
    expect(
      initial
        .filter((_, index) => initialBodies[index].includes("api.emailjs.com"))
        .map((s) => s.url),
    ).toEqual([]);

    await dock(page).getByRole("button", { name: "My Projects" }).click();
    await dock(page).getByRole("button", { name: "My Skills" }).click();
    await dock(page).getByRole("button", { name: "Contact Me" }).click();
    const gmail = appWindow(page, "Gmail");
    await gmail
      .getByRole("textbox", { name: "Your email" })
      .fill("recruiter@example.com");
    await gmail.getByRole("textbox", { name: "Message" }).fill("Hello");
    await gmail.getByRole("button", { name: "Send" }).click();
    await expect(gmail.getByRole("status")).toContainText("Message sent");

    const loaded = scripts.map((s) => s.url.match(windowChunk)?.[1]);
    expect(loaded).toEqual(
      expect.arrayContaining([
        "UbuntuSoftwareWindow",
        "FileManagerWindow",
        "GmailWindow",
      ]),
    );
    const allBodies = await Promise.all(scripts.map((s) => s.body));
    expect(allBodies.some((body) => body.includes("api.emailjs.com"))).toBe(
      true,
    );
  });
});

test.describe("contact form", () => {
  const sends: string[] = [];

  test.beforeEach(async ({ page }) => {
    sends.length = 0;
    await page.goto("/");
    await dock(page).getByRole("button", { name: "Contact Me" }).click();
  });

  const routeEmailJs = (page: Page, status: number) =>
    page.route("https://api.emailjs.com/**", (route) => {
      sends.push(route.request().postData() ?? "");
      return route.fulfill({ status, body: status === 200 ? "OK" : "Bad" });
    });

  const fill = async (page: Page, email: string, message: string) => {
    const gmail = appWindow(page, "Gmail");
    await gmail.getByRole("textbox", { name: "Your email" }).fill(email);
    await gmail.getByRole("textbox", { name: "Message" }).fill(message);
    await gmail.getByRole("button", { name: "Send" }).click();
  };

  test("an invalid email address focuses the email field, marks it aria-invalid and describes it with the error, and nothing is sent", async ({
    page,
  }) => {
    await routeEmailJs(page, 200);
    const email = appWindow(page, "Gmail").getByRole("textbox", {
      name: "Your email",
    });

    await fill(page, "not-an-email", "Hello Manuel");

    await expect(email).toBeFocused();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAccessibleDescription(
      "Enter a valid email address, like name@example.com.",
    );
    expect(sends).toEqual([]);
  });

  test("an empty message focuses the message field, marks it aria-invalid and describes it with the error, and nothing is sent", async ({
    page,
  }) => {
    await routeEmailJs(page, 200);
    const gmail = appWindow(page, "Gmail");
    const message = gmail.getByRole("textbox", { name: "Message" });

    await fill(page, "recruiter@example.com", "   ");

    await expect(message).toBeFocused();
    await expect(message).toHaveAttribute("aria-invalid", "true");
    await expect(message).toHaveAccessibleDescription(
      "Write a message before sending.",
    );
    await expect(
      gmail.getByRole("textbox", { name: "Your email" }),
    ).not.toHaveAttribute("aria-invalid", "true");
    expect(sends).toEqual([]);
  });

  test("a valid email and message are sent to EmailJS and the form reports success", async ({
    page,
  }) => {
    await routeEmailJs(page, 200);

    await fill(page, "Recruiter@Example.com", "Let's talk about a role.");

    await expect(appWindow(page, "Gmail").getByRole("status")).toHaveText(
      "Message sent. Manuel will reply to your email.",
    );
    expect(sends).toHaveLength(1);
    expect(JSON.parse(sends[0]).template_params).toEqual({
      from_email: "Recruiter@Example.com",
      message: "Let's talk about a role.",
    });
  });

  test("after a successful send the message field is empty and the email field keeps the address", async ({
    page,
  }) => {
    await routeEmailJs(page, 200);
    const gmail = appWindow(page, "Gmail");

    await fill(page, "recruiter@example.com", "Let's talk about a role.");

    await expect(gmail.getByRole("status")).toHaveText(
      "Message sent. Manuel will reply to your email.",
    );
    await expect(gmail.getByRole("textbox", { name: "Message" })).toHaveValue(
      "",
    );
    await expect(
      gmail.getByRole("textbox", { name: "Your email" }),
    ).toHaveValue("recruiter@example.com");
  });

  test("a failed EmailJS request makes the form report failure", async ({
    page,
  }) => {
    await routeEmailJs(page, 400);

    await fill(page, "recruiter@example.com", "Let's talk about a role.");

    await expect(appWindow(page, "Gmail").getByRole("alert")).toHaveText(
      "Your message couldn't be sent. Try again, or email manumaxerapro@gmail.com.",
    );
    expect(sends).toHaveLength(1);
  });

  test("the Gmail window shows visible Your email and Message labels and a mailto link to Manuel's address", async ({
    page,
  }) => {
    const gmail = appWindow(page, "Gmail");

    await expect(gmail.getByText("Your email", { exact: true })).toBeVisible();
    await expect(gmail.getByText("Message", { exact: true })).toBeVisible();
    await expect(
      gmail.getByRole("link", { name: "Email manumaxerapro@gmail.com" }),
    ).toHaveAttribute("href", "mailto:manumaxerapro@gmail.com");
  });

  test("the form shows the privacy note with a link to /privacy", async ({
    page,
  }) => {
    const gmail = appWindow(page, "Gmail");

    await expect(gmail).toContainText("Your email is only used to reply.");
    await expect(
      gmail.getByRole("link", { name: "Privacy policy" }),
    ).toHaveAttribute("href", "/privacy");
  });
});
