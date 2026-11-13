import { ApplicationsMenu } from "@/components/ApplicationsMenu";
import { appWindowIds, appWindows } from "@/components/appWindows";
import { ClaudeCodeWindow } from "@/components/claude-code/ClaudeCodeWindow";
import { PhoneClaudeCode } from "@/components/claude-code/PhoneClaudeCode";
import { CloseWindowButton } from "@/components/CloseWindowButton";
import { LoadError, LoadErrorBoundary } from "@/components/LoadErrorBoundary";
import { TopBar } from "@/components/TopBar";
import type { AppWindowId } from "@/content/portfolio";
import { LeftArrowIcon, RightArrowIcon } from "@/icons";
import type { WindowProps } from "@/types/window.types";
import { ElementType, Suspense, useState } from "react";

/** A window on the Desktop: Claude Code or one of the App windows. */
type DesktopWindowId = "claude-code" | AppWindowId;

/** Today in local time as YYYY-MM-DD, the value the calendar expects. */
const todayIso = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

export const HomePage = () => {
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

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

  const toggleCalendar = () => {
    // The calendar's custom elements need a browser, so they load on first use.
    void import("cally");
    setCalendarOpen((open) => !open);
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
          const { Window, dock } = appWindows[id];
          const props = windowProps(id);
          return (
            loaded.includes(id) && (
              <LoadErrorBoundary
                key={id}
                fallback={
                  <dialog
                    open={props.open}
                    style={{ zIndex: props.zIndex }}
                    onPointerDown={props.onFocus}
                    aria-label={dock.label}
                    className="window-frame h-fit flex items-center gap-4 p-4 bg-ubuntu-options text-white"
                  >
                    <LoadError />
                    <CloseWindowButton
                      onClose={props.onClose}
                      className="bg-gray-50/20 hover:bg-gray-50/15"
                      label={`Close ${dock.label}`}
                    />
                  </dialog>
                }
              >
                <Suspense fallback={null}>
                  <Window {...props} />
                </Suspense>
              </LoadErrorBoundary>
            )
          );
        })}
        <TopBar calendarOpen={calendarOpen} onToggleCalendar={toggleCalendar} />
        <ApplicationsMenu openWindow={bringToFront} />
        {calendarOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 top-12 z-50">
            <div className="bg-ubuntu-top-bar text-white rounded-xl p-5 shadow-lg border border-gray-600">
              <CalendarDate value={todayIso()}>
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
