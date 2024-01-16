import { ConfirmButton } from '@enterwell/react-ui';
import { Delete } from '@mui/icons-material';

export function ExampleConfirmButtonIcon() {
    return (
        // @highlight-start
        <ConfirmButton
            iconButton
            color="error"
            variant='contained'
            onConfirm={() => { }}
            header={'Potvrdite brisanje'}
            message='Jeste li sigurni da želite obrisati ovaj zapis?'
        >
            <Delete />
        </ConfirmButton>
        // @highlight-end
    )
}