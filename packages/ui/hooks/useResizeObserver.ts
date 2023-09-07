import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * The resize observer hook.
 * @param {function} callback The callback.
 * @returns {object} The ref.
 */
export default function useResizeObserver(callback: (element: never, entry: ResizeObserverEntry) => void) {
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
