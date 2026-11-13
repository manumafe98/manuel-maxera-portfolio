import { profile } from "@/content/portfolio";
import { useId } from "react";
import "./contact.css";
import { useContactForm } from "./useContactForm";

interface ContactFormProps {
  /** Extra classes for the frame, such as the phone's card. */
  className?: string;
}

/**
 * The contact form, shared by the Gmail window and the phone contact card:
 * labelled fields with their errors, Send, the send notice, a mailto line
 * and the privacy note.
 */
export const ContactForm = ({ className = "" }: ContactFormProps) => {
  const {
    senderEmail,
    setSenderEmail,
    message,
    setMessage,
    sending,
    errors,
    notice,
    emailRef,
    messageRef,
    onSubmit,
  } = useContactForm();
  const id = useId();

  return (
    <form
      noValidate
      aria-label="Contact Manuel"
      className={`cc-contact ${className}`}
      onSubmit={onSubmit}
    >
      <label htmlFor={`${id}-email`}>Your email</label>
      <input
        ref={emailRef}
        id={`${id}-email`}
        type="email"
        autoComplete="email"
        placeholder="email@example.com"
        value={senderEmail}
        aria-invalid={errors.email ? true : undefined}
        aria-describedby={errors.email ? `${id}-email-error` : undefined}
        onChange={(event) => setSenderEmail(event.target.value)}
      />
      {errors.email && (
        <p id={`${id}-email-error`} className="cc-contact-error">
          {errors.email}
        </p>
      )}
      <label htmlFor={`${id}-message`}>Message</label>
      <textarea
        ref={messageRef}
        id={`${id}-message`}
        rows={4}
        placeholder="Hi Manuel, …"
        value={message}
        aria-invalid={errors.message ? true : undefined}
        aria-describedby={errors.message ? `${id}-message-error` : undefined}
        onChange={(event) => setMessage(event.target.value)}
      />
      {errors.message && (
        <p id={`${id}-message-error`} className="cc-contact-error">
          {errors.message}
        </p>
      )}
      <button type="submit" className="cc-contact-send" disabled={sending}>
        {sending ? "Sending…" : "Send"}
      </button>
      {/* The status region stays in the page so screen readers announce
          the success text when it appears; a failure is an alert. */}
      <div role="status">
        {notice?.success && (
          <p className="cc-contact-notice is-success">{notice.text}</p>
        )}
      </div>
      {notice && !notice.success && (
        <p role="alert" className="cc-contact-notice is-error">
          {notice.text}
        </p>
      )}
      <p className="cc-contact-note">
        Prefer your mail app?{" "}
        <a href={`mailto:${profile.email}`} className="cc-touch-link">
          Email {profile.email}
        </a>
      </p>
      <p className="cc-contact-note">
        Your email is only used to reply.{" "}
        <a href="/privacy" className="cc-touch-link">
          Privacy policy
        </a>
      </p>
    </form>
  );
};
