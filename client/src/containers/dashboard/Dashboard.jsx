import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {
  Route, useHistory, Redirect, useRouteMatch,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoiceDollar, faBoxOpen, faPills, faPrescriptionBottle,
} from '@fortawesome/free-solid-svg-icons';
import ListIcon from '@material-ui/icons/List';
import GridOnIcon from '@material-ui/icons/GridOn';
import ProductsDashboard from './Products';
import MaterialsDashboard from './Materials';
import OrdersDashboard from './Orders';
import CasesDashboard from './Cases';
import { signOut } from '../../actions/user';
import VIEW_MODES from '../../constants/viewModes';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();

  const [searchString, setSearchString] = useState('');
  const [searching, setSearching] = useState(false);

  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);

  const toggleViewMode = () => {
    setViewMode(
      viewMode === VIEW_MODES.GRID
        ? VIEW_MODES.CARDS : VIEW_MODES.GRID,
    );
  };

  const isMenuOpen = Boolean(anchorEl);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { isAuthorized } = useSelector((state) => state.user);
  if (!isAuthorized) return <Redirect to="/sign-in" />;

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => dispatch(signOut())}>Log out</MenuItem>
    </Menu>
  );

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const lowerCaseSearchString = searchString.toLowerCase();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            className={classes.title}
            variant="h6"
            noWrap
          >
            SNL Inventory Tracker
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={searchString}
              onFocus={() => setSearching(true)}
              onBlur={() => setSearching(false)}
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
            />
          </div>
          <IconButton
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={toggleViewMode}
          >
            {viewMode === VIEW_MODES.CARDS ? <ListIcon /> : <GridOnIcon /> }
          </IconButton>
          <IconButton
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            selected={useRouteMatch('/orders') !== null}
            button
            key="Orders"
            onClick={() => {
              history.push('/orders');
            }}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faFileInvoiceDollar} />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem
            button
            selected={useRouteMatch('/cases') !== null}
            key="Cases"
            onClick={() => {
              history.push('/cases');
            }}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faBoxOpen} />
            </ListItemIcon>
            <ListItemText primary="Cases" />
          </ListItem>
          <ListItem
            button
            selected={useRouteMatch('/products') !== null}
            key="Products"
            onClick={() => {
              history.push('/products');
            }}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faPrescriptionBottle} />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem
            selected={useRouteMatch('/materials') !== null}
            button
            key="Materials"
            onClick={() => history.push('/materials')}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faPills} />
            </ListItemIcon>
            <ListItemText primary="Materials" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route
          path="/materials"
          component={() => (
            <MaterialsDashboard
              viewMode={viewMode}
              searchString={lowerCaseSearchString}
              searching={searching}
            />
          )}
        />
        <Route
          path="/orders"
          component={() => (
            <OrdersDashboard
              viewMode={viewMode}
              searchString={lowerCaseSearchString}
              searching={searching}
            />
          )}
        />
        <Route
          path="/cases"
          component={() => (
            <CasesDashboard
              viewMode={viewMode}
              searchString={lowerCaseSearchString}
              searching={searching}
            />
          )}
        />
        <Route
          path="/products"
          component={() => (
            <ProductsDashboard
              viewMode={viewMode}
              searchString={lowerCaseSearchString}
              searching={searching}
            />
          )}
        />
        <Route exact path="/">
          <Redirect to="/materials" />
        </Route>
      </main>
      {renderMenu}
    </div>
  );
}
