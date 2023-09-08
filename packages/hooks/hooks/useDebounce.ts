import { useState, useEffect } from 'react';

/**
 * Debounce hook.
 * @param value - Value to debounce.
 * @param delay - Delay in milliseconds.
 * @returns The debounced value.
 * @public
 */
export function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
