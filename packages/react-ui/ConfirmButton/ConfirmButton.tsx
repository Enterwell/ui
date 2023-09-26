import { ConfirmDialog, type ConfirmDialogProps } from '../ConfirmDialog';
import { useState } from 'react';
import { Button, type ButtonProps } from '@mui/material';

/**
 * The keys of the {@link ConfirmDialog} props that are destructured from shared props.
 * @public
 */
export type DialogDestructuredPropKeys = "header" | "onConfirm" | "message" | "color" | "confirmButtonText";

/**
 * The props of the {@link ConfirmButton} component.
 * @public
 */
export type ConfirmButtonProps =
  Omit<ButtonProps, "onClick"> &
  Pick<ConfirmDialogProps, DialogDestructuredPropKeys> &
  {
    onConfirm?: () => void;
    slots?: {
      // Omit already used props and shared props, re-add color so we can 
      // specify different color for the dialog than the button
      dialog?: Omit<ConfirmDialogProps, "isOpen" | "onCancel" | DialogDestructuredPropKeys> & { color?: ConfirmDialogProps["color"] }
    }
  };

/**
 * A button that opens a confirm dialog when clicked.
 * @param props - The props of the component.
 * @returns The component.
 * @public
 */
export function ConfirmButton({
  header, message, confirmButtonText, color, onConfirm, slots, ...rest
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm?.();
  };

  return (
    <>
      <Button color={color} {...rest} onClick={() => setOpen(true)} />
      <ConfirmDialog
        isOpen={open}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        header={header}
        message={message}
        color={color}
        confirmButtonText={confirmButtonText}
        {...(slots?.dialog ?? {})} />
    </>
  );
};
