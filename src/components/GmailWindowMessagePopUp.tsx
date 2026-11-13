import { CheckMarkIcon, CircleXMarkIcon } from "@/icons";

interface GmailWindowMessagePopUpProps {
  text: string;
  success: boolean;
}

export const GmailWindowMessagePopUp = ({
  text,
  success,
}: GmailWindowMessagePopUpProps) => {
  const Icon = success ? CheckMarkIcon : CircleXMarkIcon;

  return (
    <div
      role={success ? "status" : "alert"}
      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 my-4 px-4 py-2 rounded-xl shadow-lg transition-opacity duration-300 border-1 border-solid border-main-gray"
    >
      <span className="flex items-center gap-2">
        <Icon
          aria-hidden="true"
          className={`fill-current w-5 h-5 ${success ? "text-green-700" : "text-red-600"}`}
        />{" "}
        {text}
      </span>
    </div>
  );
};
