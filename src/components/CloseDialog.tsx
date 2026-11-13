import { XMarkIcon } from "@/icons";

interface CloseDialogProps {
  closeDialog: () => void;
  buttonExtraStyles: string;
  svgCustomStyle: string | undefined;
  /** Accessible name of the button, such as "Close Claude Code". */
  label?: string;
}

export const CloseDialog = ({
  closeDialog,
  buttonExtraStyles,
  svgCustomStyle,
  label = "Close",
}: CloseDialogProps) => {
  return (
    <button
      className={`flex items-center justify-center w-6 h-6 rounded-full focus:outline-none ${buttonExtraStyles}`}
      onClick={closeDialog}
      aria-label={label}
    >
      <XMarkIcon className={svgCustomStyle ?? `white-icon w-4 h-4`} />
    </button>
  );
};
