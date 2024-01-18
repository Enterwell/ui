import { DropdownButton } from '@enterwell/react-ui';
import { Save } from '@mui/icons-material';

export function ExampleDropdownButton() {
    return (
        <>
            {/* // @highlight-start */}
            <DropdownButton
                icon={<Save />}
                options={[
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                ]} />
            {/* // @highlight-end */}

            <hr className='h-4 border-r' />

            {/* // @highlight-start */}
            <DropdownButton
                options={[
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                ]}
            >
                Export
            </DropdownButton>
            {/* // @highlight-end */}
        </>
    )
}