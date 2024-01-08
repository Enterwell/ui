import { useCallback, useState } from 'react';

import { useCallbackRef } from './useCallbackRef';

type SetStateFn<T> = (prevState?: T) => T;

/**
 * Use controllable state hook.
 * Use this hook when you want to control the state from outside or if outside state is not provided,
 * it will use the default value and you can control the state from inside.
 * 
 * @param value - The value from outside
 * @param defaultValue - The default value if the value is not provided
 * @param onChange - The callback when the value is changed
 * @returns The current value and the callback to set the value
 * @public
 */
export function useControllableState<T>(value: T | undefined, defaultValue?: T | undefined, onChange?: (newValue: T) => void) {
    const [state, setState] = useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : state;
    const setValueCallback = useCallbackRef(onChange);

    const setValue = useCallback(
        (nextValue: T | undefined) => {
            if (isControlled) {
                const setter = nextValue as SetStateFn<T>;
                const currentValue = typeof nextValue === 'function' ? setter(value) : nextValue;
                if (currentValue !== value) setValueCallback(currentValue as T);
            } else {
                setState(nextValue);
            }
        },
        [isControlled, setValueCallback, value, setState]
    );

    return [currentValue, setValue] as const;
}