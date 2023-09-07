import React from 'react';

/**
 * Debounce hook.
 * @param {any} value Value to debounce.
 * @param {number} delay Delay in milliseconds.
 * @returns {any} The debounced value.
 */
export default function useDebounce(value: any, delay: number) {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
