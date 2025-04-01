'use client';

import { Select, type SelectItem } from '@enterwell/react-ui';
import { Box } from '@mui/material';
import { useState } from 'react';

export function ExampleSelect() {
    const [value, setValue] = useState<SelectItem[]>([]);

    return (
        <Box sx={{ width: 300 }}>
            {/* // @highlight-start */}
            <Select
                value={value}
                onChange={(_, value) => setValue(value)}
                options={[
                    { value: '1', label: 'One' },
                    { value: '2', label: 'Two' },
                    { value: '3', label: 'Three' },
                    { value: '4', label: 'Four' },
                ]}
                fullWidth
            />
            {/* // @highlight-end */}
        </Box>
    )
}