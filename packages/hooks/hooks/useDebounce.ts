import { useState } from 'react';
import { useDebouncedEffect } from './useDebouncedEffect';

/**
 * Debounce hook.
 * @param value - Value to debounce.
 * @param delay - Delay in milliseconds.
 * @returns The debounced value.
 * @public
 */
export function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useDebouncedEffect(setDebouncedValue, [value, delay], delay);
    return debouncedValue;
}
