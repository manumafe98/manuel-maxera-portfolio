import jammy_wallpaper from "@/assets/jammy_wallpaper.webp";
import { ActivitiesBar } from "@/components/ActivitiesBar";
import { ApplicationsMenu } from "@/components/ApplicationsMenu";
import { ClaudeCodeWindow } from "@/components/claude-code/ClaudeCodeWindow";
import type { AppId } from "@/content/portfolio";
import { LeftArrowIcon, RightArrowIcon } from "@/icons";
import type { DialogProps } from "@/types/dialog.types";
import "cally";
import { ElementType, lazy, Suspense, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

// App windows load on first open, so they stay out of the initial bundle.
const UbuntuSoftwareDialog = lazy(() =>
  import("@/components/UbuntuSoftwareDialog").then((m) => ({
    default: m.UbuntuSoftwareDialog,
  })),
);
const FileManagerDialog = lazy(() =>
  import("@/components/FileManagerDialog").then((m) => ({
    default: m.FileManagerDialog,
  })),
);
const GmailDialog = lazy(() =>
  import("@/components/GmailDialog").then((m) => ({
    default: m.GmailDialog,
  })),
);

/** A window on the Desktop, named as the dock's data-value. */
type ApplicationName =
  "claudecode" | "ubuntusoftware" | "filemanager" | "gmail";

const applicationForApp: Record<AppId, ApplicationName> = {
  "ubuntu-software": "ubuntusoftware",
  files: "filemanager",
  gmail: "gmail",
};

const lazyWindows = [
  ["ubuntusoftware", UbuntuSoftwareDialog],
  ["filemanager", FileManagerDialog],
  ["gmail", GmailDialog],
] as const;

export const HomePage = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth < 1024,
  );
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [calendarDay, setCalendarDay] = useState<string>("");
  const location = useLocation();

  /** Open windows, back to front. Claude Code opens by default. */
  const [stack, setStack] = useState<ApplicationName[]>(["claudecode"]);
  /** Windows opened at least once, so their code has been requested. */
  const [loaded, setLoaded] = useState<ApplicationName[]>(["claudecode"]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  /** Opens the window, or brings it to the front when it's already open. */
  const bringToFront = (name: ApplicationName) => {
    setStack((current) => [...current.filter((app) => app !== name), name]);
    setLoaded((current) =>
      current.includes(name) ? current : [...current, name],
    );
  };

  const windowProps = (name: ApplicationName): DialogProps => ({
    open: stack.includes(name),
    zIndex: (stack.indexOf(name) + 1) * 10,
    onClose: () => setStack((current) => current.filter((app) => app !== name)),
    onFocus: () => {
      if (stack[stack.length - 1] !== name) bringToFront(name);
    },
  });

  const handleDialogPopUp = (dialog: string | undefined) => {
    if (dialog) bringToFront(dialog as ApplicationName);
  };

  const handleCalendarClick = (
    isCalendarOpen: boolean,
    calendarValue: string,
  ) => {
    setCalendarOpen(isCalendarOpen);
    if (calendarValue) {
      const formattedDate = new Date(calendarValue).toISOString().split("T")[0];
      setCalendarDay(formattedDate);
    }
  };

  const CalendarDate = "calendar-date" as ElementType;
  const CalendarMonth = "calendar-month" as ElementType;

  return (
    <>
      {isSmallScreen && (
        <Navigate to="/unavailable" state={{ from: location }} replace />
      )}
      <section className="h-screen w-screen overflow-hidden relative">
        <ClaudeCodeWindow
          {...windowProps("claudecode")}
          onOpenApp={(app) => bringToFront(applicationForApp[app])}
        />
        {lazyWindows.map(
          ([name, Window]) =>
            loaded.includes(name) && (
              <Suspense key={name} fallback={null}>
                <Window {...windowProps(name)} />
              </Suspense>
            ),
        )}
        <ActivitiesBar openCalendar={handleCalendarClick} />
        <ApplicationsMenu openIconDialog={handleDialogPopUp} />
        <img
          src={jammy_wallpaper}
          alt="Ubuntu Jammy Wallpaper"
          className="w-full h-full object-cover"
        />
        {calendarOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 top-12 z-50">
            <div className="bg-ubuntu-navbar text-white rounded-xl p-5 shadow-lg border border-gray-600">
              <CalendarDate value={calendarDay}>
                <LeftArrowIcon
                  className="calendar-icon"
                  aria-label="Previous"
                  slot="previous"
                />
                <RightArrowIcon
                  className="calendar-icon"
                  aria-label="Next"
                  slot="next"
                />
                <CalendarMonth></CalendarMonth>
              </CalendarDate>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
