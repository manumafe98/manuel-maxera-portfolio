import { editorOptions } from "@/constants/editorOptions";
import { LeftArrowIcon, RightArrowIcon, SublimeTextIcon } from "@/icons";
import { DialogProps } from "@/types/dialog.types";
import { forwardRef } from "react";
import { CloseDialog } from "./CloseDialog";

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
              <br />
              Versatile IT professional turned full-stack software engineer with
              a strong foundation in infrastructure, automation, and cloud
              technologies—now specializing in smart contract and blockchain
              development.
              <br />
              Experienced in building and maintaining production-grade
              applications across PHP, Java, and TypeScript, including a browser
              extension, web crawlers, and a core backend system.
              <br />
              Passionate about Web3 and decentralized applications, I’ve
              developed and deployed fullstack dApps on Ethereum using Solidity,
              Hardhat, Foundry, and Ethers.js.
              <br />
              Comfortable working across the stack—from writing smart contracts
              to building performant frontends using React, Tailwind CSS, and
              Vite.
            </span>
          </div>
        </div>
      </dialog>
    );
  },
);
