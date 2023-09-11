import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Use `useResizeObserver` to observe the size of an element. The hook returns a ref that you need to attach to the element you want to observe. The callback function is called with the element and the `ResizeObserverEntry` object.
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
