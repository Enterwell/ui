'use client';

import { useState } from 'react';
import { useDebouncedEffect } from '@enterwell/react-hooks';

export function ExampleUseDebouncedEffect() {
    const [value, setValue] = useState(0);
    const [valueDebounced, setValueDebounced] = useState(0);
    // @highlight-start
    useDebouncedEffect(() => {
        setValueDebounced(value);
    }, [value], 1000);
    // @highlight-end

    return (
        <div>
            <div>Value: {value}</div>
            <div>Value debounced (1s): {valueDebounced}</div>
            <button onClick={() => setValue((curr) => curr + 1)}>Increment</button>
        </div>
    );
}