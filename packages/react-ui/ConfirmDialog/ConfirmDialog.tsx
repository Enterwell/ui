import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  type DialogProps,
  type ButtonProps,
} from '@mui/material';
import { Stack } from '@mui/system';

/**
 * The confirm dialog props type.
 * @public
 */
export type ConfirmDialogProps = Omit<DialogProps, "open" | "onClose" | "color"> & {
  isOpen: boolean;
  header: string;
  message?: string;
  color?: ButtonProps["color"];
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * The confirm dialog component.
 * 
 * @param props - The props.
 * @returns The confirm dialog.
 * @public
 */
export function ConfirmDialog({
  isOpen,
  header,
  message,
  maxWidth = "xs",
  color = "primary",
  confirmButtonText = "Potvrdi",
  cancelButtonText = "Odustani",
  onConfirm,
  onCancel,
  ...rest
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} maxWidth={maxWidth} {...rest}>
      <DialogContent>
        <Stack spacing={2} paddingX={3}>
          <Typography variant="h2" textAlign="center" paddingTop={4}>{header}</Typography>
          {message && <Typography color="textSecondary" textAlign="center">{message}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button color="secondary" autoFocus onClick={onCancel} fullWidth>
          {cancelButtonText}
        </Button>
        <Button color={color} variant="contained" onClick={onConfirm} fullWidth>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
