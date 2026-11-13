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
