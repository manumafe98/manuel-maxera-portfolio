import { GithubIcon, SearchIcon, WwwIcon } from "@/icons";
import chelsea_trivia_logo from "@/static/media/chelsea_trivia_logo.webp";
import exercism_logo from "@/static/media/exercism_logo.webp";
import vbnb_logo from "@/static/media/vbnb_logo.webp";
import { DialogProps } from "@/types/dialog.types";
import { forwardRef } from "react";
import { CloseDialog } from "./CloseDialog";

export const UbuntuSoftwareDialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ onClose }, ref) => {
    const projects = [
      {
        name: "Exercism",
        description: "Java Track Maintainer",
        imgSrc: exercism_logo,
        imgAlt: "Exercism Logo",
        githubRepoUrl: "https://github.com/manumafe98/java",
        hasWebPage: false,
      },
      {
        name: "Vbnb",
        description: "Listing App",
        imgSrc: vbnb_logo,
        imgAlt: "Vbnb logo",
        githubRepoUrl: "https://github.com/manumafe98/Vbnb",
        hasWebPage: false,
        webUrl: "https://vbnb.netlify.app/",
      },
      {
        name: "Chelsea Trivia",
        description: "Chelsea Trivia Game",
        imgSrc: chelsea_trivia_logo,
        imgAlt: "Chelsea Trivia Logo",
        githubRepoUrl: "https://github.com/manumafe98/chelsea_trivia_2.0",
        hasWebPage: false,
      },
    ];

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
        <div className="flex flex-col items-center justify-center">
          <span className="text-white text-2xl font-bold my-10">Projects</span>
          <div className="grid grid-cols-2 grid-rows-1 gap-5 w-3/4 h-1/3">
            {projects.map((project, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-ubuntu-navbar border border-solid border-black shadow-md rounded-xl p-4"
              >
                <img
                  src={project.imgSrc}
                  alt={project.imgAlt}
                  className="w-20 mt-2.5"
                />
                <div className="flex flex-col">
                  <span className="text-white font-bold">{project.name}</span>
                  <span className="text-white text-sm">
                    {project.description}
                  </span>
                  <div className="flex mt-2 gap-2">
                    <a href={project.githubRepoUrl} target="_blank">
                      <GithubIcon className="project-icon" />
                    </a>
                    {project.hasWebPage && (
                      <a href={project.webUrl} target="_blank">
                        <WwwIcon className="project-icon" />
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
