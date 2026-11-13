import { expect, test, type Locator, type Page } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "desktop-only behaviour");

const claudeCode = (page: Page) =>
  page.getByRole("dialog", { name: "Claude Code" });

const chat = (page: Page, displayName: string) =>
  claudeCode(page).getByRole("region", { name: displayName });

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
      project: "Projects",
      command: "/open-projects",
      skill: "open-projects",
      app: "ubuntu-software",
      window: "Software",
    },
    {
      project: "Skills",
      command: "/open-skills",
      skill: "open-skills",
      app: "files",
      window: "Files",
    },
    {
      project: "Contact",
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

  test("the sidebar lists Projects, Skills and Contact, and the Welcome intro links to each", async ({
    page,
  }) => {
    await page.goto("/");

    for (const name of ["Projects", "Skills", "Contact"]) {
      await chat(page, "Welcome")
        .getByRole("button", { name, exact: true })
        .click();
      await expect(chat(page, name)).toBeVisible();
      await expect(sidebar(page).getByRole("button", { name })).toHaveAttribute(
        "aria-current",
        "page",
      );
      await sidebar(page).getByRole("button", { name: "Welcome" }).click();
    }
  });

  test("the /open-contact chip next to /download-cv in the Welcome Chat opens the Gmail window", async ({
    page,
  }) => {
    await page.goto("/");
    const welcome = chat(page, "Welcome");
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
    await sidebar(page).getByRole("button", { name: "Projects" }).click();
    const projects = chat(page, "Projects");
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
      .getByRole("button", { name: "Close" })
      .click();
    await expect(appWindow(page, "Software")).toBeHidden();
    await dock(page).getByRole("button", { name: "My Projects" }).click();

    await expect(appWindow(page, "Software")).toBeVisible();
  });
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
    /\/(UbuntuSoftwareDialog|FileManagerDialog|GmailDialog)-[^/]*\.js$/;

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
    await expect(chat(page, "Welcome")).toBeVisible();
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
        "UbuntuSoftwareDialog",
        "FileManagerDialog",
        "GmailDialog",
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

  test("an invalid email address is rejected with a clear message and nothing is sent", async ({
    page,
  }) => {
    await routeEmailJs(page, 200);

    await fill(page, "not-an-email", "Hello Manuel");

    await expect(appWindow(page, "Gmail").getByRole("alert")).toHaveText(
      "Enter a valid email address, like name@example.com.",
    );
    expect(sends).toEqual([]);
  });

  test("an empty message is rejected with a clear message and nothing is sent", async ({
    page,
  }) => {
    await routeEmailJs(page, 200);

    await fill(page, "recruiter@example.com", "   ");

    await expect(appWindow(page, "Gmail").getByRole("alert")).toHaveText(
      "Write a message before sending.",
    );
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
