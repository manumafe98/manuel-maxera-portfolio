import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

// ADR-0002: CSS, not JavaScript, chooses the Desktop or phone layout.
const widthMessage =
  "Don't pick what to render from the window width; CSS chooses the Desktop or phone layout. See docs/adr/0002-css-picks-desktop-or-phone-shell.md.";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-restricted-globals": [
        "error",
        { name: "innerWidth", message: widthMessage },
        { name: "matchMedia", message: widthMessage },
      ],
      "no-restricted-properties": [
        "error",
        { object: "window", property: "innerWidth", message: widthMessage },
        { object: "window", property: "matchMedia", message: widthMessage },
      ],
    },
  },
);
