import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
}));

const Title = () => {
	const classes = useStyles();
	return (
		<Typography className={classes.title} variant="h6" noWrap>
			Sawgrass Nutra Labs
		</Typography>
	);
};
export default Title;
