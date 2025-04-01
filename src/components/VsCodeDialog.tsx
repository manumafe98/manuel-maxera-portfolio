import { editorOptions } from "@/constants/editorOptions";
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

export const VsCodeDialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ onClose }, ref) => {
    const closeVsCodeDialog = () => {
      onClose(ref, "vscode");
    };

    const professionalExperiences = [
      {
        name: "software_engineer",
        experience: [
          "- Develop and maintain a suite of applications across multiple technologies: PHP (core app), Java (scraping and API interaction), and TypeScript (browser extension)",
          "- Designed and maintained a browser extension using TypeScript with a React frontend and Node.js backend",
          "- Developed Java-based crawlers/robots to scrape job boards or communicate with their APIs, parsing responses to create user-specific datasets",
          "- Built and maintained the core PHP application, acting as the end product for end-users and integrating functionalities from the extension and crawlers",
          "- Conducted bug fixes, defect resolution, and implemented new features across all platforms to enhance functionality and user experience",
          "- Collaborated with cross-functional teams to ensure seamless integration between projects",
        ],
      },
      {
        name: "cloud_engineer",
        experience: [
          "- Led critical cloud infrastructure operations, including server provisioning, decommissioning, and configuration management across multiple cloud platforms and Linux environments",
          "- Managed on-call rotations, ensuring rapid response to and resolution of critical infrastructure issues",
          "- Spearheaded proactive monitoring initiatives, collaborating with cross-functional teams to implement and optimize alerting systems, significantly improving infrastructure reliability and availability",
          "- Designed and implemented a refined alarm severity system, drastically reducing false positives and enabling more efficient crisis management",
          "- Initiated and drove the adoption of a team-owned alarm routing system, enhancing accountability and response times by aligning alerts with infrastructure ownership",
          "- Developed and executed automation strategies using scripting and workflow tools, streamlining operations and reducing manual interventions",
          "- Acted as a technical enabler, working closely with various teams to enhance their monitoring capabilities and infrastructure reliability",
          "- Continuously optimized on-call processes, minimizing team burden while maintaining high-quality support",
        ],
      },
      {
        name: "sysadmin_unix",
        experience: [
          "- Administered and maintained a diverse server environment including Linux Red Hat, AIX, and Solaris systems, focusing on capacity planning, server installation, and troubleshooting",
          "- Managed a 24/7 on-call rotation, promptly responding to and resolving critical infrastructure alerts and issues",
          "- Developed and executed daily and scheduled maintenance tasks to optimize and improve existing infrastructure",
          "- Successfully led server and data migration projects, ensuring minimal downtime and data integrity",
          "- Performed server software installations and upgrades, maintaining system security and performance",
          "- Provided technical assistance and guidance to on-site datacenter staff, enhancing overall operational efficiency",
          "- Implemented an Ansible-based automation solution across multiple servers, significantly reducing manual ticket resolution time for specific issues",
        ],
      },
      {
        name: "helpdesk",
        experience: [
          "- Provided comprehensive technical support to customers via multiple channels (phone, chat, email), troubleshooting and resolving application and computer issues across Linux, Windows, and Mac systems",
          "- Utilized remote access tools to efficiently diagnose and fix software problems, demonstrating adaptability across diverse operating systems",
          "- Improved support efficiency by reducing average call resolution time and decreasing call abandonment rates",
          "- Increased overall customer service capacity, resulting in a higher number of users served",
        ],
      },
    ];

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
              {professionalExperiences.map((professionalExperience, index) => (
                <Fragment key={index}>
                  &nbsp;&nbsp;
                  <span className="text-red-500">
                    {professionalExperience.name}
                  </span>
                  <span className="text-white">:</span>
                  <br />
                  {professionalExperience.experience.map(
                    (experience, expIndex) => (
                      <Fragment key={expIndex}>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="text-green-500">{experience}</span>
                        <br />
                      </Fragment>
                    ),
                  )}
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
