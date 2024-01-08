import { useTheme } from '@mui/material';
import MuiAccordionActions, { type AccordionActionsProps } from '@mui/material/AccordionActions';

/**
 * Item accordion actions component.
 * 
 * @param props - The props of the component
 * @returns The ItemAccordionActions component.
 * @public
 */
export function ItemAccordionActions(props: AccordionActionsProps) {
  const theme = useTheme();
  return (
    <MuiAccordionActions {...props} sx={{ borderTop: '1px solid', borderTopColor: theme.palette.divider, ...props.sx }} />
  );
}

export default ItemAccordionActions;
