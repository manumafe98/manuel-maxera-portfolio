import { ActivitiesBar } from "@/components/ActivitiesBar";
import { ApplicationsMenu } from "@/components/ApplicationsMenu";
import { CloseDialog } from "@/components/CloseDialog";
import { FileManagerDialog } from "@/components/FileManagerDialog";
import { GmailDialog } from "@/components/GmailDialog";
import { SublimeDialog } from "@/components/SublimeDialog";
import { UbuntuSoftwareDialog } from "@/components/UbuntuSoftwareDialog";
import { VsCodeDialog } from "@/components/VsCodeDialog";
import { LeftArrowIcon, RightArrowIcon, UnfilledArrowRightIcon } from "@/icons";
import jammy_wallpaper from "@/static/media/jammy_wallpaper.webp";
import "cally";
import { RefObject, useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const HomePage = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth < 1024,
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [calendarDay, setCalendarDay] = useState<string>("");
  const openGmailDialogRef = useRef<HTMLDialogElement>(null);
  const openUbuntuSoftwareDialogRef = useRef<HTMLDialogElement>(null);
  const openTerminalDialogRef = useRef<HTMLDialogElement>(null);
  const openSublimeDialogRef = useRef<HTMLDialogElement>(null);
  const openVsCodeDialogRef = useRef<HTMLDialogElement>(null);
  const openFileManagerDialogRef = useRef<HTMLDialogElement>(null);
  const location = useLocation();

  const options = [
    "About Me",
    "Professional Experience",
    "My Projects",
    "My Skills",
    "Contact Me",
  ];

  type ApplicationName =
    | "gmail"
    | "terminal"
    | "sublime"
    | "ubuntusoftware"
    | "filemanager"
    | "vscode";

  const applicationToRefRelation: Record<
    ApplicationName,
    RefObject<HTMLDialogElement | null>
  > = {
    gmail: openGmailDialogRef,
    terminal: openTerminalDialogRef,
    sublime: openSublimeDialogRef,
    ubuntusoftware: openUbuntuSoftwareDialogRef,
    filemanager: openFileManagerDialogRef,
    vscode: openVsCodeDialogRef,
  };

  const [dialogStack, setDialogStack] = useState<string[]>([]);
  const [zIndex, setZIndex] = useState<Record<string, number>>({
    terminal: 0,
    sublime: 0,
    vscode: 0,
    gmail: 0,
    ubuntusoftware: 0,
    filemanager: 0,
  });

  useEffect(() => {
    const newZIndex: Record<string, number> = {};
    dialogStack.forEach((dialog, index) => {
      newZIndex[dialog] = (index + 1) * 10;
    });

    setZIndex((prevZIndex) => ({
      ...prevZIndex,
      ...newZIndex,
    }));
  }, [dialogStack]);

  useEffect(() => {
    (Object.keys(applicationToRefRelation) as ApplicationName[]).forEach(
      (appName) => {
        if (applicationToRefRelation[appName].current) {
          applicationToRefRelation[appName].current!.style.zIndex =
            `${zIndex[appName]}`;
        }
      },
    );
  }, [zIndex]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleArrowFunctionality = (
    event: KeyboardEvent,
    arrowType: string,
  ) => {
    event.preventDefault();
    const index =
      arrowType === "Up"
        ? (selectedIndex - 1 + options.length) % options.length
        : (selectedIndex + 1) % options.length;
    setSelectedIndex(index);
  };

  const handleArrowKeyPress = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      handleArrowFunctionality(event, "Down");
    } else if (event.key === "ArrowUp") {
      handleArrowFunctionality(event, "Up");
    }
  };

  const handleEnterKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const app = options[selectedIndex];
      switch (app) {
        case "About Me":
          openSublimeDialogRef.current?.show();
          setDialogStack((prevStack) => [...prevStack, "sublime"]);
          break;
        case "Professional Experience":
          openVsCodeDialogRef.current?.show();
          setDialogStack((prevStack) => [...prevStack, "vscode"]);
          break;
        case "My Projects":
          openUbuntuSoftwareDialogRef.current?.show();
          setDialogStack((prevStack) => [...prevStack, "ubuntusoftware"]);
          break;
        case "My Skills":
          openFileManagerDialogRef.current?.show();
          setDialogStack((prevStack) => [...prevStack, "filemanager"]);
          break;
        case "Contact Me":
          openGmailDialogRef.current?.show();
          setDialogStack((prevStack) => [...prevStack, "gmail"]);
          break;
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleArrowKeyPress(event);
      handleEnterKeyPress(event);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  useEffect(() => {
    if (openTerminalDialogRef.current) {
      openTerminalDialogRef.current.show();
      setDialogStack((prevStack) => {
        const newStack = prevStack.filter((app) => app !== "terminal");
        return [...newStack, "terminal"];
      });
    }
  }, [openTerminalDialogRef]);

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
    setZIndex((prevZIndex) => ({
      ...prevZIndex,
      [dialogName]: 0,
    }));

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

  const closeTerminalDialog = () => {
    closeDialog(openTerminalDialogRef, "terminal");
  };

  const CalendarDate = "calendar-date" as any;
  const CalendarMonth = "calendar-month" as any;

  return (
    <>
      {isSmallScreen && (
        <Navigate to="/unavailable" state={{ from: location }} replace />
      )}
      <section className="h-screen w-screen overflow-hidden relative">
        <dialog
          ref={openTerminalDialogRef}
          className="dialog-container min-h-[50vh] min-w-[40vw] max-xl:min-w-[60vw] bg-ubuntu-terminal-bg focus:outline-none"
        >
          <div className="flex items-center justify-between w-full h-10 bg-ubuntu-navbar rounded-t-lg border-b border-solid border-black">
            <div className="w-6 h-6 mx-3">
              <span className="hidden">hidden</span>
            </div>
            <span className="text-white font-bold">/bin/bash</span>
            <CloseDialog
              closeDialog={closeTerminalDialog}
              buttonExtraStyles="mx-3 bg-gray-50/20 hover:bg-gray-50/15"
              svgCustomStyle={undefined}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex">
              <div className="flex items-center justify-center h-5 w-36 bg-ubuntu-options">
                <span className="text-white mx-3">manuel@Ubuntu</span>
              </div>
              <div className="flex items-center justify-center h-5 w-8 bg-ubuntu-terminal-select">
                <span>~</span>
              </div>
              <div className="w-0 h-0 border-l-[12px] border-l-ubuntu-terminal-select border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent"></div>
              <span className="text-white mx-2">sh ./start_portfolio</span>
            </div>
            <div className="flex gap-2 ml-1">
              <span className="text-green-500">?</span>
              <span className="text-white font-bold">
                Please select an option:
              </span>
              <span className="text-white opacity-60">
                (use arrow keys and enter)
              </span>
            </div>
            <div className="flex flex-col">
              {options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center italic ${
                    selectedIndex === index
                      ? "text-blue-500"
                      : "text-white ml-5 opacity-80"
                  }`}
                >
                  {selectedIndex === index && (
                    <UnfilledArrowRightIcon className="fill-current text-blue-500 w-5 h-5" />
                  )}
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>
        </dialog>
        <VsCodeDialog ref={openVsCodeDialogRef} onClose={closeDialog} />
        <SublimeDialog ref={openSublimeDialogRef} onClose={closeDialog} />
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
