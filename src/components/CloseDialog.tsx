import { XMarkIcon } from "@/icons";

interface CloseDialogProps {
  closeDialog: () => void;
  buttonExtraStyles: string;
  svgCustomStyle: string | undefined;
}

export const CloseDialog = ({
  closeDialog,
  buttonExtraStyles,
  svgCustomStyle,
}: CloseDialogProps) => {
  return (
    <button
      className={`flex items-center justify-center w-6 h-6 rounded-full focus:outline-none ${buttonExtraStyles}`}
      onClick={closeDialog}
    >
      <XMarkIcon className={svgCustomStyle ?? `white-icon w-4 h-4`} />
    </button>
  );
};
