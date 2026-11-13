import { ApplicationsMenu } from "@/components/ApplicationsMenu";
import { appWindowIds, appWindows } from "@/components/appWindows";
import { ClaudeCodeWindow } from "@/components/claude-code/ClaudeCodeWindow";
import { PhoneClaudeCode } from "@/components/claude-code/PhoneClaudeCode";
import { TopBar } from "@/components/TopBar";
import type { AppWindowId } from "@/content/portfolio";
import { LeftArrowIcon, RightArrowIcon } from "@/icons";
import type { WindowProps } from "@/types/window.types";
import { ElementType, Suspense, useState } from "react";

/** A window on the Desktop: Claude Code or one of the App windows. */
type DesktopWindowId = "claude-code" | AppWindowId;

export const HomePage = () => {
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [calendarDay, setCalendarDay] = useState<string>("");

  /** Open windows, back to front. Claude Code opens by default. */
  const [stack, setStack] = useState<DesktopWindowId[]>(["claude-code"]);
  /** Windows opened at least once, so their code has been requested. */
  const [loaded, setLoaded] = useState<DesktopWindowId[]>(["claude-code"]);

  /** Opens the window, or brings it to the front when it's already open. */
  const bringToFront = (name: DesktopWindowId) => {
    setStack((current) => [...current.filter((app) => app !== name), name]);
    setLoaded((current) =>
      current.includes(name) ? current : [...current, name],
    );
  };

  const windowProps = (name: DesktopWindowId): WindowProps => ({
    open: stack.includes(name),
    zIndex: (stack.indexOf(name) + 1) * 10,
    onClose: () => setStack((current) => current.filter((app) => app !== name)),
    onFocus: () => {
      if (stack[stack.length - 1] !== name) bringToFront(name);
    },
  });

  const handleCalendarClick = (
    isCalendarOpen: boolean,
    calendarValue: string,
  ) => {
    // The calendar's custom elements need a browser, so they load on first use.
    void import("cally");
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
          {...windowProps("claude-code")}
          onOpenApp={bringToFront}
        />
        {appWindowIds.map((id) => {
          const { Window } = appWindows[id];
          return (
            loaded.includes(id) && (
              <Suspense key={id} fallback={null}>
                <Window {...windowProps(id)} />
              </Suspense>
            )
          );
        })}
        <TopBar openCalendar={handleCalendarClick} />
        <ApplicationsMenu openWindow={bringToFront} />
        {calendarOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 top-12 z-50">
            <div className="bg-ubuntu-top-bar text-white rounded-xl p-5 shadow-lg border border-gray-600">
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
