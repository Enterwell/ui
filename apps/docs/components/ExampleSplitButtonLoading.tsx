import { SplitButton } from '@enterwell/react-ui';

export function ExampleSplitButtonLoading() {
    return (
        // @highlight-start
        <SplitButton
            loading={true}
            options={[
                { key: '1', value: 'Option 1' },
                { key: '2', value: 'Option 2' },
                { key: '3', value: 'Option 3' },
            ]}>
            Choose option
        </SplitButton>
        // @highlight-end
    )
}