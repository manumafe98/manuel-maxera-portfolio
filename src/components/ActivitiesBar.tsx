import {
  CurriculumIcon,
  FilledArrowDownIcon,
  GithubIcon,
  LinkedinIcon,
} from "@/icons";
import { useEffect, useState } from "react";

interface ActivitiesBarProps {
  openCalendar: (isCalendarOpen: boolean, calendarValue: string) => void;
}

export const ActivitiesBar = ({ openCalendar }: ActivitiesBarProps) => {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const months = [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ];
      const month = months[now.getMonth()];
      const day = now.getDate().toString().padStart(2, "0");
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      setFormattedDate(`${month} ${day} ${hours}:${minutes}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleCalendarClick = () => {
    setCalendarOpen(!calendarOpen);
    openCalendar(calendarOpen, formatDate());
  };

  const activities = [
    {
      name: "Linkedin",
      href: "https://www.linkedin.com/in/manuel-maxera/",
      icon: LinkedinIcon,
      props: { rel: "noopener noreferrer", target: "_blank" },
    },
    {
      name: "Github",
      href: "https://github.com/manumafe98",
      icon: GithubIcon,
      props: { rel: "noopener noreferrer", target: "_blank" },
    },
    {
      name: "Download Curriculum",
      href: "/files/Manuel_Maxera_Resume.pdf",
      icon: CurriculumIcon,
      props: { download: "Manuel_Maxera_Resume.pdf" },
    },
  ];

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="bg-ubuntu-navbar h-11">
      <div className="flex justify-between items-center mx-5">
        <span className="text-white select-none">Activities</span>
        <div
          className="rounded-3xl p-2 text-white hover:bg-gray-50/10 cursor-pointer select-none"
          onClick={handleCalendarClick}
        >
          {formattedDate}
        </div>
        <div
          className="rounded-3xl p-1.5 relative hover:bg-gray-50/10 my-1 cursor-pointer select-none"
          onClick={handleMenuOpen}
        >
          <span className="flex items-center gap-2 text-white">
            Socials
            <FilledArrowDownIcon className="white-icon w-5 h-5" />
          </span>
          {menuOpen && (
            <div className="absolute w-56 top-10 -left-32 mt-1 bg-ubuntu-navbar rounded-lg shadow-lg border border-gray-600">
              <ul className="py-1 px-1">
                {activities.map((activity, index) => (
                  <li key={index}>
                    <a
                      href={activity.href}
                      target="_blank"
                      className="text-white hover:bg-gray-50/10 hover:rounded-xl flex gap-2 px-4 py-2 text-sm font-bold cursor-pointer"
                      {...activity.props}
                    >
                      <span>
                        <activity.icon className="white-icon w-4 h-4" />
                      </span>
                      {activity.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
