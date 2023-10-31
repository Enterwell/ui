import {
  useState,
  useRef,
  type HTMLAttributes,
  type ElementRef,
  type TouchEvent as ReactTouchEvent,
  type MouseEvent as ReactMouseEvent
} from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { Box } from '@mui/system';
import { ExpandMore } from '@mui/icons-material';

const isScrollable = (node: Element) => {
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    return false
  }
  const style = getComputedStyle(node)
  return ['overflow', 'overflow-x', 'overflow-y'].some((propertyName) => {
    const value = style.getPropertyValue(propertyName)
    return value === 'auto' || value === 'scroll'
  })
}

const getScrollParent = (node: Element): Element => {
  let currentParent = node.parentElement
  while (currentParent) {
    if (isScrollable(currentParent)) {
      return currentParent
    }
    currentParent = currentParent.parentElement
  }
  return document.scrollingElement || document.documentElement
}

/**
 * The PageDrawer component props.
 * @public
 */
export type PageDrawerProps = HTMLAttributes<HTMLDivElement> & {
  color?: string;
  expanded?: boolean;
  height?: number;
  minHeight?: number;
  onChange?: () => void;
  onResize?: (height: number | undefined) => void;
};

/**
 * The PageDrawer component.
 * Component is displayed at the bottom of the page and can be expanded to show additional content.
 * @param props - The PageDrawer component props.
 * @returns The PageDrawer component.
 * @public
 */
export function PageDrawer({
  expanded, 
  onChange,
  children,
  height, 
  minHeight = 50, 
  onResize,
  color, 
  ...rest 
}: PageDrawerProps) {
  const isResizingRef = useRef(false);
  const didResize = useRef(false);
  const ref = useRef<ElementRef<'div'>>(null);
  const contentRef = useRef<ElementRef<'div'>>(null);
  const handleRef = useRef<ElementRef<'div'>>(null);
  const [isExpanded, setIsExpanded] = useState(expanded ?? false);
  const realExpanded = expanded ?? isExpanded;

  const handleOnChange = () => {
    if (didResize.current)
      return;

    setIsExpanded(!realExpanded);
    if (onChange) {
      onChange();
    }
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    event.stopPropagation();

    isResizingRef.current = true;
    didResize.current = false;
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    didResize.current = false;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchMove = (event: TouchEvent) => {
    handleMove(event.touches[0].clientY);
  };

  const handleMouseMove = (event: MouseEvent) => {
    handleMove(event.clientY);
  };

  const handleMove = (clientY: number) => {
    if (!isResizingRef.current) return;

    const containerRect = ref.current?.getBoundingClientRect();
    const handleClientRect = handleRef.current?.getBoundingClientRect();
    let newHeight: number | undefined = (containerRect?.y ?? 0) + (containerRect?.height ?? 0) - clientY - (handleClientRect?.height ?? 0) / 2;

    // Correct for min height
    if (newHeight < minHeight) return;

    // Correct for max height
    // We use scroll parent as container because the drawer is sticky
    const containerClientRect = getScrollParent(ref.current ?? document.documentElement).getBoundingClientRect();
    if (newHeight > containerClientRect.height) {
      newHeight = containerClientRect?.height - (handleClientRect?.height ?? 0);
    }

    if (contentRef.current && newHeight != null) {
      didResize.current = true;
      contentRef.current.style.setProperty('height', `${newHeight}px`);
      if (onResize) {
        onResize(newHeight);
      }
    }
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (didResize.current) {
      event.stopPropagation();
    }

    isResizingRef.current = false;

    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (didResize.current) {
      event.preventDefault();
      event.stopPropagation();
    }

    isResizingRef.current = false;

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <Accordion
      ref={ref}
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
      expanded={realExpanded}
      onChange={handleOnChange}
      {...rest}
    >
      <AccordionSummary
        ref={handleRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
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
      <AccordionDetails
        ref={contentRef}
        sx={{
          bgcolor: 'background.default',
          overflowX: 'hidden',
          overflowY: 'auto',
          height: height ? `${height}px` : undefined,
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
