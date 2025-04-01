'use client';

import { DatePicker } from '@enterwell/react-ui';
import { useState } from 'react';

export function ExampleDatePicker() {
    const [value, setValue] = useState<Date | null>(new Date());

    return (
        // @highlight-start
        <DatePicker
            value={value}
            onChange={setValue}
        />
        // @highlight-end
    )
}