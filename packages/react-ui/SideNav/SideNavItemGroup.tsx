import { Collapse, List, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useControllableState } from '@enterwell/react-hooks';
import { AddOutlined, RemoveOutlined } from '@mui/icons-material';
import { SideNavItemGroupContext } from './SideNavItemGroupContext';
import { itemBackgroundImageHighlight, itemHoverOpacity, itemOpacity } from './shared';

/**
 * The SideNavItemGroup component props.
 * @public
 */
export type SideNavItemGroupProps = PropsWithChildren<{
    label: string;
    expanded?: boolean;
    defaultExpanded?: boolean;
}>;

/**
 * The SideNavItemGroup component.
 * 
 * @param props - The component props.
 * @returns The react function component.
 * @public
 */
export function SideNavItemGroup({ children, label, expanded: controlledExpanded, defaultExpanded }: SideNavItemGroupProps) {
    const [expanded, setExpanded] = useControllableState(controlledExpanded, defaultExpanded ?? false);
    const handleToggleExpand = () => setExpanded(!expanded);
    const theme = useTheme();

    const contextValue = {
        inGroup: true
    };

    return (
        <>
            <ListItemButton
                sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 10px',
                    fontWeight: 600,
                    opacity: itemOpacity,
                    '&:hover': {
                        bgcolor: 'transparent',
                        opacity: itemHoverOpacity
                    }
                }}
                onClick={handleToggleExpand}
            >
                <ListItemText>
                    <Typography variant='body2' textTransform="uppercase" fontWeight={600}>
                        {label}
                    </Typography>
                </ListItemText>
                {expanded
                    ? (
                        <RemoveOutlined
                            color="primary"
                            sx={{ fontSize: 20 }}
                        />
                    ) : (
                        <AddOutlined
                            color="primary"
                            sx={{ fontSize: 20 }}
                        />
                    )}
            </ListItemButton>
            <Collapse
                in={expanded}
                sx={{ width: '100%' }}
            >
                <SideNavItemGroupContext.Provider value={contextValue}>
                    <List
                        disablePadding
                        sx={{
                            backgroundImage: itemBackgroundImageHighlight(theme),
                            borderRadius: '4px'
                        }}
                    >
                        {children}
                    </List>
                </SideNavItemGroupContext.Provider>
            </Collapse>
        </>
    );
}
