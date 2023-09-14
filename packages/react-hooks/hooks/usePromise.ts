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
 * @param promise - The function that returns promise or promise object to await.<br/>
 *                  - If `promise` argument is not provided ([falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)), the load is paused in loading state until `promise` is provided.<br/>
 *                  - If the function returns a promise or promise object is passed, the promise will be awaited.<br/>
 *                  - If the function returns undefined, the load is considered complete and empty.
 * @returns An object with the current state of the operation.
 * @public
 */
export function usePromise<T>(promise?: PromiseFunction<T>): UsePromiseResult<T> {
    const [state, setState] = useState<UsePromiseResult<T>>({ isLoading: true, item: undefined, error: undefined });
    const [, startTransition] = useTransition();
    const loadPromiseRef = useRef<Promise<T> | undefined>(undefined);

    useEffect(() => {
        let canceled = false;

        // Ignore if promise not provided or already loading and not canceled
        if (!promise || (loadPromiseRef.current && !canceled)) {
            return;
        }

        setState((curr) => ({ ...curr, isLoading: true }));

        console.log('usePromise', 'promiseProvided', JSON.stringify(promise), typeof promise, !promise)

        // Resolve as promise object or function
        loadPromiseRef.current = typeof promise === 'function' ? promise() : promise;

        // If promise is undefined, load is considered complete and empty
        if (!loadPromiseRef.current) {
            startTransition(() => {
                setState({ isLoading: false });
            });
            return;
        }

        loadPromiseRef.current
            .then(item => {
                loadPromiseRef.current = undefined;
                if (canceled) {
                    return;
                }
                startTransition(() => {
                    setState({ isLoading: false, item });
                });
            }).catch(err => {
                loadPromiseRef.current = undefined;
                if (canceled) {
                    return;
                }
                startTransition(() => {
                    setState({
                        isLoading: false,
                        error: Boolean(err) && 'toString' in err ? err.toString() : undefined
                    });
                });
            });

        return () => {
            canceled = true;
        };
    }, [promise]);

    return state;
}