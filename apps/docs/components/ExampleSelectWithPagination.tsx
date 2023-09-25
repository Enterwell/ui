import { Select, type SelectItem } from '@enterwell/react-ui';
import { Box } from '@mui/material';
import { useState } from 'react';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate server-side pagination with 1s delay.
async function getData(text: string | null, page: number, pageSize: number) {
    await delay(1000);
    return Array(pageSize).fill(null).map((_, i) => ({
        value: `${page * pageSize + i}`,
        label: `Option ${page * pageSize + i}`,
    }));
}

export function ExampleSelectWithPagination() {
    const [value, setValue] = useState<SelectItem[]>([]);
    const [options, setOptions] = useState<SelectItem[]>([]);

    {/* // @highlight-start */}
    const handlePage = async (text: string | null, page: number, pageSize: number) => {
        const data = await getData(text, page, pageSize);
        setOptions([
            ...options,
            ...data
        ]);
    };
    {/* // @highlight-end */}

    return (
        <Box sx={{ width: 300 }}>
            {/* // @highlight-start */}
            <Select
                value={value}
                onChange={(_, value) => setValue(value)}
                options={options}
                onPage={handlePage}
                pageSize={20}
                fullWidth
            />
            {/* // @highlight-end */}
        </Box>
    )
}