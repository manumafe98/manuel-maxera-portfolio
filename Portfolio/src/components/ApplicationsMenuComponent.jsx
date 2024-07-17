import { GmailIcon, MenuIcon, SublimeTextIcon, TerminalIcon, VisualStudioCodeIcon } from "../constants/Icons"

export const ApplicationsMenuComponent = () => {
  return (
    <div className="bg-ubuntu-dock/90 h-screen w-24 opacity-65 absolute z-1 border-1 border-solid border-[#464646] flex flex-col py-4">
      <ul className="flex flex-col items-center grow-[0.95]">
        <li className="mb-6"><SublimeTextIcon className="w-14 h-14 hover:scale-110"/></li>
        <li className="mb-6"><VisualStudioCodeIcon className="w-14 h-14 hover:scale-110"/></li>
        <li className="mb-6"><GmailIcon className="w-14 h-14 hover:scale-110"/></li>
        <li className="mb-6"><TerminalIcon className="fill-current text-gray-700 w-14 h-14 hover:scale-110"/></li>
      </ul>
      <div className="flex justify-center">
        <MenuIcon className="fill-current text-white w-14 h-14 hover:scale-110"/>
      </div>
    </div>
  )
}
