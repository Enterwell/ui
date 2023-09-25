import { SplitButton } from '@enterwell/react-ui';

export function ExampleSplitButton() {
    return (
        // @highlight-start
        <SplitButton options={[
            { key: '1', value: 'Option 1' },
            { key: '2', value: 'Option 2' },
            { key: '3', value: 'Option 3' },
        ]}>
            Choose option
        </SplitButton>
        // @highlight-end
    )
}