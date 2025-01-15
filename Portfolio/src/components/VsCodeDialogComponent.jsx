import { forwardRef } from "react";
import { FilesIcon, UnfilledArrowDownIcon, VisualStudioCodeIcon, XMarkIcon, YamlIcon } from "../constants/Icons";
import { editorOptions } from "../constants/editorOptions";

export const VsCodeDialogComponent = forwardRef((props, ref) => {
  const { onClose } = props

  const closeVsCodeDialog = () => {
    onClose(ref, "vscode")
  }

  return (
    <dialog
      ref={ref}
      className="fixed inset-0 m-auto rounded-xl min-h-[80vh] min-w-[50vw] max-2xl:max-w-[80vw] w-fit h-fit border border-solid border-black"
    >
      <div className="flex items-center justify-between w-full h-10 bg-[#1E1E1E] rounded-t-xl border-b border-solid border-black">
        <div className="flex items-center w-6 h-6 mx-3">
          <VisualStudioCodeIcon className="w-5 h-5"/>
        </div>
        <span className="text-white font-bold">
          professional_experience.yaml - Experience - Visual Studio Code
        </span>
        <button
          className="flex items-center justify-center w-6 h-6 rounded-full mx-3 bg-gray-50/20 hover:bg-gray-50/15"
          onClick={closeVsCodeDialog}
        >
          <XMarkIcon className="fill-current text-white w-4 h-4"/>
        </button>
      </div>
      <div className="w-full h-8 bg-[#2A2929]">
        <ul className="flex items-center gap-4 mx-2">
          {editorOptions.map((editorOption, index) => (
            <li key={index} className="text-white">{editorOption}</li>
          ))}
        </ul>
      </div>
      <div className="flex w-full">
        <div className="flex h-[75.1vh] w-3/12 bg-[#24242C] rounded-bl-lg border-b border-solid border-black">
          <div className="w-2/12 m-1 p-1">
            <FilesIcon className="fill-current text-white w-10 h-10"/>
          </div>
          <div className="w-10/12">
            <div className="flex items-center justify-between m-1 p-1">
              <span className="text-gray-400 text-sm ml-3">Explorer</span>
              <span className="text-gray-400 text-sm">. . .</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span><UnfilledArrowDownIcon className="fill-current text-gray-400 w-4 h-4"/></span>
              <span className="text-gray-400 font-bold text-sm">Experience</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-gray-400/30 p-1 mt-1">
              <YamlIcon className="w-5 h-5"/>
              <span className="text-sm text-white">professional_experience.yaml</span>
            </div>
          </div>
        </div>
        <div className="w-9/12 bg-[#242C34] rounded-br-lg">
          <div className="w-full h-12 bg-[#24242C]">
            <div className="w-5/12 bg-[#242C34]">
              <div className="flex items-center justify-center gap-2 bg-gray-400/30 h-12 p-1 border-b border-solid border-b-white border-x-black">
                <YamlIcon className="w-5 h-5"/>
                <span className="text-sm text-white">professional_experience.yaml</span>
                <XMarkIcon className="fill-current text-white w-4 h-4"/>
              </div>
            </div>
          </div>
          <div className="h-[70vh] max-w-full w-[calc(95vh)] overflow-x-auto scrollbar hover:scrollbar-thumb-gray-50/10 whitespace-pre text-left font-mono text-sm leading-relaxed p-1">
            <span className="text-red-500">professional_experience</span><span className="text-white">:</span><br/>
            &nbsp;&nbsp;<span className="text-red-500">software_engineer</span><span className="text-white">:</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Develop and maintain a suite of applications across multiple technologies: PHP (core app), Java (scraping and API interaction), and TypeScript (browser extension)</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Designed and maintained a browser extension using TypeScript with a React frontend and Node.js backend</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Developed Java-based crawlers/robots to scrape job boards or communicate with their APIs, parsing responses to create user-specific datasets</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Built and maintained the core PHP application, acting as the end product for end-users and integrating functionalities from the extension and crawlers</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Conducted bug fixes, defect resolution, and implemented new features across all platforms to enhance functionality and user experience</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Collaborated with cross-functional teams to ensure seamless integration between projects</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="text-red-500">cloud_engineer</span><span className="text-white">:</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Led critical cloud infrastructure operations, including server provisioning, decommissioning, and configuration management across multiple cloud platforms and Linux environments</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Managed on-call rotations, ensuring rapid response to and resolution of critical infrastructure issues</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Spearheaded proactive monitoring initiatives, collaborating with cross-functional teams to implement and optimize alerting systems, significantly improving infrastructure reliability and availability</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Designed and implemented a refined alarm severity system, drastically reducing false positives and enabling more efficient crisis management</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Initiated and drove the adoption of a team-owned alarm routing system, enhancing accountability and response times by aligning alerts with infrastructure ownership</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Developed and executed automation strategies using scripting and workflow tools, streamlining operations and reducing manual interventions</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Acted as a technical enabler, working closely with various teams to enhance their monitoring capabilities and infrastructure reliability</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Continuously optimized on-call processes, minimizing team burden while maintaining high-quality support</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="text-red-500">sysadmin_unix</span><span className="text-white">:</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Administered and maintained a diverse server environment including Linux Red Hat, AIX, and Solaris systems, focusing on capacity planning, server installation, and troubleshooting</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Managed a 24/7 on-call rotation, promptly responding to and resolving critical infrastructure alerts and issues</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Developed and executed daily and scheduled maintenance tasks to optimize and improve existing infrastructure</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Successfully led server and data migration projects, ensuring minimal downtime and data integrity</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Performed server software installations and upgrades, maintaining system security and performance</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Provided technical assistance and guidance to on-site datacenter staff, enhancing overall operational efficiency</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Implemented an Ansible-based automation solution across multiple servers, significantly reducing manual ticket resolution time for specific issues</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="text-red-500">helpdesk</span><span className="text-white">:</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Provided comprehensive technical support to customers via multiple channels (phone, chat, email), troubleshooting and resolving application and computer issues across Linux, Windows, and Mac systems</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Utilized remote access tools to efficiently diagnose and fix software problems, demonstrating adaptability across diverse operating systems</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Improved support efficiency by reducing average call resolution time and decreasing call abandonment rates</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-500">- Increased overall customer service capacity, resulting in a higher number of users served</span><br/>
          </div>
        </div>
      </div>
    </dialog>
  )
})
