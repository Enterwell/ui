import { useEffect } from "react";

/**
 * Hook that provides the debouncing functionality with a given callback.
 *
 * @param effect - Effect function to call on debounce
 * @param deps - Effect dependencies
 * @param delay - Debounce delay
 * @public
 */
export function useDebouncedEffect(effect: Function, deps: unknown[], delay: number) {
    useEffect(() => {
        const handler = setTimeout(() => effect(), delay);

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...(deps || []), delay]);
}