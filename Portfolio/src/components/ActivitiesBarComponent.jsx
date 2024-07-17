import { ArrowDownIcon } from "../constants/Icons"

export const ActivitiesBarComponent = () => {
  const now = new Date()
  
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
  const month = months[now.getMonth()]
  const day = now.getDate().toString().padStart(2, "0")
  const hours = now.getHours().toString().padStart(2, "0")
  const minutes = now.getMinutes().toString().padStart(2, "0")

  const formattedDate = `${month} ${day} ${hours}:${minutes}`

  return (
    <div className="bg-black h-8">
      <div className="flex justify-between items-center mx-5">
        <span className="text-white">Activities</span>
        <span className="text-white">{formattedDate}</span>
        <span><ArrowDownIcon className="fill-current text-white w-5 h-5"/></span>
      </div>
    </div>
  )
}
