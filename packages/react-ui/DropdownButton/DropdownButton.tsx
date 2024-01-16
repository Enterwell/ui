import { Button, type ButtonProps, IconButton, List, ListItemButton, ListItemText, Popover } from '@mui/material';
import { type ReactElement, useId, useState, MouseEvent } from 'react';

/**
 * The type of the options of the {@link DropdownButton} component.
 * @public
 */
export type DropdownButtonOption = {
  label: string | ReactElement;
  value: string;
}

/**
 * The props of the {@link DropdownButton} component.
 * @public
 */
export type DropdownButtonProps = Omit<ButtonProps, 'onClick'> & {
  options?: DropdownButtonOption[];
  icon?: ReactElement;
  onClick?: (event: any, value: any) => void;
};

/**
 * A button that opens a dropdown menu when clicked.
 * @param props - The props of the component.
 * @returns The component.
 * @public
 */
export function DropdownButton({
  options, onClick, icon, ...rest
}: DropdownButtonProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleOnOptionClick = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, option: DropdownButtonOption) => {
    if (!onClick)
      return;
    
    event.stopPropagation();
    onClick(event, option.value);
    setOpen(false);
  };

  const handleOnClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen(false);
  };

  return (
    <>
      {icon ? (
        <IconButton
          {...rest}
          aria-describedby={id}
          onClick={handleButtonClick}
          disabled={!options?.length}
        >
          {icon}
        </IconButton>
      ) : (
        <Button
          {...rest}
          aria-describedby={id}
          onClick={handleButtonClick}
          disabled={!options?.length}
        />
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleOnClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List sx={{ minWidth: 240 }}>
          {options?.map((option) => (
            <ListItemButton key={option.value} onClick={(event) => handleOnOptionClick(event, option)}>
              {typeof option.label === 'string' ? (
                <ListItemText primary={option.label} />
              ) : (
                option.label
              )}
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
};
