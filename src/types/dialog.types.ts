import { ForwardedRef } from "react";

export interface DialogProps {
  onClose: (
    dialogRef: ForwardedRef<HTMLDialogElement>,
    dialogName: string,
  ) => void;
}
