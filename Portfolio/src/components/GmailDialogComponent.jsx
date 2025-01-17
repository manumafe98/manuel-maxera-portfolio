import emailjs from "@emailjs/browser";
import { forwardRef, useState } from "react";
import { XMarkIcon } from "../constants/Icons";
import { GmailDialogMessagePopUp } from "./GmailDialogMessagePopUp";

export const GmailDialogComponent = forwardRef((props, ref) => {
  const { onClose } = props;
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [gmailDialogPopUpData, setGmailDialogPopupData] = useState({
    text: "",
    success: true,
  });
  const [showGmailDialogNotification, setShowGmailDialogNotification] =
    useState(false);
  const validEmailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  const sendEmail = async () => {
    const isValid = checkValidForm();

    if (isValid) {
      const templateParams = {
        from_email: senderEmail,
        message: message,
      };

      try {
        await emailjs.send(
          import.meta.env.EMAILJS_SERVICE_ID,
          import.meta.env.EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.EMAILJS_USER_PUBLIC_KEY
        );
        handleGmailMessagePopUp("Email Sent", true);
      } catch (error) {
        console.log("FAILED...", error);
      }
    }
  };

  const checkValidForm = () => {
    if (!validEmailRegex.test(senderEmail.trim())) {
      handleGmailMessagePopUp("Ivalid email address", false);
      return false;
    } else if (!message.trim()) {
      handleGmailMessagePopUp("Invalid message", false);
      return false;
    }

    return true;
  };

  const handleGmailMessagePopUp = (text, success) => {
    setShowGmailDialogNotification(true);
    setGmailDialogPopupData({ text, success });
    setTimeout(() => setShowGmailDialogNotification(false), 4000);
  };

  const closeGmailDialog = () => {
    onClose(ref, "gmail");
  };

  return (
    <dialog
      ref={ref}
      className="dialog-container min-h-[50vh] min-w-[40vw] max-xl:min-w-[60vw] p-5"
    >
      <button
        className="flex items-center justify-center w-6 h-6 hover:bg-zinc-100 rounded-full hover:shadow absolute right-5 top-4"
        onClick={closeGmailDialog}
      >
        <XMarkIcon className="fill-current text-ubuntu-main w-4 h-4" />
      </button>
      <div className="flex flex-col justify-center items-center mt-10">
        <span className="text-ubuntu-main text-2xl font-bold mb-10">
          Contact Me
        </span>
        <div className="flex flex-col w-4/6">
          <input
            placeholder="email@example.com"
            type="text"
            value={senderEmail}
            className="w-full h-9 mb-2 p-2 border border-solid border-main-gray shadow-md rounded-xl focus:outline-none focus:ring-1 focus:ring-ubuntu-focus focus:border-ubuntu-focus"
            onChange={(e) => setSenderEmail(e.target.value)}
          />
          <textarea
            placeholder="message"
            value={message}
            className="w-full h-32 mb-2 p-2 border border-solid border-main-gray shadow-md rounded-xl resize-none placeholder-top-left focus:outline-none focus:ring-1 focus:ring-ubuntu-focus focus:border-ubuntu-focus"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="h-9 text-white rounded-xl bg-ubuntu-main w-full hover:bg-ubuntu-focus"
            onClick={sendEmail}
          >
            Send
          </button>
        </div>
      </div>
      {showGmailDialogNotification && (
        <GmailDialogMessagePopUp
          text={gmailDialogPopUpData.text}
          success={gmailDialogPopUpData.success}
        />
      )}
    </dialog>
  );
});
