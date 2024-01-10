import { useTheme } from '@mui/material';
import MuiAccordionDetails, { type AccordionDetailsProps } from '@mui/material/AccordionDetails';

/**
 * Item accordion details component.
 * 
 * @param props - The props of the component
 * @returns The ItemAccordionDetails component.
 * @public
 */
export function ItemAccordionDetails(props: AccordionDetailsProps) {
  const theme = useTheme();
  return (
    <MuiAccordionDetails {...props} sx={{ padding: 16, borderTop: '1px solid', borderTopColor: theme.palette.divider, ...props.sx }} />
  );
}

export default ItemAccordionDetails;
