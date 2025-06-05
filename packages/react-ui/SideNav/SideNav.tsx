import { AppBar, AppBarProps, Drawer, List, Stack, Toolbar } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ReactNode } from 'react';
import { useControllableState } from '@enterwell/react-hooks';

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
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

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
