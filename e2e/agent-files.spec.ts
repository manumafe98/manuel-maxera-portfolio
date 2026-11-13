import { expect, test } from "@playwright/test";

const SITE_URL = "https://manuel-maxera.netlify.app/";

test("/robots.txt is plain text that allows every crawler and points at the sitemap", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^text\/plain/);
  const body = await response.text();
  expect(body).toMatch(/^User-agent: \*$/m);
  expect(body).toMatch(/^Allow: \/$/m);
  expect(body).toMatch(
    /^Sitemap: https:\/\/manuel-maxera\.netlify\.app\/sitemap\.xml$/m,
  );
});

test("/sitemap.xml is XML listing the absolute URLs of / and /privacy", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/xml/);
  const locations = [
    ...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g),
  ].map((match) => match[1]);
  expect(locations).toEqual([SITE_URL, `${SITE_URL}privacy`]);
});

test("/llms.txt is markdown in llms.txt form with Manuel's name, current role, every Project and his contact links", async ({
  request,
}) => {
  const response = await request.get("/llms.txt");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^text\/plain/);
  const body = await response.text();
  expect(body.split("\n")[0]).toBe("# Manuel Maxera");
  expect(body).toMatch(
    /^> AI Engineer at Avature building production LLM agents/m,
  );
  expect(body).toMatch(/^### AI Engineer at Avature$/m);
  expect(body).toContain("September 2025 to Present");
  for (const project of [
    "Trading Strategy Tester",
    "HoytsX",
    "Pokemon Voting",
    "Exercism",
    "Vbnb",
  ]) {
    expect(body).toMatch(new RegExp(`^### ${project}$`, "m"));
  }
  expect(body).toContain("(https://github.com/manumafe98/HoytsX)");
  expect(body).toContain("(https://www.linkedin.com/in/manuel-maxera/)");
  expect(body).toContain("manumaxerapro@gmail.com");
  expect(body).toContain(
    "(https://manuel-maxera.netlify.app/files/Manuel_Maxera_Resume.pdf)",
  );
});

test("/site.webmanifest is a web manifest naming Manuel, with standalone display, dark colours and PNG icons that load", async ({
  request,
}) => {
  const response = await request.get("/site.webmanifest");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(
    /^application\/manifest\+json/,
  );
  const manifest = await response.json();
  expect(manifest).toMatchObject({
    name: "Manuel Maxera | AI Engineer",
    short_name: "Manuel Maxera",
    display: "standalone",
    background_color: "#1f1e1d",
    theme_color: "#1f1e1d",
  });
  const sizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes);
  expect(sizes).toEqual(expect.arrayContaining(["192x192", "512x512"]));
  for (const icon of manifest.icons) {
    const image = await request.get(icon.src);
    expect(image.status(), icon.src).toBe(200);
    expect(image.headers()["content-type"], icon.src).toBe(icon.type);
  }
});

for (const path of ["/", "/privacy", "/some/deep/unknown/path"]) {
  test(`${path} links the ICO, SVG and apple-touch favicons and the web manifest, and each loads`, async ({
    page,
    request,
  }) => {
    await page.goto(path);
    const href = (selector: string) =>
      page.locator(selector).first().getAttribute("href");

    const links = {
      ico: await href('link[rel="icon"][sizes="32x32"]'),
      svg: await href('link[rel="icon"][type="image/svg+xml"]'),
      appleTouch: await href('link[rel="apple-touch-icon"]'),
      manifest: await href('link[rel="manifest"]'),
    };
    expect(links).toEqual({
      ico: "/favicon.ico",
      svg: "/favicon.svg",
      appleTouch: "/apple-touch-icon.png",
      manifest: "/site.webmanifest",
    });
    for (const link of Object.values(links)) {
      const response = await request.get(new URL(link!, page.url()).href);
      expect(response.status(), link!).toBe(200);
    }
  });
}
