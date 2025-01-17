import { forwardRef } from "react";
import {
  LeftArrowIcon,
  RightArrowIcon,
  SublimeTextIcon,
  XMarkIcon,
} from "../constants/Icons";
import { editorOptions } from "../constants/editorOptions";

export const SublimeDialogComponent = forwardRef((props, ref) => {
  const { onClose } = props;

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
        <button
          className="flex items-center justify-center w-6 h-6 rounded-full mx-3 bg-ubuntu-orange hover:bg-ubuntu-orange/80"
          onClick={closeSublimeDialog}
        >
          <XMarkIcon className="white-icon w-4 h-4" />
        </button>
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
            <br />
            Versatile IT professional with a progressive career spanning
            helpdesk support, Unix system administration, and cloud engineering,
            now pivoting towards software engineering.
            <br />
            Leveraging a strong foundation in technical problem-solving,
            infrastructure management, and automation to bring a unique
            perspective to software development.
            <br />
            Experienced in optimizing systems, implementing monitoring
            solutions, and driving operational efficiencies, with skills that
            translate directly to creating robust, scalable software solutions.
            <br />
            Passionate about emerging technologies and continuously expanding
            coding skills, eager to contribute a diverse IT background to
            innovative software development projects.
          </span>
        </div>
      </div>
    </dialog>
  );
});
