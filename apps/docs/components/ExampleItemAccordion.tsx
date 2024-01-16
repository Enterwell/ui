import { ItemAccordion, ItemAccordionDetails, ItemAccordionSummary, ItemAccordionActions } from '@enterwell/react-ui';
import { Button, Stack, Typography } from '@mui/material';

export function ExampleItemAccordion() {
    return (
        <ItemAccordion>
            <ItemAccordionSummary>
                <Stack width="160px">
                    <Typography fontSize={14} fontWeight="bold">
                        Test title
                    </Typography>
                </Stack>
                <Stack>
                    <Typography>Test summary text</Typography>
                </Stack>
            </ItemAccordionSummary>
            <ItemAccordionDetails></ItemAccordionDetails>
            <ItemAccordionActions>
                <Stack direction={'row'}>
                    <Button color='warning'>Delete</Button>
                    <Button color='success'>Update</Button>
                </Stack>
            </ItemAccordionActions>
        </ItemAccordion>
    )
}