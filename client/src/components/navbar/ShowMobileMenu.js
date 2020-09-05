import React from 'react';
import MoreIcon from '@material-ui/icons/MoreVert';
import useStyles from '../../styles/NavBarStyles';
import IconButton from '@material-ui/core/IconButton';

const ShowMobileMenu = () => {
	const classes = useStyles();
	return (
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
	);
};
export default ShowMobileMenu;