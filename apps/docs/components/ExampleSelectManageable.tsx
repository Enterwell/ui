import { Select, type SelectItem } from '@enterwell/react-ui';
import { Add, Edit } from '@mui/icons-material';
import { Button, IconButton, Typography } from '@mui/material';
import { Stack, Box } from '@mui/system';
import { useState } from 'react';

export function ExampleSelectManageable() {
    const [value, setValue] = useState<SelectItem[]>([]);

    return (
        <Box sx={{ width: 400 }}>
            {/* // @highlight-start */}
            <Select
            open
                value={value}
                onChange={(_, value) => setValue(value)}
                options={[
                    { value: '1', label: 'One' },
                    { value: '2', label: 'Two' },
                    { value: '3', label: 'Three' },
                    { value: '4', label: 'Four' },
                ]}
                displayOption={(option) => (
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{width: '100%'}} spacing={1}>
                        <Typography>{option.label}</Typography>
                        <IconButton size="small">
                            <Edit fontSize='small' />
                        </IconButton>
                    </Stack>
                )}
                listEndDecorator={(
                    <Button startIcon={<Add />} fullWidth>
                        Add
                    </Button>
                )}
                fullWidth
            />
            {/* // @highlight-end */}
        </Box>
    )
}