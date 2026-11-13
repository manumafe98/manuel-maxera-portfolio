import file_manager from "@/assets/file_manager.webp";
import software_store from "@/assets/software_store.webp";
import { ClaudeCodeIcon, GmailIcon, MenuIcon } from "@/icons";

interface ApplicationsMenuProps {
  openWindow: (name: string | undefined) => void;
}

export const ApplicationsMenu = ({ openWindow }: ApplicationsMenuProps) => {
  const handleAppIconClick = (event: React.MouseEvent<HTMLElement>) => {
    openWindow(event.currentTarget.dataset.value);
  };

  const applications = [
    {
      name: "Claude Code",
      dataValue: "claudecode",
      icon: ClaudeCodeIcon,
    },
    {
      name: "Contact Me",
      dataValue: "gmail",
      icon: GmailIcon,
    },
    {
      name: "My Projects",
      dataValue: "ubuntusoftware",
      imgSrc: software_store,
    },
    {
      name: "My Skills",
      dataValue: "filemanager",
      imgSrc: file_manager,
    },
  ];

  return (
    <nav
      aria-label="Dock"
      className="bg-ubuntu-dock/90 h-screen w-24 opacity-65 absolute z-1 flex flex-col py-4"
    >
      <ul className="flex flex-col items-center grow-[0.90]">
        {applications.map((application, index) => (
          <li key={index} className="mb-2">
            <button
              aria-label={application.name}
              className="block rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer"
              onClick={handleAppIconClick}
              data-value={application.dataValue}
            >
              {application.icon ? (
                <application.icon aria-hidden="true" className="w-14 h-14" />
              ) : (
                <img src={application.imgSrc} alt="" className="w-14 h-14" />
              )}
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap select-none">
                {application.name}
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
