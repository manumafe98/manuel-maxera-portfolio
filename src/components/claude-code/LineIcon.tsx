/** Small stroked UI icons used inside Claude Code. */
const lineIcons = {
  plus: "M12 5v14M5 12h14",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  artifacts: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  customize: "M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4",
  chevron: "M9 6l6 6-6 6",
  folder:
    "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  down: "M6 9l6 6 6-6",
  up: "M12 19V5M5 12l7-7 7 7",
  file: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  menu: "M4 7h16M4 12h16M4 17h16",
  chat: "M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
};

export const LineIcon = ({ name }: { name: keyof typeof lineIcons }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={lineIcons[name]} />
  </svg>
);
