import type { ConfigEnv } from "vite";
import { afterEach, describe, expect, test, vi } from "vitest";
import viteConfig from "./vite.config";

const resolve = (env: ConfigEnv) => viteConfig(env);

const clientBuild: ConfigEnv = { command: "build", mode: "production" };

const setEmailJs = (values: Record<string, string>) => {
  for (const [name, value] of Object.entries(values)) vi.stubEnv(name, value);
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("the EmailJS settings check in the Vite config", () => {
  test("a client build with no EMAILJS_* variables throws, naming all three", () => {
    setEmailJs({
      EMAILJS_SERVICE_ID: "",
      EMAILJS_TEMPLATE_ID: "",
      EMAILJS_USER_PUBLIC_KEY: "",
    });

    expect(() => resolve(clientBuild)).toThrow(
      "Missing EmailJS settings: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_PUBLIC_KEY.",
    );
  });

  test("a client build missing only EMAILJS_TEMPLATE_ID throws, naming only that one", () => {
    setEmailJs({
      EMAILJS_SERVICE_ID: "service_x",
      EMAILJS_TEMPLATE_ID: "",
      EMAILJS_USER_PUBLIC_KEY: "key_x",
    });

    expect(() => resolve(clientBuild)).toThrow(
      /^Missing EmailJS settings: EMAILJS_TEMPLATE_ID\./,
    );
  });

  test("a client build with all three EMAILJS_* variables set builds them into the contact form code", () => {
    setEmailJs({
      EMAILJS_SERVICE_ID: "service_x",
      EMAILJS_TEMPLATE_ID: "template_x",
      EMAILJS_USER_PUBLIC_KEY: "key_x",
    });

    expect(resolve(clientBuild).define).toEqual({
      "import.meta.env.EMAILJS_SERVICE_ID": '"service_x"',
      "import.meta.env.EMAILJS_TEMPLATE_ID": '"template_x"',
      "import.meta.env.EMAILJS_USER_PUBLIC_KEY": '"key_x"',
    });
  });

  test("the SSR build and the dev server start without the EMAILJS_* variables", () => {
    setEmailJs({
      EMAILJS_SERVICE_ID: "",
      EMAILJS_TEMPLATE_ID: "",
      EMAILJS_USER_PUBLIC_KEY: "",
    });

    expect(() => resolve({ ...clientBuild, isSsrBuild: true })).not.toThrow();
    expect(() =>
      resolve({ command: "serve", mode: "development" }),
    ).not.toThrow();
  });
});
