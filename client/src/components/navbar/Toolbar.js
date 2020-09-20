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

const Toolbar = (props) => {
	const [profileOpen, setProfileOpen] = React.useState(null);
	const handleProfileMenuOpen = (event) => {
		setProfileOpen(event.currentTarget);
	};
	const handleMenuClose = () => {
		setProfileOpen(null);
	};
	const menuId = 'primary-search-account-menu';
	const isMenuOpen = Boolean(profileOpen);
	const renderMenu = (
		<Menu
			profileOpen={profileOpen}
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
	return (
		<header className="toolbar">
			<nav className="toolbar__navigation">
				<div className="toolbar__logo">THE LOGO</div>
				<div>
					<SearchBar onSearch={(s) => props.onSearch(s)} />
				</div>
				<div className="spacer" />
				<div className="toolbar__navigation-items">
					<ul>
						<IconButton>
							<AddIcon />
						</IconButton>
						<IconButton>
							<DeleteIcon />
						</IconButton>
						<div onClick={handleProfileMenuOpen} />
						<IconButton
							aria-label="account of current user"
							aria-controls="primary-search-account-menu"
							aria-haspopup="true"
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
					</ul>
				</div>
			</nav>
			{renderMenu}
		</header>
	);
};
export default Toolbar;
