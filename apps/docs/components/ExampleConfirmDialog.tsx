'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@enterwell/react-ui';
import { Box, Button } from '@mui/material';

export function ExampleConfirmDialog() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open confirm dialog</Button>

            {/* // @highlight-start */}
            <ConfirmDialog
                isOpen={isOpen}
                header='Confirm'
                message='Are you sure you want to proceed with the operation?'
                onCancel={() => setIsOpen(false)}
                onConfirm={() => setIsOpen(false)}>
                <Box component='ul' sx={{ listStyleType: 'disc', pl: 3 }}>
                    <li>Your changes will be saved.</li>
                    <li>Shared views will show the updated information.</li>
                </Box>
            </ConfirmDialog>
            {/* // @highlight-end */}
        </>
    )
}
