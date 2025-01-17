/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sublime: ["Menlo", "Consolas", "Ubuntu Mono", "monospace"],
      },
      colors: {
        "ubuntu-dock": "#1D1D1D",
        "ubuntu-main": "#6E2047",
        "ubuntu-focus": "#B33F4A",
        "ubuntu-navbar": "#1E1E1E",
        "ubuntu-options": "#2A2929",
        "ubuntu-terminal-bg": "#320E24",
        "ubuntu-terminal-select": "#3965A1",
        "ubuntu-orange": "#F97316",
        "ubuntu-sublime-bg": "#333A41",
        "ubuntu-vscode-explorer": "#24242C",
        "ubuntu-vscode-experience-bg": "#242C34",
        "main-gray": "#E0E0E0",
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
}
