import file_manager from "@/assets/file_manager.webp";
import software_store from "@/assets/software_store.webp";
import type { AppWindowId } from "@/content/portfolio";
import { GmailIcon } from "@/icons";
import type { WindowProps } from "@/types/window.types";
import {
  lazy,
  type ComponentType,
  type LazyExoticComponent,
  type SVGProps,
} from "react";

interface AppWindow {
  /** The dock button that opens the window. */
  dock:
    | { label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }
    | { label: string; imgSrc: string };
  /** The window on the Desktop. */
  Window: LazyExoticComponent<ComponentType<WindowProps>>;
  /** The same content as a card inside the Chat, for phones. */
  Card: LazyExoticComponent<ComponentType>;
}

/**
 * Every App window, in dock order. Windows and cards load on first use, so
 * they stay out of the initial bundle.
 */
export const appWindows: Record<AppWindowId, AppWindow> = {
  gmail: {
    dock: { label: "Contact Me", icon: GmailIcon },
    Window: lazy(() =>
      import("./GmailWindow").then((m) => ({ default: m.GmailWindow })),
    ),
    Card: lazy(() =>
      import("./claude-code/ContactCard").then((m) => ({
        default: m.ContactCard,
      })),
    ),
  },
  "ubuntu-software": {
    dock: { label: "My Projects", imgSrc: software_store },
    Window: lazy(() =>
      import("./UbuntuSoftwareWindow").then((m) => ({
        default: m.UbuntuSoftwareWindow,
      })),
    ),
    Card: lazy(() =>
      import("./claude-code/ProjectsCard").then((m) => ({
        default: m.ProjectsCard,
      })),
    ),
  },
  files: {
    dock: { label: "My Skills", imgSrc: file_manager },
    Window: lazy(() =>
      import("./FileManagerWindow").then((m) => ({
        default: m.FileManagerWindow,
      })),
    ),
    Card: lazy(() =>
      import("./claude-code/TechSkillsCard").then((m) => ({
        default: m.TechSkillsCard,
      })),
    ),
  },
};

export const appWindowIds = Object.keys(appWindows) as AppWindowId[];
