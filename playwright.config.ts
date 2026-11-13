import { defineConfig, devices } from "@playwright/test";

const port = 4317;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "phone",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    // Placeholder EmailJS settings so the contact form sends a request,
    // which the tests intercept with page.route. No real email is sent.
    env: {
      EMAILJS_SERVICE_ID: "service_e2e",
      EMAILJS_TEMPLATE_ID: "template_e2e",
      EMAILJS_USER_PUBLIC_KEY: "public_key_e2e",
    },
    timeout: 120_000,
  },
});
