import { ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import { PropsWithChildren, ReactNode, useContext } from 'react';
import { SideNavItemGroupContext } from './SideNavItemGroupContext';
import { itemBackgroundImageHighlight, itemHoverOpacity, itemOpacity } from './shared';

/**
 * The SideNavItem component props.
 * @public
 */
export type SideNavItemProps = PropsWithChildren<{
    href: string;
    icon?: ReactNode;
    selected?: boolean;
}>;

/**
 * The SideNavItem component
 * @param props - The component props
 * @returns The react function component.
 * @public
 */
export function SideNavItem({ children, href, selected, icon }: SideNavItemProps) {
    const groupContext = useContext(SideNavItemGroupContext);
    const isInGroup = groupContext?.inGroup;
    const theme = useTheme();

    return (
        <ListItemButton
            href={href}
            selected={selected}
            sx={{
                paddingX: 1.25,
                paddingY: 1.5,
                borderRadius: 1,
                fontWeight: 600,
                gap: 1,
                "&.Mui-selected": {
                    color: 'primary.main',
                    fill: 'primary.main',
                    backgroundColor: 'transparent',
                    backgroundImage: isInGroup && selected ? itemBackgroundImageHighlight(theme) : 'none',
                    "&:hover": {
                        backgroundColor: 'transparent',
                        backgroundImage: isInGroup ? itemBackgroundImageHighlight(theme) : 'none',
                    }
                },
                opacity: isInGroup ? itemHoverOpacity : itemOpacity,
                ':hover': {
                    opacity: itemHoverOpacity,
                    backgroundColor: isInGroup ? itemBackgroundImageHighlight(theme) : 'transparent'
                }
            }}>
            {icon && (
                <ListItemIcon
                    sx={{
                        minWidth: 'auto',
                        // '& > svg': { fill: selected ? 'primaryBase' : 'white' }
                    }}
                >
                    {icon}
                </ListItemIcon>
            )}
            <ListItemText>
                <Typography
                    variant='body2'
                    textTransform="uppercase"
                    fontWeight={600}
                    sx={{
                        // color: child && !selected ? whiteBase : 'inherit'
                    }}
                >
                    {children}
                </Typography>
            </ListItemText>
        </ListItemButton>
    );
};
