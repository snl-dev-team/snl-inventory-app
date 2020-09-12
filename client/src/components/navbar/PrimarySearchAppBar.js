import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import SearchBar from './SearchBar';
import Typography from '@material-ui/core/Typography';
import CenteredTabs from './FilterButton';
import app from '../../config/firebase';
import AddIcon from '@material-ui/icons/Add';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
	},

	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
}));

const PrimarySearchAppBar = (props) => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
		handleMobileMenuClose();
	};
	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};
	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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
			<MenuItem>
				<NavLink
					to="/create-user"
					style={{
						textDecoration: 'none',
						color: 'black',
					}}
				>
					Create User
				</NavLink>
			</MenuItem>
			<MenuItem onClick={() => app.auth().signOut()}>
				Sign Out ({app.auth().currentUser.email})
			</MenuItem>
		</Menu>
	);
	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			<MenuItem onClick={() => props.onSet(0)}>
				<p>Production</p>
			</MenuItem>
			<MenuItem onClick={() => props.onSet(1)}>
				<p>Inventory</p>
			</MenuItem>
			<MenuItem onClick={() => props.onSet(2)}>
				<p>Raw Materials</p>
			</MenuItem>
		</Menu>
	);

	return (
		<div
			style={{
				position: 'fixed',
				width: '100%',
				zIndex: '100',
			}}
		>
			<div className={classes.grow}>
				<AppBar position="static">
					<Toolbar>
						<Typography
							className={classes.title}
							variant="h6"
							noWrap
						>
							Sawgrass Nutra Labs
						</Typography>
						<SearchBar onSearch={(s) => props.onSearch(s)} />

						<div className={classes.grow} />
						<div className={classes.sectionDesktop}>
							<CenteredTabs
								onSet={(s) => props.onSet(s)}
								view={props.view}
							/>
						</div>
						<NavLink to="/create-product" variant="body2">
							{
								<div className="create new product">
									<IconButton>
										<AddIcon />
									</IconButton>
								</div>
							}
						</NavLink>
						<div className={classes.sectionMobile}>
							<IconButton
								aria-label="show more"
								aria-controls={mobileMenuId}
								aria-haspopup="true"
								onClick={handleMobileMenuOpen}
								color="inherit"
							>
								<MoreIcon />
							</IconButton>
						</div>
						<div onClick={handleProfileMenuOpen}>
							<IconButton
								aria-label="account of current user"
								aria-controls="primary-search-account-menu"
								aria-haspopup="true"
								color="inherit"
							>
								<AccountCircle />
							</IconButton>
						</div>
					</Toolbar>
				</AppBar>
				{renderMobileMenu}
				{renderMenu}
			</div>
		</div>
	);
};

export default PrimarySearchAppBar;
