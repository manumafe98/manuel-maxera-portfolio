import { profile } from "@/content/portfolio";
import { useEffect, useRef, useState, type FormEvent } from "react";

const validEmailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

/** How long a success or error notice stays on screen. */
const NOTICE_MS = 6000;

export interface ContactNotice {
  text: string;
  success: boolean;
}

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

/**
 * The contact form shared by the Gmail window and the phone contact card:
 * its fields, validation, EmailJS sending and the notice it reports.
 */
export const useContactForm = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<ContactNotice | null>(null);
  const hideNotice = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(hideNotice.current), []);

  const notify = (text: string, success: boolean) => {
    setNotice({ text, success });
    clearTimeout(hideNotice.current);
    hideNotice.current = setTimeout(() => setNotice(null), NOTICE_MS);
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

  return {
    senderEmail,
    setSenderEmail,
    message,
    setMessage,
    sending,
    notice,
    /** The form's submit handler. */
    onSubmit: (event: FormEvent) => {
      event.preventDefault();
      sendEmail();
    },
  };
};
