import type { AppWindowId } from "@/content/portfolio";
import { ClaudeCodeIcon, MenuIcon } from "@/icons";
import { appWindowIds, appWindows } from "./appWindows";

interface ApplicationsMenuProps {
  openWindow: (id: "claude-code" | AppWindowId) => void;
}

const applications = [
  {
    id: "claude-code" as const,
    dock: { label: "Claude Code", icon: ClaudeCodeIcon },
  },
  ...appWindowIds.map((id) => ({ id, dock: appWindows[id].dock })),
];

export const ApplicationsMenu = ({ openWindow }: ApplicationsMenuProps) => {
  return (
    <nav
      aria-label="Dock"
      className="bg-ubuntu-dock/90 h-screen w-24 opacity-65 absolute z-1 flex flex-col py-4"
    >
      <ul className="flex flex-col items-center grow-[0.90]">
        {applications.map(({ id, dock }) => (
          <li key={id} className="mb-2">
            <button
              aria-label={dock.label}
              className="block rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer"
              onClick={() => openWindow(id)}
            >
              {"icon" in dock ? (
                <dock.icon aria-hidden="true" className="w-14 h-14" />
              ) : (
                <img src={dock.imgSrc} alt="" className="w-14 h-14" />
              )}
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap select-none">
                {dock.label}
              </div>
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-center">
        <MenuIcon aria-hidden="true" className="white-icon w-14 h-14" />
      </div>
    </nav>
  );
};
