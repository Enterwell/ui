import {
  Button,
  ButtonGroup,
  type ButtonGroupProps,
  Popper,
  Paper,
  MenuItem,
  MenuList,
  ClickAwayListener,
  CircularProgress
} from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import {
  useState, useEffect, useRef, forwardRef, MouseEvent
} from 'react';

/**
 * Split button props.
 * @public
 */
export type SplitButtonProps = Omit<ButtonGroupProps, "onChange" | "onClick"> & {
  options: Array<{ key: string, value: string }>,
  loading?: boolean,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, option: { key: string, value: string }) => void,
  onChange?: (event: React.MouseEvent<HTMLLIElement>, option: { key: string, value: string }) => void,
}

/**
* The split button component.
* @param props - The props.
* @param ref - The reference.
* @returns The react function component.
* @public
*/
const SplitButton = forwardRef<HTMLButtonElement, SplitButtonProps>((props, ref) => {
  const {
    children,
    onClick,
    onChange,
    disabled,
    options,
    loading,
    variant = "contained",
    ...rest
  } = props;

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const anchorRef = useRef(null);

  // Reset selection
  useEffect(() => {
    setSelectedIndex(null);
  }, [options]);

  /**
   * Handle on main button click
   * @param event - The event.
   */
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled || selectedIndex === null || selectedIndex === undefined) {
      return;
    }
    const selectedItem = options[selectedIndex];
    if (onClick) {
      onClick(event, selectedItem);
    }
  };

  /**
   * Handle menu item click
   * @param event The event.
   * @param index Selected index.
   */
  const handleMenuItemClick = (event: MouseEvent<HTMLLIElement>, index: number) => {
    setSelectedIndex(index);
    if (onChange) {
      onChange(event, options[index]);
    }
    setOpen(false);
  };

  /**
   * Handle on toggle button click
   */
  const handleToggle = () => setOpen((prevOpen) => !prevOpen);

  /**
   * Handle on close
   */
  const handleClose = () => setOpen(false);

  return (
    <>
      <ButtonGroup disabled={disabled} variant={variant} {...rest}>
        <Button
          ref={ref}
          disabled={loading}
          onClick={handleClick}
          variant={variant}
          sx={{
            position: 'relative',
            '&.Mui-disabled': { pointerEvents: 'auto' },
            color: loading ? 'transparent !important' : undefined,
          }}
        >
          {loading && <CircularProgress size={16} sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }} />}
          {children}
        </Button>
        <Button onClick={handleToggle} ref={anchorRef}>
          <ArrowDropDown />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
      >
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList autoFocusItem>
              {options?.length > 0 ? options.map((option, index) => (
                <MenuItem
                  key={option.key}
                  selected={index === selectedIndex}
                  onClick={(e) => handleMenuItemClick(e, index)}
                >
                  {option.value}
                </MenuItem>
              )) : (
                <MenuItem disabled>Nema elemenata</MenuItem>
              )}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
});
SplitButton.displayName = 'SplitButton';

export { SplitButton };
