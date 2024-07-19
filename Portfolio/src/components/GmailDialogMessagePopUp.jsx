import { CheckMarkIcon, DialogXMarkIcon } from "../constants/Icons";

export const GmailDialogMessagePopUp = ({ text, success = true }) => {
  return (
    <div
      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 my-4 px-4 py-2 rounded-xl shadow-lg transition-opacity duration-300 border-1 border-solid border-main-gray"
    >
      <span className="flex items-center gap-2">
        {success ? (
          <>
            <CheckMarkIcon className="fill-current text-green-700 w-5 h-5"/> {text}
          </>
        ) : (
          <>
            <DialogXMarkIcon className="fill-current text-red-600 w-5 h-5"/> {text}
          </>
        )}
      </span>
    </div>
  )
}
