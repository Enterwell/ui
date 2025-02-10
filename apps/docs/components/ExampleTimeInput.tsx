'use client';

import { TimeInput } from '@enterwell/react-ui';
import { useState } from 'react';

export function ExampleTimeInput() {
    const [value, setValue] = useState('12:00');

    return (
        // @highlight-start
        <TimeInput
            value={value}
            onTimeChange={(setValue)} />
        // @highlight-end
    )
}