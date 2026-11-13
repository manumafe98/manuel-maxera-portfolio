import { gridSkills } from "@/content/portfolio";
import {
  DocumentsIcon,
  DownloadsIcon,
  HomeIcon,
  RecentIcon,
  SearchIcon,
  SkillsIcon,
  StarredIcon,
  UnfilledArrowLeftIcon,
  UnfilledArrowRightIcon,
} from "@/icons";
import type { WindowProps } from "@/types/window.types";
import { CloseWindowButton } from "./CloseWindowButton";
import { skillIcons } from "./skillIcons";

export const FileManagerWindow = ({
  open,
  zIndex,
  onClose,
  onFocus,
}: WindowProps) => {
  const fileManagerIcons = [
    {
      name: "Recent",
      icon: RecentIcon,
      iconSize: "w-6 h-6",
      styles: "gap-1",
    },
    {
      name: "Starred",
      icon: StarredIcon,
      iconSize: "w-6 h-6",
      styles: "gap-1",
    },
    {
      name: "Home",
      icon: HomeIcon,
      iconSize: "w-6 h-6",
      styles: "gap-1",
    },
    {
      name: "Documents",
      icon: DocumentsIcon,
      iconSize: "w-5 h-5",
      styles: "gap-2",
    },
    {
      name: "Downloads",
      icon: DownloadsIcon,
      iconSize: "w-5 h-5",
      styles: "gap-2",
    },
    {
      name: "Skills",
      icon: SkillsIcon,
      iconSize: "w-5 h-5",
      styles: "h-8 gap-2 bg-gray-50/20",
    },
  ];

  return (
    <dialog
      open={open}
      style={{ zIndex }}
      onPointerDown={onFocus}
      aria-label="Files"
      className="window-frame min-h-[50vh] min-w-[40vw] max-xl:min-w-[60vw] bg-ubuntu-options"
    >
      <div className="flex items-center justify-between w-full h-10 bg-ubuntu-top-bar border-b border-solid border-black rounded-t-lg">
        <div className="flex gap-2 mx-3">
          <div className="flex">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-50/20 rounded-md opacity-80 border border-solid border-black">
              <UnfilledArrowLeftIcon
                aria-hidden="true"
                className="white-icon w-6 h-6"
              />
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-gray-50/20 rounded-md opacity-30 border border-solid border-black">
              <UnfilledArrowRightIcon
                aria-hidden="true"
                className="white-icon w-6 h-6"
              />
            </div>
          </div>
          <div className="flex items-center justify-start gap-2 w-80 h-8 bg-gray-50/20 rounded-md opacity-80 border border-solid border-black">
            <span>
              <SkillsIcon
                aria-hidden="true"
                className="white-icon ml-2 w-6 h-6"
              />
            </span>
            <span className="text-white text-md font-bold">Skills</span>
          </div>
          <div className="flex items-center justify-center w-8 h-8 bg-gray-50/20 rounded-md opacity-80 border border-solid border-black">
            <SearchIcon aria-hidden="true" className="white-icon w-6 h-6" />
          </div>
        </div>
        <CloseWindowButton
          onClose={onClose}
          className="mx-3 bg-gray-50/20 hover:bg-gray-50/15"
        />
      </div>
      <div className="flex">
        <div className="flex w-1/5 h-[48vh] bg-ubuntu-top-bar opacity-85 border-r border-r-solid border-r-black rounded-b-lg">
          <div className="flex flex-col w-full my-2 gap-y-3">
            {fileManagerIcons.map((icon, index) => (
              <div
                key={index}
                className={`flex items-center px-3 ${icon.styles}`}
              >
                <icon.icon
                  aria-hidden="true"
                  className={`white-icon ${icon.iconSize}`}
                />
                <span className="text-white text-sm">{icon.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 h-[48vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-50/15 scrollbar-track-transparent">
          <ul
            aria-label="Skills"
            className="grid grid-cols-7 gap-y-4 mx-4 my-4"
          >
            {gridSkills.map((skill) => {
              const SkillIcon = skillIcons[skill];
              return (
                <li key={skill} className="flex flex-col items-center">
                  <SkillIcon
                    aria-hidden="true"
                    className={`${skill === "Hardhat" ? "mb-1.5" : "w-12 h-12"} transition-transform duration-300 hover:scale-110`}
                  />
                  <span className="text-white text-md text-center">
                    {skill}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </dialog>
  );
};
