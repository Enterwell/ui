import MuiAccordionSummary, { type AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { ExpandMore } from '@mui/icons-material';
/**
 * Item accordion summary component.
 * 
 * @param props -The props of the component 
 * @returns  The ItemAccordionSummary component.
 * @public
 */
export function ItemAccordionSummary(props: AccordionSummaryProps) {
  const {
    children,
    ...rest
  } = props;

  return (
    <MuiAccordionSummary
      expandIcon={<ExpandMore color="primary" />}
      {...rest}
      sx={{ height: 56, ...rest.sx }}
    >
      {children}
    </MuiAccordionSummary >
  );
}

export default ItemAccordionSummary;
