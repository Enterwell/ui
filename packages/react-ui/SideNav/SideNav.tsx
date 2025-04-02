import { AppBar, AppBarProps, Collapse, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Theme, Toolbar, Typography, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PropsWithChildren, ReactNode, createContext, useContext } from 'react';
import { useControllableState } from '@enterwell/react-hooks';
import { AddOutlined, RemoveOutlined } from '@mui/icons-material';

const itemOpacity = 0.7;
const itemHoverOpacity = 0.9;

function itemBackgroundImageHighlight(theme: Theme, amount = 0.05) {
  return theme.palette.mode === "dark"
    ? `linear-gradient(180deg, rgba(255,255,255,${amount}) 0%, rgba(255,255,255,${amount}) 100%)`
    : `linear-gradient(180deg, rgba(0,0,0,${amount}) 0%, rgba(0,0,0,${amount}) 100%)`;
}

/**
 * The props for the SideNav component
 * @public
 */
export type SideNavProps = AppBarProps & {
  /**
   * @defaultValue 230px
   */
  width?: number | string;

  /**
   * @defaultValue 65px
   */
  headerHeight?: number | string;

  header?: ReactNode;

  endAdorner?: ReactNode;
};

/**
 * The SideNav component
 * 
 * @param props - The props
 * @returns The react function component.
 * @public
 */
export function SideNav({ children, sx, width = 230, headerHeight = 65, header, endAdorner, ...rest }: SideNavProps) {
  const [navOpen, setNavOpen] = useControllableState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => setNavOpen(false);

  return (
    <>
      <AppBar
        sx={{
          position: 'fixed',
          left: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1999,
          borderRadius: 0,
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundImage: 'none',
          backgroundColor: 'transparent',
          width: {
            xs: '100vw',
            md: width
          },
          ...sx
        }}
        {...rest}>
        <Toolbar
          sx={(theme) => ({
            zIndex: 1500,
            height: headerHeight,
            width: {
              md: width,
              xs: '100vw'
            },
            padding: {
              xs: 1.5,
              md: theme.spacing(1.5, 2.5)
            }
          })}>
          {header}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="top"
        open={navOpen}
        variant={isMobile ? 'temporary' : 'permanent'}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 0,
              backgroundImage: 'none',
              height: {
                md: '100vh',
                xs: navOpen ? '100vh' : 0
              },
              width: {
                xs: '100vw',
                md: width
              }
            }
          }
        }}
      >
        <Toolbar />
        <Stack height={1} justifyContent="space-between">
          <nav>
            <List sx={{ paddingX: 1.25, paddingY: 2 }}>
              {children}
            </List>
          </nav>
          {endAdorner}
        </Stack>
      </Drawer>
    </>
  );
};

/**
 * The SideNavItemGroup component props.
 * @public
 */
type SideNavItemGroupProps = PropsWithChildren<{
  label: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
}>;

const SideNavItemGroupContext = createContext({ inGroup: false });

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
  const child = groupContext?.inGroup;
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
          backgroundImage: child && selected ? itemBackgroundImageHighlight(theme) : 'none',
          "&:hover": {
            backgroundColor: 'transparent',
            backgroundImage: child ? itemBackgroundImageHighlight(theme) : 'none',
          }
        },
        opacity: child ? itemHoverOpacity : itemOpacity,
        ':hover': {
          opacity: itemHoverOpacity,
          backgroundColor: child ? itemBackgroundImageHighlight(theme) : 'transparent'
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
