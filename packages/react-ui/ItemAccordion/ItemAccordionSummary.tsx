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
      sx={{ height: '52px' }}
      expandIcon={<ExpandMore color="primary" />}
      {...rest}
    >
      {children}
    </MuiAccordionSummary>
  );
}

export default ItemAccordionSummary;
