import MuiAccordionDetails, { type AccordionDetailsProps } from '@mui/material/AccordionDetails';

/**
 * Item accordion details component.
 * 
 * @param props -The props of the component 
 * @returns  The ItemAccordionDetails component.
 * @public
 */
export function ItemAccordionDetails(props: AccordionDetailsProps) {

  return (
    <MuiAccordionDetails {...props} sx={{ padding: 16, borderTop: '1px solid rgba(0, 0, 0, .125)', ...props.sx }} />
  );
}

export default ItemAccordionDetails;
