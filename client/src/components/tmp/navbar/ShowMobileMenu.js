import React from 'react';
import MoreIcon from '@material-ui/icons/MoreVert';
import useStyles from '../../styles/NavBarStyles';
import IconButton from '@material-ui/core/IconButton';
import { fade, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
}));
export default useStyles;

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
