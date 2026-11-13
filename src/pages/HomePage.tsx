import { ActivitiesBar } from "@/components/ActivitiesBar";
import { ApplicationsMenu } from "@/components/ApplicationsMenu";
import { ClaudeCodeWindow } from "@/components/claude-code/ClaudeCodeWindow";
import { PhoneClaudeCode } from "@/components/claude-code/PhoneClaudeCode";
import type { AppId } from "@/content/portfolio";
import { LeftArrowIcon, RightArrowIcon } from "@/icons";
import type { DialogProps } from "@/types/dialog.types";
import "cally";
import { ElementType, lazy, Suspense, useState } from "react";

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
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [calendarDay, setCalendarDay] = useState<string>("");

  /** Open windows, back to front. Claude Code opens by default. */
  const [stack, setStack] = useState<ApplicationName[]>(["claudecode"]);
  /** Windows opened at least once, so their code has been requested. */
  const [loaded, setLoaded] = useState<ApplicationName[]>(["claudecode"]);

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
      {/* Both shells render; CSS shows one of them (ADR-0002). */}
      <section className="desktop-shell h-screen w-screen overflow-hidden relative">
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
      <div className="phone-shell">
        <PhoneClaudeCode />
      </div>
    </>
  );
};
