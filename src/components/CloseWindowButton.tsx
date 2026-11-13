import { XMarkIcon } from "@/icons/XMarkIcon";

interface CloseWindowButtonProps {
  onClose: () => void;
  className: string;
  /** Classes for the X icon. Defaults to a white 16px icon. */
  iconClassName?: string;
  /** Accessible name naming the window, such as "Close Claude Code". */
  label: string;
}

export const CloseWindowButton = ({
  onClose,
  className,
  iconClassName = "white-icon w-4 h-4",
  label,
}: CloseWindowButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center w-6 h-6 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ubuntu-orange ${className}`}
      onClick={onClose}
      aria-label={label}
    >
      <XMarkIcon aria-hidden="true" className={iconClassName} />
    </button>
  );
};
