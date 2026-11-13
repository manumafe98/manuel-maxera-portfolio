import { projects } from "@/content/portfolio";
import { SearchIcon } from "@/icons";
import type { WindowProps } from "@/types/window.types";
import { CloseWindowButton } from "./CloseWindowButton";
import { ProjectCard } from "./ProjectCard";

export const UbuntuSoftwareWindow = ({
  open,
  zIndex,
  onClose,
  onFocus,
}: WindowProps) => {
  return (
    <dialog
      open={open}
      style={{ zIndex }}
      onPointerDown={onFocus}
      aria-label="Software"
      className="window-frame min-h-[50vh] min-w-[40vw] max-xl:min-w-[60vw] bg-ubuntu-options"
    >
      <div className="flex items-center justify-between w-full h-10 bg-ubuntu-top-bar rounded-t-lg border-b border-solid border-black">
        <div className="flex items-center justify-center w-6 h-6 mx-3 bg-gray-50/20 rounded-md">
          <SearchIcon aria-hidden="true" className="white-icon w-5 h-5" />
        </div>
        <span className="text-white">Explore</span>
        <CloseWindowButton
          onClose={onClose}
          className="mx-3 bg-gray-50/20 hover:bg-gray-50/15"
        />
      </div>
      <div className="flex flex-col items-center justify-center pb-10">
        <span className="text-white text-2xl font-bold my-10">Projects</span>
        <ul className="grid grid-cols-2 grid-rows-1 gap-5 w-3/4 h-1/3">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} frame="window" />
          ))}
        </ul>
      </div>
    </dialog>
  );
};
