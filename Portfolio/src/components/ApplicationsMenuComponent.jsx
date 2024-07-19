import { GmailIcon, MenuIcon, SublimeTextIcon, TerminalIcon, UbuntuSoftwareIcon, VisualStudioCodeIcon } from "../constants/Icons"

export const ApplicationsMenuComponent = ({ openIconDialog }) => {

  const handleAppIconClick = (event) => {
    openIconDialog(event.currentTarget.dataset.value)
  }

  return (
    <div className="bg-ubuntu-dock/90 h-screen w-24 opacity-65 absolute z-1 border-1 border-solid border-[#464646] flex flex-col py-4">
      <ul className="flex flex-col items-center grow-[0.90]">
        <li className="mb-2 rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer" onClick={handleAppIconClick} data-value="Terminal">
          <TerminalIcon className="fill-current text-gray-700 w-14 h-14"/>
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Terminal
          </div>
        </li>
        <li className="mb-2 rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer" onClick={handleAppIconClick} data-value="Sublime">
          <SublimeTextIcon className="w-14 h-14"/>
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            About Me
          </div>
        </li>
        <li className="mb-2 rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer" onClick={handleAppIconClick} data-value="VsCode">
          <VisualStudioCodeIcon className="w-14 h-14"/>
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Working Experience
          </div>
        </li>
        <li className="mb-2 rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer" onClick={handleAppIconClick} data-value="Gmail">
          <GmailIcon className="w-14 h-14"/>
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Contact Me
          </div>
        </li>
        <li className="mb-2 rounded-xl p-3 hover:bg-gray-50/10 relative group cursor-pointer" onClick={handleAppIconClick} data-value="Ubuntu Software">
          <UbuntuSoftwareIcon className="fill-current text-gray-700 w-14 h-14"/>
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            My Projects
          </div>
        </li>
      </ul>
      <div className="flex justify-center">
        <MenuIcon className="fill-current text-white w-14 h-14"/>
      </div>
    </div>
  )
}
