import { ContactForm } from "@/contact/ContactForm";
import { GmailIcon } from "@/icons/GmailIcon";
import type { WindowProps } from "@/types/window.types";
import { CloseWindowButton } from "./CloseWindowButton";

export const GmailWindow = ({
  open,
  zIndex,
  onClose,
  onFocus,
}: WindowProps) => {
  return (
    <dialog
      open={open}
      style={{ zIndex }}
      onPointerDown={onFocus}
      aria-label="Gmail"
      className="window-frame cc-theme cc-gmail"
    >
      <header className="cc-titlebar">
        <div className="cc-title">
          <GmailIcon width={16} height={16} aria-hidden="true" />
          Gmail
        </div>
        <CloseWindowButton
          onClose={onClose}
          className="bg-gray-50/10 hover:bg-gray-50/20"
          label="Close Gmail"
        />
      </header>
      <div className="cc-gmail-body">
        <h2 className="cc-gmail-heading">Contact Me</h2>
        <ContactForm />
      </div>
    </dialog>
  );
};
