import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion';

/**
 * Item accordion component.
 * 
 * @param props -The props of the component 
 * @returns  The ItemAccordion component.
 * @public
 */
export function ItemAccordion(props: AccordionProps) {
  return <MuiAccordion disableGutters {...props} />
};
