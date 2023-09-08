import { DropdownButton } from '@enterwell/ui';
import { Save } from '@mui/icons-material';

export function ExampleDropdownButton() {
    return (
        <>
            <DropdownButton
                icon={<Save />}
                options={[
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                ]} />

            <hr className='h-4 border-r' />

            <DropdownButton
                options={[
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                ]}>
                Export
            </DropdownButton>
        </>
    )
}