import { useState } from 'react';
import { ConfirmDialog } from '@enterwell/react-ui';
import { Button } from '@mui/material';

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
                onConfirm={() => setIsOpen(false)} />
            {/* // @highlight-end */}
        </>
    )
}