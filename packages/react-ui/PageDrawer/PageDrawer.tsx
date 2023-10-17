import { type HTMLAttributes, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { Box } from '@mui/system';
import { ExpandMore } from '@mui/icons-material';

/**
 * The PageDrawer component props.
 * @public
 */
export type PageDrawerProps = HTMLAttributes<HTMLDivElement> & {
  color?: string;
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
export function PageDrawer({ expanded, onChange, children, color, ...rest }: PageDrawerProps): JSX.Element {
  return (
    <Accordion
      sx={{
        position: 'sticky',
        inset: 'auto 0 0 0',
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
            bgcolor: color ?? 'primary.dark',
            color: 'primary.main',
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
            borderTop: '1px solid',
            borderBottom: '1px solid',
            borderColor: color ?? 'primary.dark',
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
  );
};
