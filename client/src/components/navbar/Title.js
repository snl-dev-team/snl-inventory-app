import React from 'react';
import Typography from '@material-ui/core/Typography';
import useStyles from '../../styles/NavBarStyles';

const Title = () => {
	const classes = useStyles();
	return (
		<Typography className={classes.title} variant="h6" noWrap>
			Sawgrass Nutra Labs
		</Typography>
	);
};
export default Title;
