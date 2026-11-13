/** Props every App window (and Claude Code) takes from the Desktop. */
export interface WindowProps {
  open: boolean;
  /** Stacking order among the open windows; higher is in front. */
  zIndex: number;
  onClose: () => void;
  /** Brings the window to the front. */
  onFocus: () => void;
}
