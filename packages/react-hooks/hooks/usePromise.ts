import {
    useEffect,
    useRef,
    useState,
    useTransition
} from 'react';

/**
 * The result of a usePromise hook.
 * @public
 */
export type UsePromiseResult<T> = {
    item?: T | undefined;
    isLoading: boolean;
    error?: string | undefined;
};

/**
 * A function that returns a promise or undefined.
 * @public
 */
export type PromiseFunction<T> = (Promise<T> | undefined) | (() => Promise<T> | undefined);

/**
 * The hook is used to load data and handle loading and error states.
 * 
 * @param promise - The promise function to call. If it returns a promise, the promise will be awaited. If it returns undefined, the load is considered complete.
 * @returns An object with the current state of the load operation.
 * @public
 */
export function usePromise<T>(promise?: PromiseFunction<T>): UsePromiseResult<T> {
    const [state, setState] = useState<UsePromiseResult<T>>({ isLoading: true, item: undefined, error: undefined });
    const [, startTransition] = useTransition();
    const loadPromiseRef = useRef<Promise<T>>();

    useEffect(() => {
        (async () => {
            try {
                if (!promise || loadPromiseRef.current) {
                    return;
                }

                setState({ isLoading: true });

                loadPromiseRef.current = typeof promise === 'function' ? promise() : promise;
                const item = await loadPromiseRef.current;

                startTransition(() => {
                    setState({ isLoading: false, item });
                    loadPromiseRef.current = undefined;
                });
            } catch (err: any) {
                setState({ isLoading: false, error: err?.toString() });
                loadPromiseRef.current = undefined;
            }
        })();
    }, [promise]);

    return state;
}