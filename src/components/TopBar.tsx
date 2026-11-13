import { cv, socialLinks } from "@/content/portfolio";
import { CurriculumIcon } from "@/icons/CurriculumIcon";
import { FilledArrowDownIcon } from "@/icons/FilledArrowDownIcon";
import { GithubIcon } from "@/icons/GithubIcon";
import { LinkedinIcon } from "@/icons/LinkedinIcon";
import { useEffect, useId, useRef, useState } from "react";

/** How often the clock refreshes. It shows minutes, so a few seconds late is fine. */
const CLOCK_TICK_MS = 15_000;

/** The clock's text, such as "nov 13 17:45". */
const clockText = (now: Date) =>
  now
    .toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
    .replace(",", "")
    .toLowerCase();

/** The outline a Top bar button shows on keyboard focus. */
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ubuntu-orange";

interface TopBarProps {
  /** Whether the Desktop shows the calendar, for the clock's aria-expanded. */
  calendarOpen: boolean;
  /** Called on every press of the clock; the Desktop opens or closes the calendar. */
  onToggleCalendar: () => void;
}

export const TopBar = ({ calendarOpen, onToggleCalendar }: TopBarProps) => {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const socials = useRef<HTMLDivElement>(null);
  const socialsButton = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // While the Socials menu is open, Escape or a press outside it closes it.
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      socialsButton.current?.focus();
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!socials.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
    };
  }, [menuOpen]);

  useEffect(() => {
    const updateTime = () => setFormattedDate(clockText(new Date()));
    updateTime();
    const timer = setInterval(updateTime, CLOCK_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const socialIcons = { LinkedIn: LinkedinIcon, GitHub: GithubIcon };

  const menuLinks = [
    ...socialLinks.map((socialLink) => ({
      name: socialLink.name,
      href: socialLink.url,
      icon: socialIcons[socialLink.name],
      props: { rel: "noopener noreferrer", target: "_blank" },
    })),
    {
      name: "Download Curriculum",
      href: cv.path,
      icon: CurriculumIcon,
      props: { download: cv.fileName },
    },
  ];

  return (
    // Above the App windows, whose z-index grows as they stack.
    <div className="bg-ubuntu-top-bar h-11 relative z-50">
      <div className="flex justify-between items-center mx-5">
        <span className="text-white select-none">Activities</span>
        <button
          type="button"
          aria-expanded={calendarOpen}
          className={`rounded-3xl p-2 text-white hover:bg-gray-50/10 cursor-pointer select-none ${focusRing}`}
          onClick={onToggleCalendar}
        >
          {formattedDate}
        </button>
        <div ref={socials} className="relative my-1">
          <button
            ref={socialsButton}
            type="button"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? menuId : undefined}
            className={`flex items-center gap-2 rounded-3xl p-1.5 text-white hover:bg-gray-50/10 cursor-pointer select-none ${focusRing}`}
            onClick={() => setMenuOpen((open) => !open)}
          >
            Socials
            <FilledArrowDownIcon
              aria-hidden="true"
              className="white-icon w-5 h-5"
            />
          </button>
          {menuOpen && (
            <div
              id={menuId}
              className="absolute w-56 top-10 -left-32 mt-1 bg-ubuntu-top-bar rounded-lg shadow-lg border border-gray-600"
            >
              <ul className="py-1 px-1">
                {menuLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      target="_blank"
                      className="text-white hover:bg-gray-50/10 hover:rounded-xl flex gap-2 px-4 py-2 text-sm font-bold cursor-pointer"
                      {...link.props}
                    >
                      <span>
                        <link.icon
                          aria-hidden="true"
                          className="white-icon w-4 h-4"
                        />
                      </span>
                      {link.name}
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
