import { forwardRef } from "react";
import { GithubIcon, SearchIcon, WwwIcon, XMarkIcon } from "../constants/Icons";
import chelsea_trivia_logo from "../static/media/chelsea_trivia_logo.webp";
import exercism_logo from "../static/media/exercism_logo.webp";
import vbnb_logo from "../static/media/vbnb_logo.webp";

export const UbuntuSoftwareDialogComponent = forwardRef((props, ref) => {
  const { onClose } = props

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
        hasWebPage: true,
        webUrl: "https://vbnb.netlify.app/",
      },
      {
        name: "Chelsea Trivia",
        description: "Chelsea Trivia Game",
        imgSrc: chelsea_trivia_logo,
        imgAlt: "Chelsea Trivia Logo",
        githubRepoUrl: "https://github.com/manumafe98/chelsea_trivia_2.0",
        hasWebPage: false
      }
    ]

  const closeUbuntuSoftwareDialog = () => {
    onClose(ref, "ubuntusoftware")
  }

  return (
    <dialog
      ref={ref}
      className="fixed inset-0 m-auto rounded-xl min-h-[50vh] min-w-[40vw] max-xl:min-w-[60vw] w-fit h-fit bg-[#2A2929] border border-solid border-black"
    >
      <div className="flex items-center justify-between w-full h-10 bg-[#1E1E1E] rounded-t-lg border-b border-solid border-black">
        <div className="flex items-center justify-center w-6 h-6 mx-3 bg-gray-50/20 rounded-md">
          <SearchIcon className="fill-current text-white w-5 h-5"/>
        </div>
        <span className="text-white">
          Explore
        </span>
        <button
          className="flex items-center justify-center w-6 h-6 rounded-full mx-3 bg-gray-50/20 hover:bg-gray-50/15"
          onClick={closeUbuntuSoftwareDialog}
        >
          <XMarkIcon className="fill-current text-white w-4 h-4"/>
        </button>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="text-white text-2xl font-bold my-10">Projects</span>
        <div className="grid grid-cols-2 grid-rows-1 gap-5 w-3/4 h-1/3">
          {projects.map((project, index) => (
            <div key={index} className="flex items-center gap-3 bg-[#1E1E1E] border border-solid border-black shadow-md rounded-xl p-4">
              <img src={project.imgSrc} alt={project.imgAlt} className="w-20 mt-2.5"/>
              <div className="flex flex-col">
                <span className="text-white font-bold">{project.name}</span>
                <span className="text-white text-sm">{project.description}</span>
                <div className="flex mt-2 gap-2">
                  <a href={project.githubRepoUrl} target="_blank">
                    <GithubIcon className="fill-current w-6 h-6 hover:text-ubuntu-main"/>
                  </a>
                  {project.hasWebPage && (
                    <a href={project.webUrl} target="_blank">
                      <WwwIcon className="fill-current w-6 h-6 hover:text-ubuntu-main"/>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </dialog>
  )
})
