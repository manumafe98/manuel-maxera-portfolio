import { FilesIcon, LeftArrowIcon, RightArrowIcon, SearchIcon, SublimeTextIcon, UnfilledArrowDownIcon, VisualStudioCodeIcon, XMarkIcon, YamlIcon } from "../constants/Icons";
import { ActivitiesBarComponent } from "./ActivitiesBarComponent";
import { ApplicationsMenuComponent } from "./ApplicationsMenuComponent";
import { useRef, useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import jammy_wallpaper from "../static/media/jammy_wallpaper.jpg";
import vbnb_logo from "../static/media/vbnb_logo.png";
import exercism_logo from "../static/media/exercism_logo.png";

export const HomeScreenComponent = () => {
  const[senderEmail, setSenderEmail] = useState('')
  const[message, setMessage] = useState('')
  const[gmailDialogPopUpData, setGmailDialogPopupData] = useState({ text: "", success: true })
  const[showGmailDialogNotification, setShowGmailDialogNotification] = useState(false)
  const[isSmallScreen, setIsSmallScreen] = useState(false)
  const openGmailDialogRef = useRef(null)
  const openUbuntuSoftwareDialogRef = useRef(null)
  const openTerminalDialogRef = useRef(null)
  const openSublimeDialogRef = useRef(null)
  const openVsCodeDialogRef = useRef(null)
  const location = useLocation()

  const validEmailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  if (isSmallScreen) {
    return <Navigate to="/unavailable" state={{ from: location }} replace/>
  }

  const checkValidForm = () => {
    if (!validEmailRegex.test(senderEmail.trim())) {
      handleGmailMessagePopUp("Ivalid email address", false)
      return false
    } else if (!message.trim()) {
      handleGmailMessagePopUp("Invalid message", false)
      return false
    }

    return true
  }

  const handleGmailMessagePopUp = (text, success) => {
    setShowGmailDialogNotification(true)
    setGmailDialogPopupData({ text, success })
    setTimeout(() => setShowGmailDialogNotification(false), 4000)
  }

  const sendEmail = async () => {
    const isValid = checkValidForm()

    if (isValid) {
      const templateParams = {
        from_email: senderEmail,
        message: message,
      }
  
      try {
        await emailjs.send(import.meta.env.EMAILJS_SERVICE_ID, import.meta.env.EMAILJS_TEMPLATE_ID, templateParams, import.meta.env.EMAILJS_USER_PUBLIC_KEY)
        handleGmailMessagePopUp("Email Sent", true)
      } catch (error) {
        console.log("FAILED...", error)
      }
    }
  }

  const handleDialogPopUp = (dialog) => {
    switch (dialog) {
      case "Gmail":
        openGmailDialogRef.current?.showModal()
        break
      case "Ubuntu Software":
        openUbuntuSoftwareDialogRef.current?.showModal()
        break
      case "Terminal":
        openTerminalDialogRef.current?.showModal()
        break
      case "Sublime":
        openSublimeDialogRef.current?.showModal()
        break
      case "VsCode":
        openVsCodeDialogRef.current?.showModal()
        break
    }
  }

  const closeGmailDialog = () => {
    openGmailDialogRef.current?.close()
  }

  const closeUbuntuSoftwareDialog = () => {
    openUbuntuSoftwareDialogRef.current?.close()
  }

  const closeTerminalDialog = () => {
    openTerminalDialogRef.current?.close()
  }

  const closeSublimeDialog = () => {
    openSublimeDialogRef.current?.close()
  }

  const closeVsCodeDialog = () => {
    openVsCodeDialogRef.current?.close()
  }

  return (
    <section className="h-screen w-screen overflow-hidden relative">
      <dialog
        ref={openVsCodeDialogRef}
        className="fixed inset-0 m-auto rounded-xl min-h-[80vh] min-w-[50vw] max-2xl:max-w-[80vw] w-fit h-fit border border-solid border-black"
      >
        <div className="flex items-center justify-between w-full h-10 bg-[#1E1E1E] border-b border-solid border-black">
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
            <li className="text-white">File</li>
            <li className="text-white">Edit</li>
            <li className="text-white">Selection</li>
            <li className="text-white">Find</li>
            <li className="text-white">View</li>
          </ul>
        </div>
        <div className="flex w-full">
          <div className="flex h-[75.1vh] w-3/12 bg-[#24242C]">
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
          <div className="w-9/12 bg-[#242C34]">
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
      <dialog
        ref={openSublimeDialogRef}
        className="fixed inset-0 m-auto rounded-xl min-h-[50vh] min-w-[50vw] max-2xl:max-w-[60vw] max-xl:max-w-[80vw] w-fit h-fit bg-[#333A41] border border-solid border-black overflow-hidden"
      >
        <div className="flex items-center justify-between w-full h-10 bg-[#1E1E1E] border-b border-solid border-black">
          <div className="flex items-center w-6 h-6 mx-3">
            <SublimeTextIcon className="w-5 h-5"/>
          </div>
          <span className="text-white font-bold">
            Sublime
          </span>
          <button
            className="flex items-center justify-center w-6 h-6 rounded-full mx-3 bg-orange-500 hover:bg-orange-500/80"
            onClick={closeSublimeDialog}
          >
            <XMarkIcon className="fill-current text-white w-4 h-4"/>
          </button>
        </div>
        <div className="w-full h-8 bg-[#2A2929]">
          <ul className="flex items-center gap-4 mx-2">
            <li className="text-white">File</li>
            <li className="text-white">Edit</li>
            <li className="text-white">Selection</li>
            <li className="text-white">Find</li>
            <li className="text-white">View</li>
          </ul>
        </div>
        <div className="w-full h-8 bg-gray-600 flex items-center">
          <LeftArrowIcon className="fill-current text-white w-6 h-6"/>
          <RightArrowIcon className="fill-current text-white w-6 h-6"/>
          <div className="flex items-center w-36 h-8 bg-[#333A41] rounded-lg mt-1">
            <span className="text-sm text-white mx-2">About_me.md</span>
          </div>
        </div>
        <div className="h-[39vh] scrollbar-thin scrollbar-thumb-gray-50/15 scrollbar-track-transparent overflow-x-auto">
          <div className="mx-5 mt-4 w-[calc(100vh)]">
            <span className="text-sm text-white font-sublime whitespace-nowrap">
              ## About Me<br/>
              Versatile IT professional with a progressive career spanning helpdesk support, Unix system administration, and cloud engineering, now pivoting towards software engineering.<br/>
              Leveraging a strong foundation in technical problem-solving, infrastructure management, and automation to bring a unique perspective to software development.<br/>
              Experienced in optimizing systems, implementing monitoring solutions, and driving operational efficiencies, with skills that translate directly to creating robust, scalable software solutions.<br/>
              Passionate about emerging technologies and continuously expanding coding skills, eager to contribute a diverse IT background to innovative software development projects.
            </span>
          </div>
        </div>
      </dialog>
      <dialog
        ref={openTerminalDialogRef}
        className="fixed inset-0 m-auto rounded-xl min-h-[50vh] min-w-[40vw] max-xl:min-w-[60vw] w-fit h-fit bg-[#320E24] border border-solid border-black"
      >
        <div className="flex items-center justify-between w-full h-10 bg-[#1E1E1E] border-b border-solid border-black">
          <div className="w-6 h-6 mx-3">
            <span className="hidden">hidden</span>
          </div>
          <span className="text-white font-bold">
            /bin/bash
          </span>
          <button
            className="flex items-center justify-center w-6 h-6 rounded-full mx-3 bg-gray-50/20 hover:bg-gray-50/15"
            onClick={closeTerminalDialog}
          >
            <XMarkIcon className="fill-current text-white w-4 h-4"/>
          </button>
        </div>
        <div className="flex">
          <div className="flex items-center justify-center h-5 w-36 bg-[#2A2929]">
            <span className="text-white mx-3">manuel@Ubuntu</span>
          </div>
          <div className="flex items-center justify-center h-5 w-8 bg-[#3965A1]">
            <span>~</span>
          </div>
          <div className="w-0 h-0 border-l-[12px] border-l-[#3965A1] border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent"></div>
          <span className="text-white mx-2">
            sh ./start_portfolio
          </span>
        </div>
      </dialog>
      <dialog
        ref={openUbuntuSoftwareDialogRef}
        className="fixed inset-0 m-auto rounded-xl min-h-[50vh] min-w-[30vw] w-fit h-fit bg-[#2A2929] border border-solid border-black"
      >
        <div className="flex items-center justify-between w-full h-10 bg-[#1E1E1E] border-b border-solid border-black">
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
            <a href="https://github.com/manumafe98/java" target="_blank">
              <div className="flex items-center gap-3 bg-[#1E1E1E] border border-solid border-black shadow-md rounded-xl p-4 hover:opacity-80 cursor-pointer">
                <img src={exercism_logo} alt="Vbnb logo" className="w-16 mt-2.5"/>
                <div className="flex flex-col">
                  <span className="text-white font-bold">Exercism</span>
                  <span className="text-white text-sm">Java Track Maintainer</span>
                </div>
              </div>
            </a>
            <a href="https://github.com/manumafe98/Vbnb" target="_blank">
              <div className="flex items-center gap-3 bg-[#1E1E1E] border border-solid border-black shadow-md rounded-xl p-4 hover:opacity-80 cursor-pointer">
                <img src={vbnb_logo} alt="Vbnb logo" className="w-16 mt-2.5"/>
                <div className="flex flex-col">
                  <span className="text-white font-bold">Vbnb</span>
                  <span className="text-white text-sm">Listing App</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </dialog>
      <dialog
        ref={openGmailDialogRef}
        className="fixed inset-0 m-auto rounded-xl min-h-[50vh] min-w-[30vw] max-2xl:min-w-[40vw] p-5 w-fit h-fit"
      >
        <button
          className="flex items-center justify-center w-6 h-6 hover:bg-zinc-100 rounded-full hover:shadow absolute right-5 top-4"
          onClick={closeGmailDialog}
        >
          <XMarkIcon className="fill-current text-ubuntu-main w-4 h-4"/>
        </button>
        <div className="flex flex-col justify-center items-center mt-10">
          <span className="text-ubuntu-main text-2xl font-bold mb-10">
            Contact Me
          </span>
          <div className="flex flex-col w-4/6">
            <input
              placeholder="email@example.com"
              type="text"
              value={senderEmail}
              className="w-full h-9 mb-2 p-2 border border-solid border-main-gray shadow-md rounded-xl focus:outline-none focus:ring-1 focus:ring-ubuntu-focus focus:border-ubuntu-focus"
              onChange={(e) => setSenderEmail(e.target.value)}
            />
            <textarea
              placeholder="message"
              value={message}
              className="w-full h-32 mb-2 p-2 border border-solid border-main-gray shadow-md rounded-xl resize-none placeholder-top-left focus:outline-none focus:ring-1 focus:ring-ubuntu-focus focus:border-ubuntu-focus"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="h-9 text-white rounded-xl bg-ubuntu-main w-full hover:bg-ubuntu-focus"
              onClick={sendEmail}
            >
              Send
            </button>
          </div>
        </div>
        {showGmailDialogNotification && (
          <GmailDialogMessagePopUp text={gmailDialogPopUpData.text} success={gmailDialogPopUpData.success}/>
        )}
      </dialog>
      <ActivitiesBarComponent/>
      <ApplicationsMenuComponent openIconDialog={handleDialogPopUp}/>
      <img 
        src={jammy_wallpaper} 
        alt="Ubuntu Jammy Wallpaper" 
        className="w-full h-full object-cover"
      />
    </section>
  )
}
