'use client';

import { useState } from 'react';
import { useDebounce } from '@enterwell/react-hooks';
import { Button } from '@mui/material';

export function ExampleUseDebounce() {
    const [value, setValue] = useState(0);
    // @highlight-start
    const valueDebounced = useDebounce(value, 1000);
    // @highlight-end

    return (
        <div>
            <div>Value: {value}</div>
            <div>Value debounced (1s): {valueDebounced}</div>
            <Button variant='outlined' onClick={() => setValue((curr) => curr + 1)}>Increment</Button>
        </div>
    );
}