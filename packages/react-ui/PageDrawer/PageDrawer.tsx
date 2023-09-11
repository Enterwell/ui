import { type HTMLAttributes, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { Box } from '@mui/system';
import { ExpandMore } from '@mui/icons-material';
import { useDebounce, useResizeObserver } from '@enterwell/react-hooks';

/**
 * The PageDrawer component props.
 * @public
 */
export type PageDrawerProps = HTMLAttributes<HTMLDivElement> & {
  expanded?: boolean;
  onChange?: () => void;
};

/**
 * The PageDrawer component.
 * Component is displayed at the bottom of the page and can be expanded to show additional content.
 * @param props - The PageDrawer component props.
 * @returns The PageDrawer component.
 * @public
 */
export function PageDrawer({ expanded, onChange, children, ...rest }: PageDrawerProps): JSX.Element {
  const [drawerSize, setDrawerSize] = useState(0);
  const drawerSizeDebounced = useDebounce(drawerSize, 50);
  const resizeObserverRef = useResizeObserver((_, entry) => {
    setDrawerSize(entry.contentRect.height);
  });

  return (
    <>
      <Box sx={{ height: drawerSizeDebounced }} />
      <Accordion
        ref={resizeObserverRef}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          border: 'none',
          '&::before': {
            display: 'none'
          }
        }}
        expanded={expanded}
        onChange={onChange}
        {...rest}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            position: 'relative',
            minHeight: 32,
            height: 32,
            '.MuiAccordionSummary-expandIconWrapper': {
              bgcolor: 'rgba(234, 135, 20, 0.2)',
              color: '#EA8714',
              borderRadius: 1
            },
            '&.Mui-expanded': {
              minHeight: 24,
              height: 24,
            },
            '&::before': {
              display: 'block',
              content: '""',
              position: 'absolute',
              top: '40%',
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'background.default'
            }
          }}
        >
          <Box
            sx={{
              borderTop: '1px solid rgba(234, 135, 20, 0.2)',
              borderBottom: '1px solid rgba(234, 135, 20, 0.2) ',
              height: 3,
              width: '100%',
              position: 'absolute',
              left: 0,
              right: 0,
            }}
          />
        </AccordionSummary>
        <AccordionDetails sx={{
          bgcolor: 'background.default',
          maxHeight: '40vh',
          overflowX: 'hidden',
          overflowY: 'auto'
        }}
        >
          {children}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
