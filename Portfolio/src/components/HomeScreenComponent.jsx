import "cally";
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  LeftArrowIcon,
  RightArrowIcon,
  UnfilledArrowRightIcon,
  XMarkIcon,
} from "../constants/Icons";
import jammy_wallpaper from "../static/media/jammy_wallpaper.webp";
import { ActivitiesBarComponent } from "./ActivitiesBarComponent";
import { ApplicationsMenuComponent } from "./ApplicationsMenuComponent";
import { FileManagerDialogComponent } from "./FileManagerDialogComponent";
import { GmailDialogComponent } from "./GmailDialogComponent";
import { SublimeDialogComponent } from "./SublimeDialogComponent";
import { UbuntuSoftwareDialogComponent } from "./UbuntuSoftwareDialogComponent";
import { VsCodeDialogComponent } from "./VsCodeDialogComponent";

export const HomeScreenComponent = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarDay, setCalendarDay] = useState("");
  const openGmailDialogRef = useRef(null);
  const openUbuntuSoftwareDialogRef = useRef(null);
  const openTerminalDialogRef = useRef(null);
  const openSublimeDialogRef = useRef(null);
  const openVsCodeDialogRef = useRef(null);
  const openFileManagerDialogRef = useRef(null);
  const location = useLocation();

  const options = [
    "About Me",
    "Professional Experience",
    "My Projects",
    "My Skills",
    "Contact Me",
  ];
  const applicationToRefRelation = {
    gmail: openGmailDialogRef,
    terminal: openTerminalDialogRef,
    sublime: openSublimeDialogRef,
    ubuntusoftware: openUbuntuSoftwareDialogRef,
    filemanager: openFileManagerDialogRef,
    vscode: openVsCodeDialogRef,
  };

  const [dialogStack, setDialogStack] = useState([]);
  const [zIndex, setZIndex] = useState({
    terminal: 0,
    sublime: 0,
    vscode: 0,
    gmail: 0,
    ubuntusoftware: 0,
    filemanager: 0,
  });

  useEffect(() => {
    const newZIndex = {};
    dialogStack.forEach((dialog, index) => {
      newZIndex[dialog] = (index + 1) * 10;
    });

    setZIndex((prevZIndex) => ({
      ...prevZIndex,
      ...newZIndex,
    }));
  }, [dialogStack]);

  useEffect(() => {
    Object.keys(applicationToRefRelation).forEach((appName) => {
      if (applicationToRefRelation[appName].current) {
        applicationToRefRelation[appName].current.style.zIndex =
          zIndex[appName];
      }
    });
  }, [zIndex]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleArrowFunctionality = (event, arrowType) => {
    event.preventDefault();
    const index =
      arrowType === "Up"
        ? (selectedIndex - 1 + options.length) % options.length
        : (selectedIndex + 1) % options.length;
    setSelectedIndex(index);
  };

  const handleArrowKeyPress = (event) => {
    if (event.key === "ArrowDown") {
      handleArrowFunctionality(event, "Down");
    } else if (event.key === "ArrowUp") {
      handleArrowFunctionality(event, "Up");
    }
  };

  const handleEnterKeyPress = (event) => {
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
    const handleKeyDown = (event) => {
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

  const handleDialogPopUp = (dialog) => {
    const appName = dialog.toLowerCase().replace(" ", "");

    setDialogStack((prevStack) => {
      const newStack = prevStack.filter((app) => app !== appName);
      return [...newStack, appName];
    });

    if (applicationToRefRelation[appName].current) {
      applicationToRefRelation[appName].current.show();
    }
  };

  const closeDialog = (dialogRef, dialogName) => {
    setDialogStack((prevStack) =>
      prevStack.filter((app) => app !== dialogName)
    );
    setZIndex((prevZIndex) => ({
      ...prevZIndex,
      [dialogName]: 0,
    }));

    dialogRef.current?.close();
  };

  const handleCalendarClick = (isCalendarOpen, calendarValue) => {
    setCalendarOpen(isCalendarOpen);
    if (calendarValue) {
      const formattedDate = new Date(calendarValue).toISOString().split("T")[0];
      setCalendarDay(formattedDate);
    }
  };

  return (
    <>
      {isSmallScreen && (
        <Navigate to="/unavailable" state={{ from: location }} replace />
      )}
      <section className="h-screen w-screen overflow-hidden relative">
        <dialog
          ref={openTerminalDialogRef}
          className="dialog-container min-h-[50vh] min-w-[40vw] max-xl:min-w-[60vw] bg-ubuntu-terminal-bg"
        >
          <div className="flex items-center justify-between w-full h-10 bg-ubuntu-navbar rounded-t-lg border-b border-solid border-black">
            <div className="w-6 h-6 mx-3">
              <span className="hidden">hidden</span>
            </div>
            <span className="text-white font-bold">/bin/bash</span>
            <button
              className="flex items-center justify-center w-6 h-6 rounded-full mx-3 bg-gray-50/20 hover:bg-gray-50/15"
              onClick={() => closeDialog(openTerminalDialogRef, "terminal")}
            >
              <XMarkIcon className="white-icon w-4 h-4" />
            </button>
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
        <VsCodeDialogComponent
          ref={openVsCodeDialogRef}
          onClose={closeDialog}
        />
        <SublimeDialogComponent
          ref={openSublimeDialogRef}
          onClose={closeDialog}
        />
        <UbuntuSoftwareDialogComponent
          ref={openUbuntuSoftwareDialogRef}
          onClose={closeDialog}
        />
        <FileManagerDialogComponent
          ref={openFileManagerDialogRef}
          onClose={closeDialog}
        />
        <GmailDialogComponent ref={openGmailDialogRef} onClose={closeDialog} />
        <ActivitiesBarComponent openCalendar={handleCalendarClick} />
        <ApplicationsMenuComponent openIconDialog={handleDialogPopUp} />
        <img
          src={jammy_wallpaper}
          alt="Ubuntu Jammy Wallpaper"
          className="w-full h-full object-cover"
        />
        {calendarOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 top-12 z-50">
            <div className="bg-ubuntu-navbar text-white rounded-xl p-5 shadow-lg border border-gray-600">
              <calendar-date value={calendarDay}>
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
                <calendar-month></calendar-month>
              </calendar-date>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
