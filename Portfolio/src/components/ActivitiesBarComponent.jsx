import { useState, useEffect } from "react";
import { FilledArrowDownIcon, CurriculumIcon, GithubIcon, LinkedinIcon } from "../constants/Icons";

export const ActivitiesBarComponent = () => {
  const [formattedDate, setFormattedDate] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
      const month = months[now.getMonth()]
      const day = now.getDate().toString().padStart(2, "0")
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")

      setFormattedDate(`${month} ${day} ${hours}:${minutes}`)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-black h-11">
      <div className="flex justify-between items-center mx-5">
        <span className="text-white">Activities</span>
        <span className="text-white">{formattedDate}</span>
        <div className="rounded-3xl p-1.5 relative hover:bg-gray-50/10 my-1">
          <span 
            className="flex items-center gap-2 text-white cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Socials
            <FilledArrowDownIcon className="fill-current text-white w-5 h-5"/>
          </span>
          {menuOpen && (
            <div className="absolute w-56 top-10 -left-32 mt-1 bg-black rounded-lg shadow-lg border border-gray-600">
              <ul className="py-1 px-1">
                <li>
                  <a
                    href="https://www.linkedin.com/in/manuel-maxera/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:bg-gray-50/10 hover:rounded-xl flex gap-2 px-4 py-2 text-sm font-bold cursor-pointer"
                  >
                    <span><LinkedinIcon className="fill-current text-white w-4 h-4"/></span>
                    Linkedin
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/manumafe98"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:bg-gray-50/10 hover:rounded-xl flex gap-2 px-4 py-2 text-sm font-bold cursor-pointer"
                  >
                    <span><GithubIcon className="fill-current text-white w-4 h-4"/></span>
                    Github
                  </a>
                </li>
                <li>
                  <a
                    href="/files/Manuel_Maxera_Resume.pdf"
                    download="Manuel_Maxera_Resume.pdf"
                    className="text-white hover:bg-gray-50/10 hover:rounded-xl flex gap-2 px-4 py-2 text-sm font-bold cursor-pointer"
                  >
                    <span><CurriculumIcon className="fill-current text-white w-4 h-4"/></span>
                    Download Curriculum
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
