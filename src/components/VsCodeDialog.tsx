import { editorOptions } from "@/constants/editorOptions";
import { experience } from "@/content/portfolio";
import {
  FilesIcon,
  UnfilledArrowDownIcon,
  VisualStudioCodeIcon,
  XMarkIcon,
  YamlIcon,
} from "@/icons";
import { DialogProps } from "@/types/dialog.types";
import { forwardRef, Fragment } from "react";
import { CloseDialog } from "./CloseDialog";

const toYamlKey = (title: string) => title.toLowerCase().replace(/\s+/g, "_");

export const VsCodeDialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ onClose }, ref) => {
    const closeVsCodeDialog = () => {
      onClose(ref, "vscode");
    };

    return (
      <dialog
        ref={ref}
        className="dialog-container min-h-[80vh] min-w-[50vw] max-2xl:max-w-[80vw]"
      >
        <div className="flex items-center justify-between w-full h-10 bg-ubuntu-navbar rounded-t-xl border-b border-solid border-black">
          <div className="flex items-center w-6 h-6 mx-3">
            <VisualStudioCodeIcon className="w-5 h-5" />
          </div>
          <span className="text-white font-bold">
            professional_experience.yaml - Experience - Visual Studio Code
          </span>
          <CloseDialog
            closeDialog={closeVsCodeDialog}
            buttonExtraStyles="mx-3 bg-gray-50/20 hover:bg-gray-50/15"
            svgCustomStyle={undefined}
          />
        </div>
        <div className="w-full h-8 bg-ubuntu-options">
          <ul className="flex items-center gap-4 mx-2">
            {editorOptions.map((editorOption, index) => (
              <li key={index} className="text-white">
                {editorOption}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex w-full">
          <div className="flex h-[75.1vh] w-3/12 bg-ubuntu-vscode-explorer rounded-bl-lg border-b border-solid border-black">
            <div className="w-2/12 m-1 p-1">
              <FilesIcon className="white-icon w-10 h-10" />
            </div>
            <div className="w-10/12">
              <div className="flex items-center justify-between m-1 p-1">
                <span className="text-gray-400 text-sm ml-3">Explorer</span>
                <span className="text-gray-400 text-sm">. . .</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span>
                  <UnfilledArrowDownIcon className="fill-current text-gray-400 w-4 h-4" />
                </span>
                <span className="text-gray-400 font-bold text-sm">
                  Experience
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-gray-400/30 p-1 mt-1">
                <YamlIcon className="w-5 h-5" />
                <span className="text-sm text-white">
                  professional_experience.yaml
                </span>
              </div>
            </div>
          </div>
          <div className="w-9/12 bg-ubuntu-vscode-experience-bg rounded-br-lg">
            <div className="w-full h-12 bg-ubuntu-vscode-explorer">
              <div className="w-5/12 bg-ubuntu-vscode-experience-bg">
                <div className="flex items-center justify-center gap-2 bg-gray-400/30 h-12 p-1 border-b border-solid border-b-white border-x-black">
                  <YamlIcon className="w-5 h-5" />
                  <span className="text-sm text-white">
                    professional_experience.yaml
                  </span>
                  <XMarkIcon className="white-icon w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="h-[70vh] max-w-full w-[calc(95vh)] overflow-x-auto scrollbar hover:scrollbar-thumb-gray-50/10 whitespace-pre text-left font-mono text-sm leading-relaxed p-1">
              <span className="text-red-500">professional_experience</span>
              <span className="text-white">:</span>
              <br />
              {experience.map((entry, index) => (
                <Fragment key={index}>
                  &nbsp;&nbsp;
                  <span className="text-red-500">{toYamlKey(entry.title)}</span>
                  <span className="text-white">:</span>
                  <br />
                  {(
                    [
                      ["company", entry.company],
                      ["dates", `${entry.start} - ${entry.end}`],
                      ["location", entry.location],
                    ] as const
                  ).map(([key, value]) => (
                    <Fragment key={key}>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span className="text-red-500">{key}</span>
                      <span className="text-white">: </span>
                      <span className="text-green-500">{value}</span>
                      <br />
                    </Fragment>
                  ))}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="text-red-500">achievements</span>
                  <span className="text-white">:</span>
                  <br />
                  {entry.achievements.map((achievement, achievementIndex) => (
                    <Fragment key={achievementIndex}>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span className="text-green-500">- {achievement}</span>
                      <br />
                    </Fragment>
                  ))}
                  <br />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </dialog>
    );
  },
);
