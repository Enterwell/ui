import MuiAccordionActions, { type AccordionActionsProps } from '@mui/material/AccordionActions';

/**
 * Item accordion actions component.
 * 
 * @param props -The props of the component 
 * @returns  The ItemAccordionActions component.
 * @public
 */
export function ItemAccordionActions(props: AccordionActionsProps) {

  return (
    <MuiAccordionActions {...props} sx={{ borderTop: '1px solid rgba(0, 0, 0, .125)', ...props.sx }} />
  );
}

export default ItemAccordionActions;
