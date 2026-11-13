import jammy_wallpaper from "@/assets/jammy_wallpaper.webp";
import { ActivitiesBar } from "@/components/ActivitiesBar";
import { ApplicationsMenu } from "@/components/ApplicationsMenu";
import { ClaudeCodeWindow } from "@/components/claude-code/ClaudeCodeWindow";
import { FileManagerDialog } from "@/components/FileManagerDialog";
import { GmailDialog } from "@/components/GmailDialog";
import { UbuntuSoftwareDialog } from "@/components/UbuntuSoftwareDialog";
import { LeftArrowIcon, RightArrowIcon } from "@/icons";
import "cally";
import { ElementType, RefObject, useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const HomePage = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth < 1024,
  );
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [calendarDay, setCalendarDay] = useState<string>("");
  const openGmailDialogRef = useRef<HTMLDialogElement>(null);
  const openUbuntuSoftwareDialogRef = useRef<HTMLDialogElement>(null);
  const openClaudeCodeDialogRef = useRef<HTMLDialogElement>(null);
  const openFileManagerDialogRef = useRef<HTMLDialogElement>(null);
  const location = useLocation();

  type ApplicationName =
    "gmail" | "claudecode" | "ubuntusoftware" | "filemanager";

  const applicationToRefRelation: Record<
    ApplicationName,
    RefObject<HTMLDialogElement | null>
  > = {
    gmail: openGmailDialogRef,
    claudecode: openClaudeCodeDialogRef,
    ubuntusoftware: openUbuntuSoftwareDialogRef,
    filemanager: openFileManagerDialogRef,
  };

  const [dialogStack, setDialogStack] = useState<string[]>([]);
  const zIndexRef = useRef<Record<string, number>>({
    claudecode: 0,
    gmail: 0,
    ubuntusoftware: 0,
    filemanager: 0,
  });

  useEffect(() => {
    dialogStack.forEach((dialog, index) => {
      zIndexRef.current[dialog] = (index + 1) * 10;
    });

    (Object.keys(applicationToRefRelation) as ApplicationName[]).forEach(
      (appName) => {
        if (applicationToRefRelation[appName].current) {
          applicationToRefRelation[appName].current!.style.zIndex =
            `${zIndexRef.current[appName]}`;
        }
      },
    );
  }, [dialogStack]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (openClaudeCodeDialogRef.current) {
      openClaudeCodeDialogRef.current.show();
      setDialogStack((prevStack) => {
        const newStack = prevStack.filter((app) => app !== "claudecode");
        return [...newStack, "claudecode"];
      });
    }
  }, [openClaudeCodeDialogRef]);

  const handleDialogPopUp = (dialog: string | undefined) => {
    const appName = dialog?.toLowerCase().replace(" ", "") as ApplicationName;

    setDialogStack((prevStack) => {
      const newStack = prevStack.filter((app) => app !== appName);
      return [...newStack, appName];
    });

    if (applicationToRefRelation[appName].current) {
      applicationToRefRelation[appName].current.show();
    }
  };

  const closeDialog = (
    dialogRef: React.ForwardedRef<HTMLDialogElement>,
    dialogName: string,
  ) => {
    setDialogStack((prevStack) =>
      prevStack.filter((app) => app !== dialogName),
    );
    zIndexRef.current[dialogName] = 0;

    if (dialogRef && "current" in dialogRef) {
      dialogRef.current?.close();
    }
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
        <ClaudeCodeWindow ref={openClaudeCodeDialogRef} onClose={closeDialog} />
        <UbuntuSoftwareDialog
          ref={openUbuntuSoftwareDialogRef}
          onClose={closeDialog}
        />
        <FileManagerDialog
          ref={openFileManagerDialogRef}
          onClose={closeDialog}
        />
        <GmailDialog ref={openGmailDialogRef} onClose={closeDialog} />
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
