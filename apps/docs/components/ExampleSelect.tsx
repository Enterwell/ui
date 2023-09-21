import { Select, type SelectItem } from '@enterwell/react-ui';
import { Box } from '@mui/material';
import { useState } from 'react';

export function ExampleSelect() {
    const [selected, setSelected] = useState<SelectItem[]>([]);

    return (
        <Box sx={{ width: 300 }}>
            {/* // @highlight-start */}
            <Select
                fullWidth
                items={[
                    { value: '1', label: 'One' },
                    { value: '2', label: 'Two' },
                    { value: '3', label: 'Three' },
                    { value: '4', label: 'Four' },
                ]}
                selected={selected}
                onChange={(_, value) => setSelected(value)}
                pageSize={20}
            />
            {/* // @highlight-end */}
        </Box>
    )
}