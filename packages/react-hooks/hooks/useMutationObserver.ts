import { MutableRefObject, useCallback, useEffect, useRef } from 'react'

/**
 * A type that represents either a React ref or a DOM node.
 * @public
 */
export type MaybeRef<T> = T | MutableRefObject<T>

function isRef(obj: unknown): boolean {
    return obj !== null &&
        typeof obj === 'object' &&
        Object.prototype.hasOwnProperty.call(obj, 'current');
}

function unRef<T = HTMLElement>(target: MaybeRef<T>): T {
    return isRef(target)
        ? (target as MutableRefObject<T>).current
        : (target as T);
}

/**
 * Watch for changes being made to the DOM tree.
 *
 * @param target - React ref or DOM node
 * @param callback - callback to execute when mutations are observed
 * @param options - Options passed to mutation observer
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
 * @see https://react-hooks-library.vercel.app/core/useMutationObserver
 * 
 * @public
 */
export function useMutationObserver(
    target: MaybeRef<Element | null | undefined>,
    callback: MutationCallback,
    options: MutationObserverInit = {}
) {
    const observer = useRef<MutationObserver | null>(null)

    const stop = useCallback(() => {
        if (!observer.current) return

        observer.current.disconnect()
        observer.current = null
    }, [])

    // On unmount, cleanup
    useEffect(() => stop, [stop]);

    useEffect(() => {
        const el = unRef(target);

        if (!(el && window)) return

        observer.current = new window.MutationObserver(callback)
        observer.current?.observe(el, options)

        return stop
    }, [callback, stop, options, target])

    return {
        stop
    }
}