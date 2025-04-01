'use client';

import { ConfirmButton } from '@enterwell/react-ui';

export function ExampleConfirmButton() {
    return (
        // @highlight-start
        <ConfirmButton
            color="error"
            variant='contained'
            onConfirm={() => { }}
            header={'Potvrdite brisanje'}
            message='Jeste li sigurni da želite obrisati ovaj zapis?'
        >
            Obriši
        </ConfirmButton>
        // @highlight-end
    )
}