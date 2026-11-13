import { projects } from "@/content/portfolio";
import { GithubIcon, SearchIcon, WebLinkIcon } from "@/icons";
import { DialogProps } from "@/types/dialog.types";
import { forwardRef } from "react";
import { CloseDialog } from "./CloseDialog";

const initials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("");

export const UbuntuSoftwareDialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ onClose }, ref) => {
    const closeUbuntuSoftwareDialog = () => {
      onClose(ref, "ubuntusoftware");
    };

    return (
      <dialog
        ref={ref}
        className="dialog-container min-h-[50vh] min-w-[40vw] max-xl:min-w-[60vw] bg-ubuntu-options"
      >
        <div className="flex items-center justify-between w-full h-10 bg-ubuntu-navbar rounded-t-lg border-b border-solid border-black">
          <div className="flex items-center justify-center w-6 h-6 mx-3 bg-gray-50/20 rounded-md">
            <SearchIcon className="white-icon w-5 h-5" />
          </div>
          <span className="text-white">Explore</span>
          <CloseDialog
            closeDialog={closeUbuntuSoftwareDialog}
            buttonExtraStyles="mx-3 bg-gray-50/20 hover:bg-gray-50/15"
            svgCustomStyle={undefined}
          />
        </div>
        <div className="flex flex-col items-center justify-center pb-10">
          <span className="text-white text-2xl font-bold my-10">Projects</span>
          <div className="grid grid-cols-2 grid-rows-1 gap-5 w-3/4 h-1/3">
            {projects.map((project, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-ubuntu-navbar border border-solid border-black shadow-md rounded-xl p-4"
              >
                {project.logo ? (
                  <img
                    src={project.logo.src}
                    alt={project.logo.alt}
                    className="w-20 mt-2.5"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex items-center justify-center shrink-0 w-20 h-20 rounded-2xl bg-gray-50/20 text-white text-2xl font-bold"
                  >
                    {initials(project.name)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-white font-bold">{project.name}</span>
                  <span className="text-white text-sm">
                    {project.description}
                  </span>
                  <div className="flex mt-2 gap-2">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} on GitHub`}
                    >
                      <GithubIcon className="project-icon" />
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} website`}
                      >
                        <WebLinkIcon className="project-icon mt-0.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </dialog>
    );
  },
);
