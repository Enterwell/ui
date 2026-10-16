'use client';

import { useState } from 'react';
import { ConfirmButton } from '@enterwell/react-ui';
import { Box, Stack, Typography } from '@mui/material';

export function ExampleConfirmButtonContent() {
    const [confirmations, setConfirmations] = useState(0);

    return (
        <Stack spacing={2} alignItems='center'>
            {/* // @highlight-start */}
            <ConfirmButton
                color='error'
                variant='contained'
                header='Delete this item?'
                message='Deleting this item has the following consequences:'
                confirmButtonText='Delete'
                onConfirm={() => setConfirmations((count) => count + 1)}
                slotProps={{
                    dialog: {
                        cancelButtonText: 'Keep item',
                        children: (
                            <Box component='ul' sx={{ listStyleType: 'disc', pl: 3 }}>
                                <li>The item will be removed from the list.</li>
                                <li>Its saved preferences will be deleted.</li>
                            </Box>
                        ),
                    },
                }}
            >
                Delete item
            </ConfirmButton>
            {/* // @highlight-end */}
            <Typography role='status'>Confirmed {confirmations} times.</Typography>
            <Typography variant='body2'>Cancelling leaves the count unchanged.</Typography>
        </Stack>
    );
}
