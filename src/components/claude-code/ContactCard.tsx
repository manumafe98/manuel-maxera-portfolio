import { useContactForm } from "@/contact/useContactForm";
import { profile } from "@/content/portfolio";
import { useId } from "react";

/** The contact form as a card inside the Chat, for phones. */
export const ContactCard = () => {
  const {
    senderEmail,
    setSenderEmail,
    message,
    setMessage,
    sending,
    notice,
    onSubmit,
  } = useContactForm();
  const id = useId();

  return (
    <form
      noValidate
      aria-label="Contact Manuel"
      className="cc-card cc-contact"
      onSubmit={onSubmit}
    >
      <label htmlFor={`${id}-email`}>Your email</label>
      <input
        id={`${id}-email`}
        type="email"
        autoComplete="email"
        placeholder="email@example.com"
        value={senderEmail}
        onChange={(event) => setSenderEmail(event.target.value)}
      />
      <label htmlFor={`${id}-message`}>Message</label>
      <textarea
        id={`${id}-message`}
        rows={4}
        placeholder="Hi Manuel, …"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button type="submit" className="cc-contact-send" disabled={sending}>
        {sending ? "Sending…" : "Send"}
      </button>
      {notice && (
        <p
          role={notice.success ? "status" : "alert"}
          className={`cc-contact-notice ${notice.success ? "is-success" : "is-error"}`}
        >
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
