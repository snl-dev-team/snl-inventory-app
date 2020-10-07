import '../../styles/toolbar.css';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchBar from './SearchBar';
import React from 'react';
import Menu from '@material-ui/core/Menu';
import { NavLink } from 'react-router-dom';
import app from '../../config/firebase';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';

const Toolbar = (props) => {
	const [profileOpen, setProfileOpen] = React.useState(null);
	const [moreOpen, setMoreOpen] = React.useState(null);
	const handleProfileMenuOpen = (event) => {
		setProfileOpen(event.currentTarget);
	};
	const handleMoreMenuOpen = (event) => {
		setMoreOpen(event.currentTarget);
	};
	const handleProfileMenuClose = () => {
		setProfileOpen(null);
	};
	const handleMoreMenuClose = () => {
		setMoreOpen(null);
	};
	const mobileMenuId = 'toolbar-more-menu';
	const isProfileMenuOpen = Boolean(profileOpen);
	const menuId = 'toolbar-account-menu';
	const isMobileMenuOpen = Boolean(moreOpen);
	const renderMobileMenu = (
		<Menu
			moreOpen={moreOpen}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={mobileMenuId}
			keepMounted
			open={isMobileMenuOpen}
			onClose={handleMoreMenuClose}
		>
			<MenuItem>Delete Item</MenuItem>
			<MenuItem>Create Item</MenuItem>
		</Menu>
	);
	const renderProfileMenu = (
		<Menu
			profileOpen={profileOpen}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={menuId}
			keepMounted
			open={isProfileMenuOpen}
			onClose={handleProfileMenuClose}
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
			<MenuItem onClick={() => {}}>Sign Out ()</MenuItem>
		</Menu>
	);
	return (
		<header className="toolbar">
			<nav className="toolbar__navigation">
				<div className="logo-div">logo</div>
				<div className="logo-word-div">
					<div className="toolbar__logo">INVENTORY</div>
				</div>
				<div>
					<SearchBar onSearch={(s) => props.onSearch(s)} />
				</div>
				<div className="spacer" />
				<div className="toolbar__navigation-items">
					<ul>
						<div className="button-div">
							<IconButton>
								<AddIcon htmlColor="white" />
							</IconButton>
							<IconButton>
								<DeleteIcon htmlColor="white" />
							</IconButton>
						</div>
						<div className="button-select-div">
							<IconButton
								onClick={handleMoreMenuOpen}
								aria-controls="toolbar-mobile-menu"
								aria-haspopup="true"
								color="inherit"
							>
								<MoreIcon htmlColor="white" />
							</IconButton>
						</div>
						<IconButton
							onClick={handleProfileMenuOpen}
							aria-label="account of current user"
							aria-controls="toolbar-account-menu"
							aria-haspopup="true"
							color="inherit"
						>
							<AccountCircle htmlColor="white" />
						</IconButton>
					</ul>
				</div>
			</nav>
			{renderMobileMenu}
			{renderProfileMenu}
		</header>
	);
};
export default Toolbar;
