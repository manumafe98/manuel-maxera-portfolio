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
        "ubuntu-dock": "#1d1d1d",
        "ubuntu-main": "#6E2047",
        "ubuntu-focus": "#B33F4A",
        "main-gray": "#e0e0e0",
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
}

