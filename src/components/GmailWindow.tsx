import { useContactForm } from "@/contact/useContactForm";
import type { WindowProps } from "@/types/window.types";
import { CloseWindowButton } from "./CloseWindowButton";
import { GmailWindowMessagePopUp } from "./GmailWindowMessagePopUp";

export const GmailWindow = ({
  open,
  zIndex,
  onClose,
  onFocus,
}: WindowProps) => {
  const {
    senderEmail,
    setSenderEmail,
    message,
    setMessage,
    sending,
    notice,
    onSubmit,
  } = useContactForm();

  return (
    <dialog
      open={open}
      style={{ zIndex }}
      onPointerDown={onFocus}
      aria-label="Gmail"
      className="window-frame min-h-[50vh] min-w-[40vw] max-xl:min-w-[60vw] p-5"
    >
      <CloseWindowButton
        onClose={onClose}
        className="hover:bg-zinc-100 hover:shadow absolute right-5 top-4"
        iconClassName="fill-current text-ubuntu-main w-4 h-4"
        label="Close Gmail"
      />
      <div className="flex flex-col justify-center items-center mt-10">
        <span className="text-ubuntu-main text-2xl font-bold mb-10">
          Contact Me
        </span>
        <form noValidate className="flex flex-col w-4/6" onSubmit={onSubmit}>
          <input
            aria-label="Your email"
            placeholder="email@example.com"
            type="email"
            autoComplete="email"
            value={senderEmail}
            className="w-full h-9 mb-2 p-2 border border-solid border-main-gray shadow-md rounded-xl focus:outline-none focus:ring-1 focus:ring-ubuntu-focus focus:border-ubuntu-focus"
            onChange={(e) => setSenderEmail(e.target.value)}
          />
          <textarea
            aria-label="Message"
            placeholder="message"
            value={message}
            className="w-full h-32 mb-2 p-2 border border-solid border-main-gray shadow-md rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-ubuntu-focus focus:border-ubuntu-focus"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={sending}
            className="h-9 text-white rounded-xl bg-ubuntu-main w-full hover:bg-ubuntu-focus disabled:opacity-60"
          >
            {sending ? "Sending…" : "Send"}
          </button>
          <p className="mt-3 text-sm text-gray-600">
            Your email is only used to reply.{" "}
            <a href="/privacy" className="underline hover:text-ubuntu-main">
              Privacy policy
            </a>
          </p>
        </form>
      </div>
      {notice && (
        <GmailWindowMessagePopUp text={notice.text} success={notice.success} />
      )}
    </dialog>
  );
};
