import { editorOptions } from "@/constants/editorOptions";
import { profile } from "@/content/portfolio";
import { LeftArrowIcon, RightArrowIcon, SublimeTextIcon } from "@/icons";
import { DialogProps } from "@/types/dialog.types";
import { forwardRef, Fragment } from "react";
import { CloseDialog } from "./CloseDialog";

const summaryLines = profile.summary.split(/(?<=\.) /);

export const SublimeDialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ onClose }, ref) => {
    const closeSublimeDialog = () => {
      onClose(ref, "sublime");
    };

    return (
      <dialog
        ref={ref}
        className="dialog-container min-h-[50vh] min-w-[50vw] max-2xl:max-w-[60vw] max-xl:max-w-[80vw] bg-ubuntu-sublime-bg overflow-hidden"
      >
        <div className="flex items-center justify-between w-full h-10 bg-ubuntu-navbar border-b border-solid border-black">
          <div className="flex items-center w-6 h-6 mx-3">
            <SublimeTextIcon className="w-5 h-5" />
          </div>
          <span className="text-white font-bold">Sublime</span>
          <CloseDialog
            closeDialog={closeSublimeDialog}
            buttonExtraStyles="mx-3 bg-ubuntu-orange hover:bg-ubuntu-orange/80"
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
        <div className="w-full h-8 bg-gray-600 flex items-center">
          <LeftArrowIcon className="white-icon w-6 h-6" />
          <RightArrowIcon className="white-icon w-6 h-6" />
          <div className="flex items-center w-36 h-8 bg-ubuntu-sublime-bg rounded-lg mt-1">
            <span className="text-sm text-white mx-2">About_me.md</span>
          </div>
        </div>
        <div className="h-[39vh] scrollbar-thin scrollbar-thumb-gray-50/15 scrollbar-track-transparent overflow-x-auto">
          <div className="mx-5 mt-4 w-[calc(100vh)]">
            <span className="text-sm text-white font-sublime whitespace-nowrap">
              ## About Me
              {summaryLines.map((line, index) => (
                <Fragment key={index}>
                  <br />
                  {line}
                </Fragment>
              ))}
            </span>
          </div>
        </div>
      </dialog>
    );
  },
);
