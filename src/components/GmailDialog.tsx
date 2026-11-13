import { profile } from "@/content/portfolio";
import type { DialogProps } from "@/types/dialog.types";
import { useEffect, useRef, useState } from "react";
import { CloseDialog } from "./CloseDialog";
import { GmailDialogMessagePopUp } from "./GmailDialogMessagePopUp";

const validEmailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

const sendWithEmailJs = async (fromEmail: string, message: string) => {
  // Loaded on first send, so EmailJS stays out of the initial bundle.
  const { default: emailjs } = await import("@emailjs/browser");
  await emailjs.send(
    import.meta.env.EMAILJS_SERVICE_ID,
    import.meta.env.EMAILJS_TEMPLATE_ID,
    { from_email: fromEmail, message },
    import.meta.env.EMAILJS_USER_PUBLIC_KEY,
  );
};

export const GmailDialog = ({
  open,
  zIndex,
  onClose,
  onFocus,
}: DialogProps) => {
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{
    text: string;
    success: boolean;
  } | null>(null);
  const hideNotice = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(hideNotice.current), []);

  const notify = (text: string, success: boolean) => {
    setNotice({ text, success });
    clearTimeout(hideNotice.current);
    hideNotice.current = setTimeout(() => setNotice(null), 6000);
  };

  const validationError = () => {
    if (!validEmailRegex.test(senderEmail.trim())) {
      return "Enter a valid email address, like name@example.com.";
    }
    if (!message.trim()) return "Write a message before sending.";
    return null;
  };

  const sendEmail = async () => {
    const error = validationError();
    if (error) {
      notify(error, false);
      return;
    }

    setSending(true);
    try {
      await sendWithEmailJs(senderEmail.trim(), message);
      notify("Message sent. Manuel will reply to your email.", true);
    } catch (error) {
      console.error("EmailJS send failed", error);
      notify(
        `Your message couldn't be sent. Try again, or email ${profile.email}.`,
        false,
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <dialog
      open={open}
      style={{ zIndex }}
      onPointerDown={onFocus}
      aria-label="Gmail"
      className="dialog-container min-h-[50vh] min-w-[40vw] max-xl:min-w-[60vw] p-5"
    >
      <CloseDialog
        closeDialog={onClose}
        buttonExtraStyles="hover:bg-zinc-100 hover:shadow absolute right-5 top-4"
        svgCustomStyle="fill-current text-ubuntu-main w-4 h-4"
        label="Close Gmail"
      />
      <div className="flex flex-col justify-center items-center mt-10">
        <span className="text-ubuntu-main text-2xl font-bold mb-10">
          Contact Me
        </span>
        <form
          noValidate
          className="flex flex-col w-4/6"
          onSubmit={(event) => {
            event.preventDefault();
            sendEmail();
          }}
        >
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
            className="w-full h-32 mb-2 p-2 border border-solid border-main-gray shadow-md rounded-xl resize-none placeholder-top-left focus:outline-none focus:ring-1 focus:ring-ubuntu-focus focus:border-ubuntu-focus"
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
        <GmailDialogMessagePopUp text={notice.text} success={notice.success} />
      )}
    </dialog>
  );
};
