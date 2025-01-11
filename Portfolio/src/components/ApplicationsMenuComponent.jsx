import { GmailIcon, MenuIcon, SublimeTextIcon, VisualStudioCodeIcon } from "../constants/Icons"
import file_manager from "../static/media/file_manager.webp";
import terminal_app from "../static/media/terminal_app.webp";
import software_store from "../static/media/software_store.webp";

export const ApplicationsMenuComponent = ({ openIconDialog }) => {

  const handleAppIconClick = (event) => {
    openIconDialog(event.currentTarget.dataset.value)
  }

  return (
    <div className="bg-ubuntu-dock/90 h-screen w-24 opacity-65 absolute z-1 border-1 border-solid border-[#464646] flex flex-col py-4">
      <ul className="flex flex-col items-center grow-[0.90]">
        <li className="mb-2 rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer" onClick={handleAppIconClick} data-value="terminal">
          <img src={terminal_app} alt="Ubuntu Terminal App Icon" className="w-14 h-14"/>
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap select-none">
            Terminal
          </div>
        </li>
        <li className="mb-2 rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer" onClick={handleAppIconClick} data-value="sublime">
          <SublimeTextIcon className="w-14 h-14"/>
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap select-none">
            About Me
          </div>
        </li>
        <li className="mb-2 rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer" onClick={handleAppIconClick} data-value="vscode">
          <VisualStudioCodeIcon className="w-14 h-14"/>
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap select-none">
            Working Experience
          </div>
        </li>
        <li className="mb-2 rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer" onClick={handleAppIconClick} data-value="gmail">
          <GmailIcon className="w-14 h-14"/>
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap select-none">
            Contact Me
          </div>
        </li>
        <li className="mb-2 rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer" onClick={handleAppIconClick} data-value="ubuntusoftware">
          <img src={software_store} alt="Ubuntu Store App Icon" className="w-14 h-14"/>
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap select-none">
            My Projects
          </div>
        </li>
        <li className="mb-2 rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer" onClick={handleAppIconClick} data-value="filemanager">
          <img src={file_manager} alt="Ubuntu File Manager App Icon" className="w-14 h-14"/>
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap select-none">
            My Skills
          </div>
        </li>
      </ul>
      <div className="flex justify-center">
        <MenuIcon className="fill-current text-white w-14 h-14"/>
      </div>
    </div>
  )
}
