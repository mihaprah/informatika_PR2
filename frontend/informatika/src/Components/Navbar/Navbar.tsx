import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import HistoryIcon from '@mui/icons-material/History';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import History from '../History/History';
import Home from '../Home/Home';
import './navbar.css';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Navbar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [menudata, setMenudata] = React.useState("Domov");

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
     <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{backgroundColor: "#ffffff", color: 'black'}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={()=>{setOpen(!open)}}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
          <img src={`src/Images/informatika_logo.png`} width="300" height="55" />
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} id='backgroundcolor'>
        <DrawerHeader >
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
          
            <ListItem disablePadding sx={{ display: 'block', color: 'white',  backgroundColor: '#023E8A'}} onClick={()=> setMenudata("Domov")}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                   <HomeRoundedIcon sx={{ color: 'white' }}/>

                </ListItemIcon>
                <ListItemText primary="Domov" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            
            </ListItem>
            
            <ListItem disablePadding sx={{ display: 'block', color: 'white',  backgroundColor: '#023E8A'}} onClick={()=> setMenudata("Zgodovina")}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                <HistoryIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Zgodovina" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          
            <ListItem disablePadding sx={{ display: 'block', color: 'white',  backgroundColor: '#023E8A'}} onClick={()=> setMenudata("Primerjava")}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                
                <BarChartRoundedIcon sx={{ color: 'white' }} /> 

                </ListItemIcon>
                <ListItemText primary="Primerjava" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  {menudata == "Zgodovina" && <History/>}
                  {menudata == "Domov" && <Home/>}
      </Box>
    </Box>
    </>
  );
}