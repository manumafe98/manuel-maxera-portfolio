import { expect, test, type Page } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "desktop-only behaviour");
test.use({ timezoneId: "UTC" });

test("the Top bar clock shows the lower-case month, the day and the 24-hour time, and turns to the next minute within 15 seconds", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-09-03T17:45:50Z") });
  await page.goto("/");

  await expect(page.getByText("sep 03 17:45", { exact: true })).toBeVisible();

  await page.clock.runFor(15_000);

  await expect(page.getByText("sep 03 17:46", { exact: true })).toBeVisible();
});

test("one click on the Top bar clock opens the calendar and a second click closes it", async ({
  page,
}) => {
  await page.goto("/");
  const clock = page.getByText(/^[a-z]{3} \d{2} \d{2}:\d{2}$/);
  const calendar = page.locator("calendar-date");

  await clock.click();
  await expect(calendar).toBeVisible();

  await clock.click();
  await expect(calendar).toHaveCount(0);
});

const clockButton = (page: Page) =>
  page.getByRole("button", { name: /^[a-z]{3} \d{2} \d{2}:\d{2}$/ });

const socialsButton = (page: Page) =>
  page.getByRole("button", { name: "Socials" });

test("the Top bar clock is a button: Enter opens the calendar with aria-expanded true and Space closes it with aria-expanded false", async ({
  page,
}) => {
  await page.goto("/");
  const calendar = page.locator("calendar-date");
  await expect(clockButton(page)).toHaveAttribute("aria-expanded", "false");

  await clockButton(page).focus();
  await page.keyboard.press("Enter");

  await expect(calendar).toBeVisible();
  await expect(clockButton(page)).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Space");

  await expect(calendar).toHaveCount(0);
  await expect(clockButton(page)).toHaveAttribute("aria-expanded", "false");
});

test("Enter on the Socials button opens its links with aria-expanded true, and Escape closes them and keeps focus on the button", async ({
  page,
}) => {
  await page.goto("/");
  const linkedIn = page.getByRole("link", { name: "LinkedIn" });
  await expect(socialsButton(page)).toHaveAttribute("aria-expanded", "false");

  await socialsButton(page).focus();
  await page.keyboard.press("Enter");

  await expect(linkedIn).toBeVisible();
  await expect(socialsButton(page)).toHaveAttribute("aria-expanded", "true");

  await linkedIn.focus();
  await page.keyboard.press("Escape");

  await expect(linkedIn).toHaveCount(0);
  await expect(socialsButton(page)).toHaveAttribute("aria-expanded", "false");
  await expect(socialsButton(page)).toBeFocused();
});

test("Space on the Socials button opens its links, and a click outside the menu closes them", async ({
  page,
}) => {
  await page.goto("/");
  const linkedIn = page.getByRole("link", { name: "LinkedIn" });

  await socialsButton(page).focus();
  await page.keyboard.press("Space");
  await expect(linkedIn).toBeVisible();

  await page.mouse.click(700, 500);

  await expect(linkedIn).toHaveCount(0);
  await expect(socialsButton(page)).toHaveAttribute("aria-expanded", "false");
});
