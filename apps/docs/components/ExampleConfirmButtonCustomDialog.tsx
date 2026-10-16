'use client';

import { useState } from 'react';
import { ConfirmButton, type ConfirmDialogProps } from '@enterwell/react-ui';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';

function CustomConfirmDialog({
    isOpen,
    header,
    message,
    children,
    color = 'primary',
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    onConfirm,
    onCancel,
    ...dialogProps
}: ConfirmDialogProps) {
    return (
        <Dialog {...dialogProps} open={isOpen} onClose={onCancel}>
            <DialogTitle>{header}</DialogTitle>
            <DialogContent>
                {message && <Typography>{message}</Typography>}
                {children}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onCancel}>{cancelButtonText}</Button>
                <Button color={color} variant='contained' onClick={onConfirm}>
                    {confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export function ExampleConfirmButtonCustomDialog() {
    const [confirmations, setConfirmations] = useState(0);

    return (
        <Stack spacing={2} alignItems='center'>
            {/* // @highlight-start */}
            <ConfirmButton
                variant='outlined'
                header='Apply these changes?'
                confirmButtonText='Apply'
                onConfirm={() => setConfirmations((count) => count + 1)}
                slots={{ dialog: CustomConfirmDialog }}
                slotProps={{
                    dialog: {
                        maxWidth: 'md',
                        fullWidth: true,
                        children: <Typography>Review your changes before applying them.</Typography>,
                    },
                }}
            >
                Review changes
            </ConfirmButton>
            {/* // @highlight-end */}
            <Typography role='status'>Confirmed {confirmations} times.</Typography>
            <Typography variant='body2'>Cancel or press Escape to close without confirming.</Typography>
        </Stack>
    );
}
