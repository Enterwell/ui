import { Button, type ButtonProps, IconButton } from "@mui/material";
import { type ComponentType, useState } from "react";
import { ConfirmDialog, type ConfirmDialogProps } from "../ConfirmDialog";

/**
 * The keys of the {@link ConfirmDialog} props that are destructured from shared props.
 * @public
 */
export type DialogDestructuredPropKeys = "header" | "message" | "color" | "confirmButtonText";

/**
 * The props of the {@link ConfirmButton} component.
 * @public
 */
export type ConfirmButtonProps = Omit<ButtonProps, "onClick" | "slots" | "slotProps"> &
  Pick<ConfirmDialogProps, DialogDestructuredPropKeys> & {
    /**
     * @defaultValue `false`
     */
    iconButton?: boolean;
    /** Called after the dialog is confirmed and closed. */
    onConfirm?: () => void;
    /** Components used to render the confirmation dialog. */
    slots?: {
      /** @defaultValue ConfirmDialog */
      dialog?: ComponentType<ConfirmDialogProps>;
    };
    /** Dialog props override the shared defaults; open state and callbacks remain controlled. */
    slotProps?: {
      dialog?: Partial<Omit<ConfirmDialogProps, "isOpen" | "onConfirm" | "onCancel">>;
    };
  };

/**
 * A button that opens a confirm dialog when clicked.
 * @param props - The props of the component.
 * @returns The component.
 * @public
 */
export function ConfirmButton({
  header,
  message,
  confirmButtonText,
  color,
  iconButton = false,
  onConfirm,
  slots,
  slotProps,
  ...rest
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const DialogComponent = slots?.dialog ?? ConfirmDialog;

  const handleConfirm = () => {
    setOpen(false);
    onConfirm?.();
  };

  return (
    <>
      {iconButton ? (
        <IconButton color={color} {...rest} onClick={() => setOpen(true)} />
      ) : (
        <Button color={color} {...rest} onClick={() => setOpen(true)} />
      )}
      <DialogComponent
        header={header}
        message={message}
        color={color}
        confirmButtonText={confirmButtonText}
        {...slotProps?.dialog}
        isOpen={open}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
