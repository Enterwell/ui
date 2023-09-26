import { ConfirmButton } from '@enterwell/react-ui';

export function ExampleConfirmButton() {
    return (
        // @highlight-start
        <ConfirmButton
            header={'Potvrdite brisanje'}
            message='Jeste li sigurni da želite obrisati ovaj zapis?'
            color="error"
            variant='contained'
            onConfirm={() => { }}>
            Obriši
        </ConfirmButton>
        // @highlight-end
    )
}