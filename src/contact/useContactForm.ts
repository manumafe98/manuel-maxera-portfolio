import { profile } from "@/content/portfolio";
import { useRef, useState, type FormEvent } from "react";

const validEmailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

/** A field of the contact form. */
export type ContactField = "email" | "message";

/** The result of the last send, shown under the Send button. */
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

/** The error of each invalid field, in form order. */
const fieldErrors = (senderEmail: string, message: string) => {
  const errors: Partial<Record<ContactField, string>> = {};
  if (!validEmailRegex.test(senderEmail.trim())) {
    errors.email = "Enter a valid email address, like name@example.com.";
  }
  if (!message.trim()) errors.message = "Write a message before sending.";
  return errors;
};

/**
 * The contact form's state: its fields, validation, EmailJS sending and the
 * notice it reports. On a validation error it focuses the first invalid field.
 */
export const useContactForm = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>(
    {},
  );
  const [notice, setNotice] = useState<ContactNotice | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const sendEmail = async () => {
    const found = fieldErrors(senderEmail, message);
    setErrors(found);
    setNotice(null);
    if (found.email) return emailRef.current?.focus();
    if (found.message) return messageRef.current?.focus();

    setSending(true);
    try {
      await sendWithEmailJs(senderEmail.trim(), message);
      // Keep the email for a follow-up, but clear the message so a second
      // click can't send it twice.
      setMessage("");
      setNotice({
        text: "Message sent. Manuel will reply to your email.",
        success: true,
      });
    } catch (error) {
      console.error("EmailJS send failed", error);
      setNotice({
        text: `Your message couldn't be sent. Try again, or email ${profile.email}.`,
        success: false,
      });
    } finally {
      setSending(false);
    }
  };

  /** Editing a field clears its error. */
  const clearError = (field: ContactField) =>
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });

  return {
    senderEmail,
    setSenderEmail: (value: string) => {
      setSenderEmail(value);
      clearError("email");
    },
    message,
    setMessage: (value: string) => {
      setMessage(value);
      clearError("message");
    },
    sending,
    errors,
    notice,
    emailRef,
    messageRef,
    /** The form's submit handler. */
    onSubmit: (event: FormEvent) => {
      event.preventDefault();
      void sendEmail();
    },
  };
};
