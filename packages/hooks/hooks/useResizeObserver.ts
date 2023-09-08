import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * The resize observer hook.
 * @param callback - The callback.
 * @returns The ref.
 * @public
 */
export function useResizeObserver(callback: (element: any, entry: ResizeObserverEntry) => void) {
    const ref = useRef(null);

    useIsomorphicLayoutEffect(() => {
        const element = ref?.current;
        if (!element) {
            return undefined;
        }

        const sizeObserver = new ResizeObserver((entries) => {
            callback(element, entries[0]);
        });

        sizeObserver.observe(element);
        return () => {
            sizeObserver.disconnect();
        };
    }, [callback, ref]);

    return ref;
}
