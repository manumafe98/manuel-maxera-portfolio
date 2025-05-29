import {
  AmazonWebServicesIcon,
  DockerIcon,
  DocumentsIcon,
  DownloadsIcon,
  GitIcon,
  GrafanaIcon,
  HardhatIcon,
  HomeIcon,
  JavaIcon,
  JavaScriptIcon,
  LinuxIcon,
  PhpIcon,
  PrometheusIcon,
  PythonIcon,
  ReactIcon,
  RecentIcon,
  SearchIcon,
  SkillsIcon,
  SolidityIcon,
  SpringIcon,
  StarredIcon,
  TailwindCssIcon,
  TypeScriptIcon,
  UnfilledArrowLeftIcon,
  UnfilledArrowRightIcon,
} from "@/icons";
import { DialogProps } from "@/types/dialog.types";
import { forwardRef } from "react";
import { CloseDialog } from "./CloseDialog";

export const FileManagerDialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ onClose }, ref) => {
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

    const skills = [
      {
        name: "Solidity",
        icon: SolidityIcon,
      },
      {
        name: "Hardhat",
        icon: HardhatIcon,
      },
      {
        name: "Java",
        icon: JavaIcon,
      },
      {
        name: "JavaScript",
        icon: JavaScriptIcon,
      },
      {
        name: "Python",
        icon: PythonIcon,
      },
      {
        name: "Spring",
        icon: SpringIcon,
      },
      {
        name: "React",
        icon: ReactIcon,
      },
      {
        name: "Tailwind",
        icon: TailwindCssIcon,
      },
      {
        name: "Grafana",
        icon: GrafanaIcon,
      },
      {
        name: "Docker",
        icon: DockerIcon,
      },
      {
        name: "Linux",
        icon: LinuxIcon,
      },
      {
        name: "AWS",
        icon: AmazonWebServicesIcon,
      },
      {
        name: "TypeScript",
        icon: TypeScriptIcon,
      },
      {
        name: "Git",
        icon: GitIcon,
      },
      {
        name: "Prometheus",
        icon: PrometheusIcon,
      },
      {
        name: "Php",
        icon: PhpIcon,
      },
    ];

    const closeFileManagerDialog = () => {
      onClose(ref, "filemanager");
    };

    return (
      <dialog
        ref={ref}
        className="dialog-container min-h-[50vh] min-w-[40vw] max-xl:min-w-[60vw] bg-ubuntu-options"
      >
        <div className="flex items-center justify-between w-full h-10 bg-ubuntu-navbar border-b border-solid border-black rounded-t-lg">
          <div className="flex gap-2 mx-3">
            <div className="flex">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-50/20 rounded-md opacity-80 border border-solid border-black">
                <UnfilledArrowLeftIcon className="white-icon w-6 h-6" />
              </div>
              <div className="flex items-center justify-center w-8 h-8 bg-gray-50/20 rounded-md opacity-30 border border-solid border-black">
                <UnfilledArrowRightIcon className="white-icon w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center justify-start gap-2 w-80 h-8 bg-gray-50/20 rounded-md opacity-80 border border-solid border-black">
              <span>
                <SkillsIcon className="white-icon ml-2 w-6 h-6" />
              </span>
              <span className="text-white text-md font-bold">Skills</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-gray-50/20 rounded-md opacity-80 border border-solid border-black">
              <SearchIcon className="white-icon w-6 h-6" />
            </div>
          </div>
          <CloseDialog
            closeDialog={closeFileManagerDialog}
            buttonExtraStyles="mx-3 bg-gray-50/20 hover:bg-gray-50/15"
            svgCustomStyle={undefined}
          />
        </div>
        <div className="flex">
          <div className="flex w-1/5 h-[48vh] bg-ubuntu-navbar opacity-85 border-r border-r-solid border-r-black rounded-b-lg">
            <div className="flex flex-col w-full my-2 gap-y-3">
              {fileManagerIcons.map((icon, index) => (
                <div
                  key={index}
                  className={`flex items-center px-3 ${icon.styles}`}
                >
                  <icon.icon className={`white-icon ${icon.iconSize}`} />
                  <span className="text-white text-sm">{icon.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-7 grid-rows-4 mx-4 my-4 gap-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex flex-col items-center">
                <skill.icon
                  className={`${skill.name !== "Hardhat" ? "w-12 h-12" : "mb-1.5"} transition-transform duration-300 hover:scale-110`}
                />
                <span className="text-white text-md">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </dialog>
    );
  },
);
