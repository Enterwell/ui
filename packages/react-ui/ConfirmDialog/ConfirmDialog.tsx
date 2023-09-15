import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  type DialogProps,
} from '@mui/material';
import { Stack } from '@mui/system';
import { ComponentProps } from 'react';

/**
 * The confirm dialog props type.
 * @public
 */
export type ConfirmDialogProps = Omit<DialogProps, "open" | "onClose" | "color"> & {
  isOpen: boolean;
  header: string;
  message?: string;
  color?: ComponentProps<typeof Button>['color'];
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
  fullWidth = true,
  color = "primary",
  confirmButtonText = "Potvrdi",
  cancelButtonText = "Odustani",
  onConfirm,
  onCancel,
  ...rest
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} {...rest}>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="h5" textAlign="center" paddingTop={4} paddingX={3}>{header}</Typography>
          {message && <Typography variant="body1" color="textSecondary" textAlign="center" paddingX={3}>{message}</Typography>}
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
